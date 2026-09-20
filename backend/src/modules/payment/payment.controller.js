const prisma = require('../../lib/prisma.client');
const crypto = require('crypto');
const axios = require('axios'); 
const { getIo } = require('../../configs/socket.config');
const logger = require('../../lib/logger');
const SOCKET_EVENTS = require('../../constants/socketEvents');
const ORDER_STATUS = require('../../constants/status');
const PAYMENT_METHODS = require('../../constants/paymentMethods');



const createPayment = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) }
        });

        if (!order || order.status !== ORDER_STATUS.IN_PROGRESS) {
            return res.status(400).json({ success: false, message: 'Hóa đơn không hợp lệ hoặc đã thanh toán' });
        }

        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        
        const requestId = partnerCode + new Date().getTime();
        const orderInfo = `Thanh toan Hoa don #${order.id}`;
        const redirectUrl = "http://localhost:5000/cam-on"; // Thanh toán xong thì MoMo chuyển khách về trang cảm ơn
        const ipnUrl = "http://localhost:5000/api/v1/payment/momo/ipn"; // Cái link để MoMo gọi báo tin nhắn thành công cho máy chủ của mình
        const amount = order.totalAmount.toString();
        const requestType = "captureWallet"; //dùng tiền trong ví MoMo hoặc tài khoản ngân hàng liên kết để trả
        const extraData = ""; // Dữ liệu bổ sung: {"nhanvien": "anh"}

        // tạo chữ ký thô theo quy định của Momo
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${order.id}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      
        const signature = crypto.createHmac('sha256', secretKey)  // hash-based Message Authentication Code, Secure Hash Algorithm 256-bit
            .update(rawSignature)
            .digest('hex'); // hệ lục lục phân (0-9, a-f)

        // Gói lại theo quy định của Momo
        const requestBody = {
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: order.id.toString(),
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: "vi",
            requestType: requestType,
            autoCapture: true,
            extraData: extraData,
            signature: signature
        };

        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);

        res.status(200).json({
            success: true,
            payUrl: response.data.payUrl 
        });

        // {
        //   status: 200,
        //   statusText: 'OK',
        //   headers: { ... },
        //   data: {
        //       partnerCode: "MOMO",
        //       orderId: "5",
        //       resultCode: 0,
        //       payUrl: "https://test-payment.momo.vn/..." // Mục tiêu
        //   }
        // }


    } catch (error) {
        next(error);
    }
};

const ipnWebhook = async (req, res, next) => {
    try {
        const { orderId, resultCode, transId } = req.body;

        // mã code: https://developers.momo.vn/v3/vi/docs/payment/api/result-handling/resultcode/
        if (resultCode === 0) {    // === 0 tức là thành công

            await prisma.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    status: ORDER_STATUS.COMPLETED,
                    paymentMethod: PAYMENT_METHODS.TRANSFER,
                    momoTransId: transId.toString()
                }
            });

            const io = getIo();
            io.emit(SOCKET_EVENTS.PAYMENT_SUCCESS, { 
                orderId: orderId, 
                message: `Hóa đơn #${orderId} đã thanh toán MoMo thành công!` 
            });
        }

        // Phải trả lời mã 204 (No Content) để MoMo biết mình ĐÃ NHẬN ĐƯỢC THƯ.
        // Nếu không trả lời, MoMo sẽ gửi lại bức thư này liên tục cả ngày.
        res.status(204).send();

    } catch (error) {
        logger.error("Lỗi Webhook MoMo:", error);
        res.status(204).send(); 
    }
};

module.exports = { createPayment, ipnWebhook };


