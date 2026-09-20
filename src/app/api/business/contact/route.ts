import { prisma } from '@/lib/prisma'
import { jsonOk, jsonError } from '@/lib/auth'
import { getLiveContact } from '@/lib/contact'
import { SITE_CONFIG } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const live = await getLiveContact()
    const dbContact = await prisma.businessContact.findFirst()

    return jsonOk({
      name: dbContact?.name || SITE_CONFIG.name,
      phone: live.phone,
      whatsapp: live.whatsapp,
      secondaryPhone: live.secondaryPhone,
      email: live.email,
      address: live.address,
      city: dbContact?.city || SITE_CONFIG.city,
      state: dbContact?.state || SITE_CONFIG.state,
      latitude: dbContact?.latitude || SITE_CONFIG.coordinates.lat,
      longitude: dbContact?.longitude || SITE_CONFIG.coordinates.lng,
      mapQuery: dbContact?.mapQuery || 'Maqbara+Gwaltoli+Near+Elgin+Mill+Civil+Lines+Kanpur+208001',
    })
  } catch {
    return jsonError('Failed to fetch business contact', 'SERVER_ERROR', 500)
  }
}
