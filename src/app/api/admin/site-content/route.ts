import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

/** GET all site content as array (for admin UI) */
export async function GET(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const content = await prisma.siteContent.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] })
    return jsonOk(content)
  } catch {
    return jsonError('Failed to fetch site content', 'SERVER_ERROR', 500)
  }
}

import { revalidatePath } from 'next/cache'

/** PUT — update a single key */
export async function PUT(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const { key, value } = await req.json()
    if (!key || value === undefined) return jsonError('key and value are required', 'VALIDATION_ERROR', 400)
    const updated = await prisma.siteContent.update({ where: { key }, data: { value } })

    // If updating phone or whatsapp, sync both keys and businessContact table
    if (key === 'business_phone' || key === 'contact_phone') {
      const otherKey = key === 'business_phone' ? 'contact_phone' : 'business_phone'
      await prisma.siteContent.upsert({
        where: { key: otherKey },
        update: { value },
        create: { key: otherKey, value, label: 'Helpline Phone', type: 'phone', group: 'contact' },
      }).catch(() => null)

      await prisma.businessContact.updateMany({
        data: { phone: value },
      }).catch(() => null)
    }

    if (key === 'business_whatsapp' || key === 'contact_whatsapp') {
      const otherKey = key === 'business_whatsapp' ? 'contact_whatsapp' : 'business_whatsapp'
      await prisma.siteContent.upsert({
        where: { key: otherKey },
        update: { value },
        create: { key: otherKey, value, label: 'WhatsApp Number', type: 'phone', group: 'contact' },
      }).catch(() => null)

      await prisma.businessContact.updateMany({
        data: { whatsapp: value },
      }).catch(() => null)
    }

    // Immediately purge cached routes so live website reflects instantly
    try {
      revalidatePath('/', 'layout')
    } catch {}

    return jsonOk(updated)
  } catch {
    return jsonError('Failed to update site content', 'SERVER_ERROR', 500)
  }
}
