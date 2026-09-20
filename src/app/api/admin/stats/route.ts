import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const [totalInquiries, newInquiries, totalServices, totalReviews, totalAreas, totalPricing, totalPhotos] =
      await Promise.all([
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { status: 'NEW' } }),
        prisma.service.count(),
        prisma.review.count(),
        prisma.serviceArea.count(),
        prisma.pricingItem.count(),
        prisma.photo.count(),
      ])

    return jsonOk({
      totalInquiries,
      newInquiries,
      totalServices,
      totalReviews,
      totalAreas,
      totalPricing,
      totalPhotos,
    })
  } catch {
    return jsonError('Failed to retrieve stats', 'SERVER_ERROR', 500)
  }
}
