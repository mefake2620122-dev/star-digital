import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const inquiries = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return jsonOk(inquiries)
  } catch {
    return jsonError('Failed to fetch inquiries', 'SERVER_ERROR', 500)
  }
}

export async function PUT(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const { id, status, adminNotes } = await req.json()
    if (!id) return jsonError('Inquiry ID is required', 'VALIDATION_ERROR', 400)

    const updated = await prisma.contactMessage.update({
      where: { id },
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
