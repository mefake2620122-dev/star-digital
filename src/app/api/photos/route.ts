import { prisma } from '@/lib/prisma'
import { jsonOk, jsonError } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return jsonOk(photos)
  } catch (error) {
    console.error('Failed to fetch photos:', error)
    return jsonError('Failed to fetch photos', 'SERVER_ERROR', 500)
  }
}
