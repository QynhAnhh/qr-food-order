const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const { verifyToken, checkRole } = require('../../middlewares/auth.mid');
const ROLES = require('../../constants/roles');

router.use(verifyToken);

router.post('/', orderController.submitOrder);

router.get('/my-table', orderController.getTableOrder);

router.get('/active', checkRole(ROLES.ADMIN, ROLES.WAITER, ROLES.KITCHEN), orderController.getActiveOrders);

router.patch('/items/:itemId/status', checkRole(ROLES.ADMIN, ROLES.WAITER, ROLES.KITCHEN), orderController.updateItemStatus);

router.patch('/items/status/bulk', checkRole(ROLES.ADMIN, ROLES.WAITER, ROLES.KITCHEN), orderController.updateMultipleItemsStatus);

router.patch('/:orderId/checkout', checkRole(ROLES.ADMIN, ROLES.WAITER), orderController.checkoutOrder);


module.exports = router;
