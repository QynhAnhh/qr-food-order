const ERROR_CODES = {
  BAD_REQUEST: 400,  // Khách gửi dữ liệu bậy bạ
  UNAUTHORIZED: 401, // Chưa đăng nhập
  FORBIDDEN: 403,    // Không có quyền truy cập
  NOT_FOUND: 404,    // Không tìm thấy
  CONFLICT: 409,     // Lỗi xung đột dữ liệu - VD: Khách và Phục vụ cùng bấm 1 nút
  SERVER_ERROR: 500  // Lỗi phía máy chủ
};

module.exports = ERROR_CODES;
