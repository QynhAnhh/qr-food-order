const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");
const ERROR_CODES = require("../constants/errorCodes");
const logger = require("../lib/logger");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .json({ message: "Bạn chưa đăng nhập" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn("Xác thực Token thất bại", { error: error.message });
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .json({ message: "Thẻ đăng nhập hết hạn hoặc là giả!" });
  }
};

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      return res
        .status(ERROR_CODES.FORBIDDEN)
        .json({ message: "Bạn không có quyền" });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };
