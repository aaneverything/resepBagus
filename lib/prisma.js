import { PrismaClient } from '@prisma/client'; // ✅ default path

/**
 * Global variable to store Prisma client instance
 * @type {{ prisma?: PrismaClient }}
 */
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

