export const SITE_CONFIG = {
  name: 'STAR DIGITAL',
  tagline: 'Expert TV & Appliance Repair. Right At Your Doorstep.',
  description:
    'Kanpur’s trusted doorstep TV & home appliance repair center since 2014. Expert service for LED/LCD TV, Refrigerator, AC, and Washing Machine.',
  phone: '+91 90058 88922',
  whatsapp: '+91 90058 88922',
  secondaryPhone: '+91 90350 85031',
  email: 'support@stardigital.in',
  address: 'Maqbara Gwaltoli, Near Elgin Mill, Civil Lines, Kanpur, Uttar Pradesh 208001, India',
  landmark: 'Near Elgin Mill, Gwaltoli',
  city: 'Kanpur',
  state: 'Uttar Pradesh',
  pincode: '208001',
  establishedYear: 2014,
  hours: '7:00 AM – 9:00 PM (Monday – Sunday)',
  emergencyNote: 'Responds in 2 Hours • Same-day doorstep repair across Kanpur',
  coordinates: { lat: 26.488533, lng: 80.3328664 },
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Maqbara+Gwaltoli,+Near+Elgin+Mill,+Civil+Lines,+Kanpur,+Uttar+Pradesh+208001&t=&z=16&ie=UTF8&iwloc=&output=embed',
  directionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Maqbara+Gwaltoli+Near+Elgin+Mill+Civil+Lines+Kanpur+208001',
  primaryLocationName: 'Maqbara Gwaltoli, Near Elgin Mill, Civil Lines, Kanpur',
}

import { normalizePhoneNumber, formatWhatsAppNumber } from './phone-normalizer'

// ── WhatsApp Deep Link ─────────────────────────────────────────────────────────
export function getNativeWhatsAppUrl(message?: string, phone?: string): string {
  const num = formatWhatsAppNumber(phone || SITE_CONFIG.whatsapp)
  const msg = message ?? 'Hello STAR DIGITAL, I need doorstep appliance repair service in Kanpur.'
  return `whatsapp://send?phone=${num}&text=${encodeURIComponent(msg)}`
}

export function getWhatsAppUrl(message?: string, phone?: string): string {
  const num = formatWhatsAppNumber(phone || SITE_CONFIG.whatsapp)
  const msg = message ?? 'Hello STAR DIGITAL, I need doorstep appliance repair service in Kanpur.'
  const encoded = encodeURIComponent(msg)

  // On Mobile: dispatch directly to native WhatsApp app
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    if (isMobile) {
      return `whatsapp://send?phone=${num}&text=${encoded}`
    }
  }

  // On Desktop / Laptop: Official WhatsApp Web & Desktop gateway
  // Opens reliably in a new tab without popup-blocker issues,
  // prompting user to open WhatsApp Desktop app or use WhatsApp Web.
  return `https://api.whatsapp.com/send/?phone=${num}&text=${encoded}`
}

// ── Tel Dialer Link ────────────────────────────────────────────────────────────
// NEVER use target="_blank" with tel: — it breaks iOS/Android native dialer
function normalizeDialerNumber(phone?: string): string {
  const raw = (phone || SITE_CONFIG.phone).trim()
  const digits = raw.replace(/[^0-9]/g, '')
  if (digits.length >= 10) {
    return '+91' + digits.slice(-10)
  }
  return '+91' + digits
}

export function getDialerUrl(phone?: string): string {
  return `tel:${normalizeDialerNumber(phone)}`
}

export function generateServiceMsg(serviceName: string, issue?: string, area?: string): string {
  let msg = `Hello STAR DIGITAL, I need doorstep repair for ${serviceName}`
  msg += area ? ` in ${area}, Kanpur.` : ` in Kanpur.`
  if (issue) msg += ` Problem observed: ${issue}.`
  msg += ` Please share the earliest technician availability and inspection estimate.`
  return msg
}
