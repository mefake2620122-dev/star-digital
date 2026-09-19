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
    const { status, adminNotes } = await req.json()
    const updated = await prisma.contactMessage.update({
      where: { id: params.id },
      data: {
        ...(status ? { status } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    })
    return jsonOk(updated)
  } catch {
    return jsonError('Failed to update inquiry', 'SERVER_ERROR', 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    await prisma.contactMessage.delete({ where: { id: params.id } })
    return jsonOk({ message: 'Inquiry deleted' })
  } catch {
    return jsonError('Failed to delete inquiry', 'SERVER_ERROR', 500)
  }
}
