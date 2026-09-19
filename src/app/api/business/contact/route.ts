import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonOk, jsonError } from '@/lib/auth'
import { SITE_CONFIG } from '@/lib/site'

export async function GET() {
  try {
    const contact = await prisma.businessContact.findFirst()
    return jsonOk(
      contact ?? {
        name: SITE_CONFIG.name,
        phone: SITE_CONFIG.phone,
        whatsapp: SITE_CONFIG.whatsapp,
        email: SITE_CONFIG.email,
        address: SITE_CONFIG.address,
        city: SITE_CONFIG.city,
        state: SITE_CONFIG.state,
        latitude: SITE_CONFIG.coordinates.lat,
        longitude: SITE_CONFIG.coordinates.lng,
        mapQuery: 'Maqbara+Gwaltoli+Near+Elgin+Mill+Civil+Lines+Kanpur+208001',
      }
    )
  } catch {
    return jsonError('Failed to fetch business contact', 'SERVER_ERROR', 500)
  }
}
