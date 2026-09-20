import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'
import { revalidateAll } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const { customerName, area, rating, review, published } = await req.json()
    const updated = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...(customerName ? { customerName } : {}),
        ...(area ? { area } : {}),
        ...(rating !== undefined ? { rating: Number(rating) } : {}),
        ...(review ? { review } : {}),
        ...(published !== undefined ? { published } : {}),
      },
    })
    revalidateAll()
    return jsonOk(updated)
  } catch {
    return jsonError('Failed to update review', 'SERVER_ERROR', 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    await prisma.review.delete({ where: { id: params.id } })
    revalidateAll()
    return jsonOk({ message: 'Review deleted' })
  } catch {
    return jsonError('Failed to delete review', 'SERVER_ERROR', 500)
  }
}
