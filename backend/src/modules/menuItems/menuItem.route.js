const express = require('express');
const router = express.Router();
const menuItemController = require('./menuItem.controller');
const { verifyToken, checkRole } = require('../../middlewares/auth.mid');
const ROLES = require('../../constants/roles');
const validateBody = require("../../middlewares/validate.mid");
const { createMenuItemSchema, updateMenuItemSchema } = require("./menuItem.schema");

router.get('/',menuItemController.getMenuItems);

router.use(verifyToken);
router.use(checkRole(ROLES.ADMIN));

router.post('/',validateBody(createMenuItemSchema),menuItemController.createMenuItem);
router.put('/:id',validateBody(updateMenuItemSchema),menuItemController.updateMenuItem);
router.delete('/:id',menuItemController.deleteMenuItem);

module.exports = router;
