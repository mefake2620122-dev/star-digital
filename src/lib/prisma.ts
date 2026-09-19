import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function getDatabaseUrl() {
  const envUrl = process.env.DATABASE_URL || 'file:./dev.db'
  if (envUrl.startsWith('file:')) {
    let filePath = envUrl.replace('file:', '')
    if (filePath.startsWith('./')) filePath = filePath.slice(2)

    // Support Vercel serverless environment: copy bundled SQLite to writable /tmp
    if (process.env.VERCEL) {
      const srcPath = path.resolve(process.cwd(), 'prisma', 'dev.db')
      const tmpPath = path.resolve('/tmp', 'dev.db')
      try {
        if (!fs.existsSync(tmpPath) && fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, tmpPath)
        }
      } catch (e) {
        console.error('Failed to copy dev.db to /tmp:', e)
      }
      return `file:${tmpPath}`
    }

    if (!path.isAbsolute(filePath)) {
      filePath = filePath.includes('prisma')
        ? path.resolve(process.cwd(), filePath)
        : path.resolve(process.cwd(), 'prisma', filePath)
    }
    return `file:${filePath}`
  }
  return envUrl
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
