import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'
import { revalidateAll } from '@/lib/revalidate'
import { normalizePhoneNumber } from '@/lib/phone-normalizer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** GET all site content as array (for admin UI) */
export async function GET(req: NextRequest) {
  try {
    const content = await prisma.siteContent.findMany({
      orderBy: { key: 'asc' },
    })
    return jsonOk(content)
  } catch {
    return jsonError('Failed to fetch site content', 'SERVER_ERROR', 500)
  }
}

/** PUT — update or upsert a single key */
export async function PUT(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const { key, value } = await req.json()
    if (!key || value === undefined) return jsonError('key and value are required', 'VALIDATION_ERROR', 400)

    let finalValue = typeof value === 'string' ? value.trim() : value

    // Normalize phone and whatsapp numbers to standardized +91 XXXXX XXXXX format
    if (
      key === 'business_phone' ||
      key === 'contact_phone' ||
      key === 'emergency_phone' ||
      key === 'helpline_phone' ||
      key === 'business_whatsapp' ||
      key === 'contact_whatsapp'
    ) {
      const norm = normalizePhoneNumber(finalValue)
      if (!norm.isValid && finalValue.length > 0) {
        return jsonError('Please enter a valid 10-digit mobile number (e.g. 90058 88922)', 'VALIDATION_ERROR', 400)
      }
      finalValue = norm.display
    }

    const updated = await prisma.siteContent.upsert({
      where: { key },
      update: { value: finalValue },
      create: { key, value: finalValue, label: key, group: 'general' },
    })

    // If updating phone or whatsapp, sync both keys and businessContact table
    if (key === 'business_phone' || key === 'contact_phone') {
      const otherKey = key === 'business_phone' ? 'contact_phone' : 'business_phone'
      await prisma.siteContent.upsert({
        where: { key: otherKey },
        update: { value: finalValue },
        create: { key: otherKey, value: finalValue, label: 'Helpline Phone', type: 'phone', group: 'contact' },
      }).catch(() => null)

      await prisma.businessContact.updateMany({
        data: { phone: finalValue },
      }).catch(() => null)
    }

    if (key === 'business_whatsapp' || key === 'contact_whatsapp') {
      const otherKey = key === 'business_whatsapp' ? 'contact_whatsapp' : 'business_whatsapp'
      await prisma.siteContent.upsert({
        where: { key: otherKey },
        update: { value: finalValue },
        create: { key: otherKey, value: finalValue, label: 'WhatsApp Number', type: 'phone', group: 'contact' },
      }).catch(() => null)

      await prisma.businessContact.updateMany({
        data: { whatsapp: finalValue },
      }).catch(() => null)
    }

    if (key === 'business_email') {
      await prisma.businessContact.updateMany({
        data: { email: finalValue },
      }).catch(() => null)
    }

    if (key === 'business_address' || key === 'contact_address') {
      const otherKey = key === 'business_address' ? 'contact_address' : 'business_address'
      await prisma.siteContent.upsert({
        where: { key: otherKey },
        update: { value },
        create: { key: otherKey, value, label: 'Address', type: 'text', group: 'contact' },
      }).catch(() => null)

      await prisma.businessContact.updateMany({
        data: { address: value },
      }).catch(() => null)
    }

    // Purge cached routes across the whole website
    revalidateAll()

    return jsonOk(updated)
  } catch (err: any) {
    console.error('Error updating site content:', err)
    return jsonError('Failed to update site content', 'SERVER_ERROR', 500)
  }
}
