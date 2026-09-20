const prisma = require("../../lib/prisma.client");
const ERROR_CODES = require("../../constants/errorCodes");

// Lấy danh sách món ăn
const getMenuItems = async (req, res, next) => {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: { id: "desc" },
    });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// Thêm món ăn
const createMenuItem = async (req, res, next) => {
  try {
    const { name, price, description, imageUrl } = req.body;

    const existedItem = await prisma.menuItem.findFirst({
      where: { name },
    });

    if (existedItem) {
      const error = new Error("Tên món ăn đã tồn tại!");
      error.statusCode = ERROR_CODES.CONFLICT;
      throw error;
    }

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        price,
        description,
        imageUrl,
      },
    });

    res.status(201).json({
      success: true,
      message: "Thêm món ăn thành công!",
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa món ăn
const deleteMenuItem = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id);
    await prisma.menuItem.delete({
      where: { id },
    });
    res.status(200).json({
      success: true,
      message: "Đã xóa món ăn",
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật món ăn
const updateMenuItem = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id);
    const { name, price, description, imageUrl } = req.body;
    const existMenuItem = await prisma.menuItem.findFirst({
      where: { name },
    });
    if (existMenuItem) {
      const error = new Error("Tên món đã tồn tại!");
      error.statusCode = ERROR_CODES.CONFLICT;
      throw error;
    }

    const updateMenuItem = await prisma.menuItem.update({
      where: { id },
      data: { name, price, description, imageUrl },
    });
    res.status(200).json({ success: true, data: updateMenuItem });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  createMenuItem,
  deleteMenuItem,
  updateMenuItem,
};
