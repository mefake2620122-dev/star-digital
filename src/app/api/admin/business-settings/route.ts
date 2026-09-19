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

import { revalidatePath } from 'next/cache'

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

    // Also sync siteContent keys
    if (phone) {
      await prisma.siteContent.upsert({
        where: { key: 'business_phone' },
        update: { value: phone },
        create: { key: 'business_phone', value: phone, label: 'Primary Phone', type: 'phone', group: 'contact' },
      }).catch(() => null)
      await prisma.siteContent.upsert({
        where: { key: 'contact_phone' },
        update: { value: phone },
        create: { key: 'contact_phone', value: phone, label: 'Helpline Phone', type: 'phone', group: 'contact' },
      }).catch(() => null)
    }

    if (whatsapp) {
      await prisma.siteContent.upsert({
        where: { key: 'business_whatsapp' },
        update: { value: whatsapp },
        create: { key: 'business_whatsapp', value: whatsapp, label: 'WhatsApp Number', type: 'phone', group: 'contact' },
      }).catch(() => null)
      await prisma.siteContent.upsert({
        where: { key: 'contact_whatsapp' },
        update: { value: whatsapp },
        create: { key: 'contact_whatsapp', value: whatsapp, label: 'Contact WhatsApp', type: 'phone', group: 'contact' },
      }).catch(() => null)
    }

    try {
      revalidatePath('/', 'layout')
    } catch {}

    return jsonOk(updated)
  } catch {
    return jsonError('Failed to update business settings', 'SERVER_ERROR', 500)
  }
}
