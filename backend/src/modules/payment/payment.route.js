const express = require('express');
const router = express.Router();
const { createPayment, ipnWebhook } = require('./payment.controller');
const { verifyToken } = require('../../middlewares/auth.mid');

router.post('/momo/create', verifyToken, createPayment);

router.post('/momo/ipn', ipnWebhook);

module.exports = router;
