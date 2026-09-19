import { prisma } from '@/lib/prisma'
import { SITE_CONFIG } from '@/lib/site'

export interface ContactInfo {
  phone: string
  whatsapp: string
  secondaryPhone: string
  email: string
  address: string
}

/**
 * Fetch live business contact info directly from DB (or fallback to SITE_CONFIG)
 */
export async function getLiveContact(): Promise<ContactInfo> {
  try {
    const contact = await prisma.businessContact.findFirst()
    const content = await prisma.siteContent.findMany({
      where: {
        key: {
          in: [
            'business_phone',
            'contact_phone',
            'business_whatsapp',
            'contact_whatsapp',
            'business_email',
            'business_address',
          ],
        },
      },
    })

    const map: Record<string, string> = {}
    content.forEach((c) => {
      map[c.key] = c.value
    })

    const phone = map['business_phone'] || map['contact_phone'] || contact?.phone || SITE_CONFIG.phone
    const whatsapp =
      map['business_whatsapp'] || map['contact_whatsapp'] || contact?.whatsapp || SITE_CONFIG.whatsapp
    const email = map['business_email'] || contact?.email || SITE_CONFIG.email
    const address = map['business_address'] || contact?.address || SITE_CONFIG.address
    const secondaryPhone =
      contact?.phone && contact.phone !== phone ? contact.phone : SITE_CONFIG.secondaryPhone

    return {
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      secondaryPhone: secondaryPhone.trim(),
      email: email.trim(),
      address: address.trim(),
    }
  } catch {
    return {
      phone: SITE_CONFIG.phone,
      whatsapp: SITE_CONFIG.whatsapp,
      secondaryPhone: SITE_CONFIG.secondaryPhone,
      email: SITE_CONFIG.email,
      address: SITE_CONFIG.address,
    }
  }
}
