// Prisma 客户端
// 需要配置 DATABASE_URL 并运行 npx prisma generate 后生效
// 当前开发阶段：PrismaClient 暂未生成

// @ts-ignore
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
