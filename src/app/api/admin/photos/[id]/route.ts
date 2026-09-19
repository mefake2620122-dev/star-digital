import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

interface RouteParams {
  params: { id: string }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const { id } = params
    const body = await req.json()

    const photo = await prisma.photo.findUnique({ where: { id } })
    if (!photo) return jsonError('Photo not found', 'NOT_FOUND', 404)

    const updated = await prisma.photo.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.caption !== undefined && { caption: body.caption?.trim() || null }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl.trim() }),
        ...(body.category !== undefined && { category: body.category.trim() }),
        ...(body.location !== undefined && { location: body.location?.trim() || 'Kanpur' }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
        ...(body.published !== undefined && { published: Boolean(body.published) }),
      },
    })

    return jsonOk(updated)
  } catch (error) {
    console.error('Failed to update photo:', error)
    return jsonError('Failed to update photo', 'SERVER_ERROR', 500)
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const { id } = params
    const photo = await prisma.photo.findUnique({ where: { id } })
    if (!photo) return jsonError('Photo not found', 'NOT_FOUND', 404)

    await prisma.photo.delete({ where: { id } })
    return jsonOk({ message: 'Photo deleted successfully' })
  } catch (error) {
    console.error('Failed to delete photo:', error)
    return jsonError('Failed to delete photo', 'SERVER_ERROR', 500)
  }
}
