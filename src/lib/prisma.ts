import { PrismaClient } from "@prisma/client";

// 개발 환경에서 Hot Reload 시 Prisma Client 중복 생성을 막는 패턴
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
