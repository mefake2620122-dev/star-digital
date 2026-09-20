import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'
import { revalidateAll } from '@/lib/revalidate'

import { normalizePhoneNumber } from '@/lib/phone-normalizer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    let normalizedPhone = phone
    let normalizedWhatsapp = whatsapp

    if (phone && typeof phone === 'string') {
      const normP = normalizePhoneNumber(phone)
      if (!normP.isValid && phone.trim().length > 0) {
        return jsonError('Please enter a valid 10-digit calling number (e.g. 90058 88922)', 'VALIDATION_ERROR', 400)
      }
      normalizedPhone = normP.display
    }

    if (whatsapp && typeof whatsapp === 'string') {
      const normW = normalizePhoneNumber(whatsapp)
      if (!normW.isValid && whatsapp.trim().length > 0) {
        return jsonError('Please enter a valid 10-digit WhatsApp number (e.g. 90058 88922)', 'VALIDATION_ERROR', 400)
      }
      normalizedWhatsapp = normW.display
    }

    const updated = await prisma.businessContact.update({
      where: { id: contact.id },
      data: {
        ...(normalizedPhone ? { phone: normalizedPhone } : {}),
        ...(normalizedWhatsapp ? { whatsapp: normalizedWhatsapp } : {}),
        ...(email ? { email } : {}),
        ...(address ? { address } : {}),
      },
    })

    // Also sync siteContent keys
    if (normalizedPhone) {
      await prisma.siteContent.upsert({
        where: { key: 'business_phone' },
        update: { value: normalizedPhone },
        create: { key: 'business_phone', value: normalizedPhone, label: 'Primary Phone', type: 'phone', group: 'contact' },
      }).catch(() => null)
      await prisma.siteContent.upsert({
        where: { key: 'contact_phone' },
        update: { value: normalizedPhone },
        create: { key: 'contact_phone', value: normalizedPhone, label: 'Helpline Phone', type: 'phone', group: 'contact' },
      }).catch(() => null)
    }

    if (normalizedWhatsapp) {
      await prisma.siteContent.upsert({
        where: { key: 'business_whatsapp' },
        update: { value: normalizedWhatsapp },
        create: { key: 'business_whatsapp', value: normalizedWhatsapp, label: 'WhatsApp Number', type: 'phone', group: 'contact' },
      }).catch(() => null)
      await prisma.siteContent.upsert({
        where: { key: 'contact_whatsapp' },
        update: { value: normalizedWhatsapp },
        create: { key: 'contact_whatsapp', value: normalizedWhatsapp, label: 'Contact WhatsApp', type: 'phone', group: 'contact' },
      }).catch(() => null)
    }

    if (email) {
      await prisma.siteContent.upsert({
        where: { key: 'business_email' },
        update: { value: email },
        create: { key: 'business_email', value: email, label: 'Email', type: 'text', group: 'contact' },
      }).catch(() => null)
    }

    if (address) {
      await prisma.siteContent.upsert({
        where: { key: 'business_address' },
        update: { value: address },
        create: { key: 'business_address', value: address, label: 'Address', type: 'text', group: 'contact' },
      }).catch(() => null)
      await prisma.siteContent.upsert({
        where: { key: 'contact_address' },
        update: { value: address },
        create: { key: 'contact_address', value: address, label: 'Workshop Address', type: 'text', group: 'contact' },
      }).catch(() => null)
    }

    revalidateAll()

    return jsonOk(updated)
  } catch (err: any) {
    console.error('Error updating business settings:', err)
    return jsonError('Failed to update business settings', 'SERVER_ERROR', 500)
  }
}
