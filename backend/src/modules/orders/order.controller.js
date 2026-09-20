const prisma = require('../../lib/prisma.client');
const ERROR_CODES = require('../../constants/errorCodes');
const { getIo } = require('../../configs/socket.config');
const SOCKET_EVENTS = require('../../constants/socketEvents');
const ORDER_STATUS = require('../../constants/status');


// Gọi món
const submitOrder = async (req, res, next) => {
    try {
        const {tableId, isTable} = req.user;
        if(!isTable) {
            const error = new Error("Chỉ khách hàng quét mã QR mới được dùng chức năng này!");
            error.statusCode = ERROR_CODES.FORBIDDEN;
            throw error;
        }

        const {items: cartItems} = req.body;
        if (!cartItems || cartItems.length ===0) {
            return res.status(400).json({success: false, message: "Giỏ hàng trống"});
        }
        const result = await prisma.$transaction( async(tx) => {
            let currentOrder = await tx.order.findFirst({
                where: {tableId, status: ORDER_STATUS.IN_PROGRESS}, include: { items: {orderBy: {batchId: 'desc'}, take: 1}}
            });

            let nextBatchId = 1;
            if(!currentOrder) {
                currentOrder = await tx.order.create({
                    data: {tableId, status: ORDER_STATUS.IN_PROGRESS}
                });
            } else {
                if (currentOrder.items.length > 0) {
                    nextBatchId = currentOrder.items[0].batchId + 1;
                }
            }

            for (const cartItem of cartItems) {
                const menuItem = await tx.menuItem.findUnique({
                    where: {id: cartItem.menuItemId}
                });

                if (!menuItem || !menuItem.isActive) {
                    const error = new Error(`Món ăn ID ${cartItem.menuItemId} không tồn tại hoặc đã ngừng bán!`);
                    error.statusCode = ERROR_CODES.NOT_FOUND;
                    throw error;
                }


                await tx.orderDetail.create({
                    data: {
                        orderId: currentOrder.id,
                        menuItemId: cartItem.menuItemId,
                        quantity: cartItem.quantity,
                        priceAtOrder: menuItem.price,
                        batchId: nextBatchId
                    }
                });

                await tx.order.update({
                    where: {
                        id: currentOrder.id
                    }, data: {
                        totalAmount: {
                            increment: menuItem.price * cartItem.quantity
                        }
                    }
                });
            }
            
            return currentOrder;
            });

        getIo().emit(SOCKET_EVENTS.ORDER_NEW, { tableId, message: `Bàn ${tableId} vừa gọi món mới!`, data: result});

        res.status(200).json({success: true, message: "Đặt món thành công!", data: result});
    } catch(error){
        next(error);
    }
};


// Lấy hóa đơn theo bàn
const getTableOrder = async (req, res, next) => {
    try {
        const {tableId, isTable} = req.user;
        if(!isTable) {
            const error = new Error("Chỉ khách hàng quét mã QR mới được dùng chức năng này!");
            error.statusCode = ERROR_CODES.FORBIDDEN;
            throw error;
        }
        const currentOrder = await prisma.order.findFirst({
            where: { tableId, status: ORDER_STATUS.IN_PROGRESS},
            include: {
                items: {
                    include: {
                        menuItem: true
                    }
                }
            }
        });

        if (!currentOrder) {
            return res.status(200).json({success: true, message: "Bàn chưa có hóa đơn nào!", data: null});
        }
    
        res.status(200).json({success: true, data: currentOrder});
    } catch (error) {
        next(error);
    }
};


// Lấy danh sách các hóa đơn đang hoạt động
const getActiveOrders = async (req, res, next) => {
    try {
        const { role } = req.user;

        // Bếp chỉ xem món đã duyệt. Phục vụ/Admin xem tất cả món chờ duyệt.
        let itemFilter = { status: { not: ORDER_STATUS.CANCELLED } }; 
        if (role === 'KITCHEN') {
            itemFilter = { status: { in: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY] } };
        }

        const activeOrders = await prisma.order.findMany ({
            where: {status: ORDER_STATUS.IN_PROGRESS}, include: {
                table: true, 
                items: {
                    where: itemFilter,
                    include: {
                        menuItem: true
                    },
                    orderBy: {batchId: 'asc'}
                }
            },
            orderBy: {createdAt: 'asc'}
        });

        res.status(200).json({
            success: true, data: activeOrders
        });
    } catch(error){
        next(error);
    }
};


// Cập nhật trạng thái món ăn
const updateItemStatus = async (req, res, next) => {
    try {
        const itemId = parseInt(req.params.itemId);
        const { status } = req.body; 
        const updatedItem = await prisma.orderDetail.update({
            where: { id: itemId },
            data: { status }
        });

        getIo().emit(SOCKET_EVENTS.ORDER_STATUS_CHANGE, {
            itemId: updatedItem.id,
            status: updatedItem.status,
            message: `Món ${updatedItem.id} vừa được chuyển sang trạng thái ${updatedItem.status}` 
        });

        res.status(200).json({ success: true, message: "Cập nhật món thành công!", data: updatedItem });
    } catch (error) {
        next(error);
    }
};

// Cập nhật trạng thái nhiều món ăn
const updateMultipleItemsStatus = async (req, res, next) => {
    try {
        const {itemIds, status} = req.body;
        if (!itemIds || itemIds.length === 0) 
        return res.status(400).json({
    success: false, message: "Vui lòng chọn ít nhất 1 món!"
    });
    const result = await prisma.orderDetail.updateMany({
        where: { id: { in: itemIds } },
        data: {status}
    });

    getIo().emit(SOCKET_EVENTS.ORDER_STATUS_CHANGE, {
        message: `${result.count} món ăn vừa được chuyển sang trạng thái ${status}`
    });


    res.status(200).json({
        success: true, message: `Đã cập nhật trạng thái thành công!`
    });
    } catch (error) {
        next(error);
    }
};


// Thanh toán hóa đơn
const checkoutOrder = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.orderId);
        const completedOrder = await prisma.order.update({
            where: {id: orderId},
            data: {status: ORDER_STATUS.COMPLETED}
        });
        res.status(200).json({
            success: true, message: "Thanh toán thành công!", data: completedOrder
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {submitOrder, getTableOrder, getActiveOrders, updateItemStatus, checkoutOrder, updateMultipleItemsStatus};