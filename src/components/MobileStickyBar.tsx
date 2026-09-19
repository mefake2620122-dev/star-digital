'use client'

import { Phone, MessageSquare } from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'

/**
 * Mobile-only sticky bottom CTA bar — hidden on sm+
 * tel: links work correctly on all iOS/Android devices.
 */
export function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-white/90 backdrop-blur-lg border-t border-slate-200 shadow-apple-modal safe-bottom">
      <div className="flex divide-x divide-slate-200">
        <a
          href={getDialerUrl(SITE_CONFIG.phone)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-apple-text hover:text-star-600 active:bg-slate-50 transition-colors"
          aria-label={`Call Star Digital at ${SITE_CONFIG.phone}`}
        >
          <Phone className="w-5 h-5 fill-current text-star-600" />
          <span className="text-[11px] font-bold tracking-tight text-star-600">
            Call Now
          </span>
        </a>

        <a
          href={getWhatsAppUrl('Hello STAR DIGITAL, I need doorstep appliance repair in Kanpur. Please share the earliest availability.')}
          target="_blank"
          rel="noopener"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[#25D366] hover:text-[#1ea850] active:bg-slate-50 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
        </a>
      </div>
    </div>
  )
}
