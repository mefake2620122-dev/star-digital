import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const areas = await prisma.serviceArea.findMany({ orderBy: { sortOrder: 'asc' } })
    return jsonOk(areas)
  } catch {
    return jsonError('Failed to fetch areas', 'SERVER_ERROR', 500)
  }
}
