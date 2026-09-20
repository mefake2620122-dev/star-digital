import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'
import { revalidateAll } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const reviews = await prisma.review.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return jsonOk(reviews)
  } catch {
    return jsonError('Failed to fetch reviews', 'SERVER_ERROR', 500)
  }
}

export async function POST(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const body = await req.json()
    const { customerName, area, rating, review, published } = body

    if (!customerName?.trim() || !review?.trim()) {
      return jsonError('Customer Name and Review are required', 'VALIDATION_ERROR', 400)
    }

    const newReview = await prisma.review.create({
      data: {
        customerName: customerName.trim(),
        area: area?.trim() || 'Kanpur',
        rating: typeof rating === 'number' ? rating : 5,
        review: review.trim(),
        isPlaceholder: false,
        published: published !== undefined ? Boolean(published) : true,
        sortOrder: 0,
      },
    })

    revalidateAll()
    return jsonOk(newReview, 201)
  } catch (error) {
    console.error('Failed to create review:', error)
    return jsonError('Failed to create review', 'SERVER_ERROR', 500)
  }
}
