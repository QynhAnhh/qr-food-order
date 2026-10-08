const express = require('express');
const router = express.Router();
const menuItemController = require('./menuItem.controller');
const { verifyToken, checkRole } = require('../../middlewares/auth.mid');
const ROLES = require('../../constants/roles');
const validateBody = require("../../middlewares/validate.mid");
const { createMenuItemSchema, updateMenuItemSchema } = require("./menuItem.schema");
const uploadCloud = require('../../configs/cloudinary.config');


router.get('/',menuItemController.getMenuItems);

router.use(verifyToken);
router.use(checkRole(ROLES.ADMIN));

router.post('/',uploadCloud.single('image'),validateBody(createMenuItemSchema),menuItemController.createMenuItem);
router.put('/:id',uploadCloud.single('image'),validateBody(updateMenuItemSchema),menuItemController.updateMenuItem);
router.delete('/:id',menuItemController.deleteMenuItem);

module.exports = router;
