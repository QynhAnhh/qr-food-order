const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

const { verifyToken, checkRole } = require('../../middlewares/auth.mid');
const ROLES = require('../../constants/roles');

router.use(verifyToken);
router.use(checkRole(ROLES.ADMIN));

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
