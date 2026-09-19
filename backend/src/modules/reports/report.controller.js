const prisma = require('../../lib/prisma.client');

// Tính tổng doanh thu
const getRevenue = async(req, res, next) => {
    try {
        const {startDate, endDate} = req.query;  //req.query lấy dữ liệu từ đường dẫn
        let dateFilter ={};
        if(startDate && endDate) {
            dateFilter = {
                createdAt: {
                    gte: new Date(startDate), lte: new Date(endDate) //gte: greater than or equal và lte: less than or equal
                }
            };
        }

        const result = await prisma.order.aggregate({ // aggregate: Object nhiều ngăn. Bắt Database tự tính toán (tổng/trung bình/đếm...) và chỉ trả về ĐÚNG 1 con số kết quả cuối cùng và để vào 1 ngăn.
            _sum: {
                totalAmount: true
            }, where: {
                status: 'COMPLETED', ...dateFilter
            }
        });
        res.status(200).json({
            success: true,
            data: {
                totalRevenue: result._sum.totalAmount || 0
            }
        });

    } catch(error) {
        next(error);
    }
};

// Tính top món ăn 
const getTopItems = async (req, res, next) => {
    try {
        const topItems = await prisma.orderDetail.groupBy({
            by: ['menuItemId'], // Trả về id
            _sum: {
                quantity: true
            },
            where: {
                status: { not: 'CANCELLED' }
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        });

        const menuItemIds = topItems.map(monAn => monAn.menuItemId);
        
        const menuDetails = await prisma.menuItem.findMany({
            where: {
                id: { in: menuItemIds }
            }
        });
        // Gắn tên món vào danh sách topItems
        const result = topItems.map(monAn => {
            const detail = menuDetails.find(m => m.id === monAn.menuItemId);
            return {
                menuItemId: monAn.menuItemId,
                name: detail ? detail.name : 'Món đã bị xóa',
                totalSold: monAn._sum.quantity
            };
        });
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};
module.exports = { getRevenue, getTopItems };