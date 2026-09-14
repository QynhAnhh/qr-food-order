const express = require('express');
const router = express.Router();
const tableController = require('./table.controller');
const { verifyToken, checkRole } = require('../../middlewares/auth.mid');
const ROLES = require('../../constants/roles');

router.get('/:id/generate-token', verifyToken, checkRole(ROLES.ADMIN), tableController.generateTableToken);

router.use(verifyToken);
router.use(checkRole(ROLES.ADMIN));

router.get('/',tableController.getTables);
router.post('/',tableController.createTable);
router.put('/:id',tableController.updateTable);
router.delete('/:id',tableController.deleteTable);

module.exports = router;
