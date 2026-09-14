const express = require('express');
const router = express.Router();
const menuItemController = require('./menuItem.controller');
const { verifyToken, checkRole } = require('../../middlewares/auth.mid');
const ROLES = require('../../constants/roles');

router.get('/',menuItemController.getMenuItems);

router.use(verifyToken);
router.use(checkRole(ROLES.ADMIN));

router.post('/',menuItemController.createMenuItem);
router.put('/:id',menuItemController.updateMenuItem);
router.delete('/:id',menuItemController.deleteMenuItem);

module.exports = router;
