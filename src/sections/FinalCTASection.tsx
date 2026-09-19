import Link from 'next/link'
import { Phone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'

export function FinalCTASection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-950 text-white relative overflow-hidden">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(220,38,38,0.18),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            <span>Reliable Kanpur Doorstep Service</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Need a Repair?{' '}
            <span className="text-red-500 block sm:inline">Don't Wait.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Avoid further appliance damage with quick diagnostics. Call our helpline directly or send us a WhatsApp message to book a technician today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={getDialerUrl()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-lg shadow-red-600/30 active:scale-[0.98] transition-all"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Call Now: {SITE_CONFIG.phone}</span>
            </a>

            <a
              href={getWhatsAppUrl('Hello Star Digital, I need immediate appliance repair help in Kanpur.')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#25D366] active:bg-[#20bd5a] hover:bg-[#20bd5a] text-white font-bold text-base shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp Us</span>
            </a>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-base border border-slate-800 active:scale-[0.98] transition-all backdrop-blur-md"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
