// Bộ điều khiển tính năng Quản lý Nhân viên
const prisma = require("../../lib/prisma.client");
const { hashPassword } = require("../../lib/hash");
const ERROR_CODES = require("../../constants/errorCodes");

// Lấy danh sách tất cả nhân viên
const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Thêm nhân viên
const createUser = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    const existUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existUser) {
      const error = new Error("Tên đăng nhập đã tồn tại!");
      error.statusCode = ERROR_CODES.CONFLICT;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
      select: { id: true, username: true, role: true },
    });

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công!",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa nhân viên
const deleteUser = async (req, res, next) => {
  try {
    const userId = Number.parseInt(req.params.id);
    await prisma.user.delete({
      where: { id: userId },
    });
    res.status(200).json({
      success: true,
      message: "Đã xóa tài khoản khỏi hệ thống!",
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật nhân viên
const updateUser = async (req, res, next) => {
  try {
    const userId = Number.parseInt(req.params.id);
    const { role, password } = req.body;

    const updateData = {};
    if (role) {
      updateData.role = role;
    }

    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Cập nhật dữ liệu thành công!",
      data: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, createUser, deleteUser, updateUser };
