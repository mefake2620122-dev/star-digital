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
    const body = await req.json()
    const { name, slug, tagline, shortDesc, description, active, sortOrder, image, icon } = body
    const updated = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(slug !== undefined ? { slug: slug.trim() } : {}),
        ...(tagline !== undefined ? { tagline: tagline.trim() } : {}),
        ...(shortDesc !== undefined ? { shortDesc: shortDesc.trim() } : {}),
        ...(description !== undefined ? { description: description.trim() } : {}),
        ...(active !== undefined ? { active: Boolean(active) } : {}),
        ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) } : {}),
        ...(image !== undefined ? { image: image.trim() } : {}),
        ...(icon !== undefined ? { icon: icon.trim() } : {}),
      },
    })
    revalidateAll()
    return jsonOk(updated)
  } catch {
    return jsonError('Failed to update service', 'SERVER_ERROR', 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    await prisma.service.delete({
      where: { id: params.id },
    })
    revalidateAll()
    return jsonOk({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Failed to delete service:', error)
    return jsonError('Failed to delete service', 'SERVER_ERROR', 500)
  }
}
