const express = require('express');
const router = express.Router();
const feedbackController = require('./feedback.controller');
const { verifyToken, checkRole } = require('../../middlewares/auth.mid');
const ROLES = require('../../constants/roles');

router.use(verifyToken);

router.post('/', feedbackController.submitFeedback);

router.get('/', checkRole(ROLES.ADMIN), feedbackController.getAllFeedbacks);

module.exports = router;
