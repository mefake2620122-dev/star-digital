import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const [totalInquiries, newInquiries, totalServices, totalReviews, totalAreas] =
      await Promise.all([
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { status: 'NEW' } }),
        prisma.service.count(),
        prisma.review.count(),
        prisma.serviceArea.count(),
      ])

    return jsonOk({ totalInquiries, newInquiries, totalServices, totalReviews, totalAreas })
  } catch {
    return jsonError('Failed to retrieve stats', 'SERVER_ERROR', 500)
  }
}
