const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { verifyToken, checkRole } = require('../../middlewares/auth.mid');
const ROLES = require('../../constants/roles');

router.use(verifyToken);

router.use(checkRole(ROLES.ADMIN)); 

// Xem doanh thu
router.get('/revenue', reportController.getRevenue);

// Xem top món bán chạy
router.get('/top-items', reportController.getTopItems);

module.exports = router;
