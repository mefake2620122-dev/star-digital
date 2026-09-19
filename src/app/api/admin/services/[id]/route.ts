import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const { name, tagline, shortDesc, description, active, sortOrder, image } = await req.json()
    const updated = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...(name ? { name } : {}),
        ...(tagline ? { tagline } : {}),
        ...(shortDesc ? { shortDesc } : {}),
        ...(description ? { description } : {}),
        ...(active !== undefined ? { active } : {}),
        ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) } : {}),
        ...(image ? { image } : {}),
      },
    })
    return jsonOk(updated)
  } catch {
    return jsonError('Failed to update service', 'SERVER_ERROR', 500)
  }
}
