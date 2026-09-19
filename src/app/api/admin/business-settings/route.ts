import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const contact = await prisma.businessContact.findFirst()
    return jsonOk(contact)
  } catch {
    return jsonError('Failed to fetch business settings', 'SERVER_ERROR', 500)
  }
}

export async function PUT(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const { phone, whatsapp, email, address } = await req.json()
    const contact = await prisma.businessContact.findFirst()
    if (!contact) return jsonError('Business contact not found', 'NOT_FOUND', 404)
    const updated = await prisma.businessContact.update({
      where: { id: contact.id },
      data: {
        ...(phone ? { phone } : {}),
        ...(whatsapp ? { whatsapp } : {}),
        ...(email ? { email } : {}),
        ...(address ? { address } : {}),
      },
    })
    return jsonOk(updated)
  } catch {
    return jsonError('Failed to update business settings', 'SERVER_ERROR', 500)
  }
}
