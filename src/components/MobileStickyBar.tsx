'use client'

import { Phone, MessageSquare } from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'

/**
 * Mobile-only sticky bottom CTA bar — hidden on sm+
 * tel: links work correctly on all iOS/Android devices.
 */
export function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl safe-bottom">
      <div className="grid grid-cols-2 p-2 gap-2">
        <a
          href={getDialerUrl(SITE_CONFIG.phone)}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-red-600 active:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/25 transition-transform active:scale-95"
          aria-label={`Call Star Digital at ${SITE_CONFIG.phone}`}
        >
          <Phone className="w-4 h-4 fill-current shrink-0" />
          <div className="flex flex-col text-left leading-tight">
            <span>Call Now</span>
            <span className="text-[10px] font-normal text-white/80">{SITE_CONFIG.phone}</span>
          </div>
        </a>

        <a
          href={getWhatsAppUrl('Hello STAR DIGITAL, I need doorstep appliance repair in Kanpur. Please share the earliest availability.')}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#25D366] active:bg-[#20bd5a] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-transform active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-current shrink-0" />
          <div className="flex flex-col text-left leading-tight">
            <span>WhatsApp</span>
            <span className="text-[10px] font-normal text-white/80">Fast Response</span>
          </div>
        </a>
      </div>
    </div>
  )
}
