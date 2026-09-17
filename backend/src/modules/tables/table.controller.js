const prisma = require('../../lib/prisma.client');
const ERROR_CODES = require('../../constants/errorCodes');
const jwt = require('jsonwebtoken');
const env = require('../../configs/env.config');

// Lấy danh sách tất cả bàn
const getTables = async (req, res, next) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: {id: 'desc'}  // giảm dần (descending), muốn sắp theo từ cũ đến mới nhất thì asc (ascending)
    });
    res.status(200).json({ success: true, data: tables});
  } catch(error) {
    next(error);
  }
};

// Thêm bàn mới
const createTable = async (req, res, next) => {
  try {
    const {name} = req.body;
    const existTable = await prisma.table.findFirst({
      where: { name },
    });
    if (existTable) {
      const error = new Error('Tên bàn này đã tồn tại!');
      error.statusCode = ERROR_CODES.CONFLICT;
      throw error;
    }
    const newTable = await prisma.table.create({ data: {name}});
    res.status(201).json ({ success: true, data: newTable});
  } catch(error){
    next(error);
  }
};

// Cập nhật bàn
const updateTable = async (req, res, next) => {
  try {
    const tableId = parseInt(req.params.id);
    const {name} = req.body;
    const existTable = await prisma.table.findFirst({
      where: {name}
    });
    if (existTable) {
      const error = new Error ('Tên bàn đã tồn tại!')
      error.statusCode = ERROR_CODES.CONFLICT;
      throw error;
    }
    const updateTable = await prisma.table.update({
      where: {id: tableId},
      data: {name}
    });
    res.status(200).json({success: true, data: updateTable});
  } catch(error){
    next(error);
  }
};

// Xóa bàn
const deleteTable = async (req, res, next) => {
  try {
    const tableId = parseInt(req.params.id);
    await prisma.table.delete({
      where: {id: tableId}
    });
    res.status(200).json({success: true, message: "Đã xóa bàn!"});
  } catch(error) {
    next(error);
  }
};

// Tạo token cho bàn
const generateTableToken = async (req, res, next) => {
  try {
    const tableId = parseInt(req.params.id);
    const table = await prisma.table.findFirst({
      where: {id: tableId}
    });
    if (!table){
      const error = new Error("Bàn không tồn tại!");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    }

    const tableToken = jwt.sign({
      tableId: table.id, isTable: true
    }, 
  env.JWT_SECRET);
  res.status(200).json({success: true, tableToken});
  } catch(error){
    next(error);
  }
};



module.exports = {getTables, createTable, updateTable, deleteTable, generateTableToken};