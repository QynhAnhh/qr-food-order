import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Vị trí file schema của bạn
  schema: 'prisma/schema.prisma',
  
  // Cấu hình kết nối cơ sở dữ liệu
  datasource: {
    url: env('DATABASE_URL'), // Lấy biến môi trường từ file .env
  },
  
  // Cấu hình cho Prisma Migrate
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
});