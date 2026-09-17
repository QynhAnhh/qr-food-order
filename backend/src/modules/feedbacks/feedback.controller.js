const prisma = require('../../lib/prisma.client');
const ERROR_CODES = require('../../constants/errorCodes');

// Gửi đánh giá
const submitFeedback = async (req, res, next) => {
    try {
        const {tableId, isTable} = req.user;
        const {content} = req.body;
        if(!isTable) {
            return res.status(400).json({ 
                success: false,
                message: "Chỉ có khách hàng mới được gửi đánh giá!"
            });
        }

        if(!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Nội dung đánh giá không được để trống"
            });
        }

        const latestOrder = await prisma.order.findFirst({
            where: {tableId}, orderBy: {createdAt: 'desc'}
        });

        if(!latestOrder) {
            return res.status(400).json({
                success: false,
                message: "Bàn này chưa có hóa đơn nào!"
            });
        }

        const feedback = await prisma.feedback.create({
            data: {
                tableId: tableId,
                orderId: latestOrder.id,
                content: content
            }
        });
        res.status(201).json({
            success: true,
            message: "Gửi đánh giá thành công!",
            data: feedback
        });
    } catch (error) {
        next(error);
    }
};

// Xem tất cả đánh giá
const getAllFeedbacks = async(req, res, next) => {
    try {
        const feedbacks = await prisma.feedback.findMany({
            include: {
                table: true,
                order: true
            }, orderBy: { createdAt: 'desc'}
        });

        res.status(200).json({
            success: true,
            data: feedbacks
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {submitFeedback, getAllFeedbacks};