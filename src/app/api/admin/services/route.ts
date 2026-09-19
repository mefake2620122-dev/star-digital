import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const services = await prisma.service.findMany({
      include: { categories: true, issues: true },
      orderBy: { sortOrder: 'asc' },
    })
    return jsonOk(services)
  } catch {
    return jsonError('Failed to fetch services', 'SERVER_ERROR', 500)
  }
}
