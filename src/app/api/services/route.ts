import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonOk, jsonError } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      include: { categories: { where: { active: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    })
    return jsonOk(services)
  } catch {
    return jsonError('Failed to fetch services', 'SERVER_ERROR', 500)
  }
}
