import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'
import { revalidateAll } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const photos = await prisma.photo.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return jsonOk(photos)
  } catch (error) {
    console.error('Failed to fetch admin photos:', error)
    return jsonError('Failed to fetch photos', 'SERVER_ERROR', 500)
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const body = await req.json()
    const { title, caption, imageUrl, category, location, sortOrder, published } = body

    if (!title?.trim() || !imageUrl?.trim()) {
      return jsonError('Title and Image URL are required', 'VALIDATION_ERROR', 400)
    }

    const newPhoto = await prisma.photo.create({
      data: {
        title: title.trim(),
        caption: caption?.trim() || null,
        imageUrl: imageUrl.trim(),
        category: category?.trim() || 'repair',
        location: location?.trim() || 'Kanpur',
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        published: typeof published === 'boolean' ? published : true,
      },
    })

    revalidateAll()
    return jsonOk(newPhoto, 201)
  } catch (error) {
    console.error('Failed to create photo:', error)
    return jsonError('Failed to create photo', 'SERVER_ERROR', 500)
  }
}
