const { z } = require("zod");

const createMenuItemSchema = z.object({
  name: z.string().min(2, "Tên món ăn phải có ít nhất 2 ký tự"),
  price: z.number().positive("Giá tiền phải lớn hơn 0"),
  description: z.string().optional(),
  imageUrl: z.string().url("Đường dẫn ảnh không hợp lệ").optional(),
});

const updateMenuItemSchema = createMenuItemSchema.partial();

module.exports = { createMenuItemSchema, updateMenuItemSchema };
