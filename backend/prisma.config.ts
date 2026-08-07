import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  migrate: {
    connectionUrl: process.env.DATABASE_URL,
  },
});