import { PrismaClient } from "@prisma/client";

declare global {
  // 이 타입 선언을 통해 globalThis.prisma 인식 가능
  var prisma: PrismaClient | undefined;
}

export {};
