const express = require('express');
const router = express.Router();

const authRoutes = require('../../modules/auth/auth.route');
const userRoutes = require('../../modules/users/user.route');
const tableRoutes = require('../../modules/tables/table.route');
const menuItemRoutes = require('../../modules/menuItems/menuItem.route');
const orderRoutes = require('../../modules/orders/order.route');
const feedbackRoutes = require('../../modules/feedbacks/feedback.route');
const reportRoutes = require('../../modules/reports/report.route');
const paymentRoutes = require('../../modules/payment/payment.route');

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use('/tables', tableRoutes);
router.use('/menu-items', menuItemRoutes);
router.use('/orders', orderRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/reports', reportRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;
