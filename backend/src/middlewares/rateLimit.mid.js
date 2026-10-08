const rateLimit = require("express-rate-limit");
const ERROR_CODES = require("../constants/errorCodes");

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Khung thời gian: 1 phút
  max: 60, // Giới hạn tối đa: 60 lần gọi API / 1 phút (Tính ra 1 giây bấm 1 lần)
  message: {
    success: false,
    message: "Bạn thao tác quá nhanh, vui lòng nghỉ tay một lát nhé!",
  },
  statusCode: ERROR_CODES.TOO_MANY_REQUESTS,
  standardHeaders: true, // Gửi thông tin giới hạn vào Header của trình duyệt (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
  legacyHeaders: false, // Không gửi thông tin giới hạn vào Header cũ (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
});

module.exports = apiLimiter;
