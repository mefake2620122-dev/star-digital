import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } })
    return jsonOk(reviews)
  } catch {
    return jsonError('Failed to fetch reviews', 'SERVER_ERROR', 500)
  }
}
