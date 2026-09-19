import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { jsonOk, jsonError } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/reviews
 * Returns all active, published customer reviews ordered newest first
 */
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return jsonOk(reviews)
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return jsonError('Failed to fetch reviews', 'SERVER_ERROR', 500)
  }
}

/**
 * POST /api/reviews
 * Allows website visitors to instantly post real-time genuine customer reviews
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, area, rating, review, appliance } = body

    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return jsonError('Please enter your name (at least 2 characters)', 'INVALID_NAME', 400)
    }

    if (!area || typeof area !== 'string' || area.trim().length < 2) {
      return jsonError('Please specify your Kanpur locality / area', 'INVALID_AREA', 400)
    }

    if (!review || typeof review !== 'string' || review.trim().length < 5) {
      return jsonError('Please share your review details (at least 5 characters)', 'INVALID_REVIEW', 400)
    }

    const numRating = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)))

    const trimmedArea = area.trim().slice(0, 60)
    const applianceTag = appliance && typeof appliance === 'string' && appliance.trim().length > 0
      ? appliance.trim().slice(0, 40)
      : null

    const formattedArea = applianceTag ? `${trimmedArea} • ${applianceTag}` : trimmedArea

    const newReview = await prisma.review.create({
      data: {
        customerName: customerName.trim().slice(0, 60),
        area: formattedArea,
        rating: numRating,
        review: review.trim().slice(0, 1000),
        isPlaceholder: false,
        published: true,
        sortOrder: 0,
      },
    })

    try {
      revalidatePath('/')
      revalidatePath('/about')
    } catch {
      // safe fallback
    }

    return jsonOk(newReview, 201)
  } catch (error) {
    console.error('Error submitting review:', error)
    return jsonError('Failed to submit review', 'SERVER_ERROR', 500)
  }
}
