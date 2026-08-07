const prisma = require('../../lib/prisma.client');
const { comparePassword } = require("../../lib/hash");
const jwt = require("jsonwebtoken");
const ERROR_CODES = require("../../constants/errorCodes");
const env = require("../../configs/env.config");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      const error = new Error("Tài khoản không tồn tại!");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Mật khẩu không chính xác!");
      error.statusCode = ERROR_CODES.UNAUTHORIZED;
      throw error;
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      data: {
        token: token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { login };
