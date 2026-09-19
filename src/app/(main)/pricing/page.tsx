import Link from 'next/link'
import { BadgePercent, HelpCircle, Phone, MessageSquare, CheckCircle2, ShieldCheck, Clock, Sparkles } from 'lucide-react'
import { PricingSection } from '@/sections/PricingSection'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'
import { getLiveContact } from '@/lib/contact'

export const metadata = {
  title: 'Pricing & Service Rates | STAR DIGITAL Kanpur Appliance Care',
  description:
    'Transparent, honest doorstep repair rates in Kanpur for LED/LCD TV, AC, Refrigerator, and Washing Machine. Diagnostic inspection fee 100% adjusted into final repair bill.',
}

export default async function PricingPage() {
  const contact = await getLiveContact()
  const faqs = [
    {
      q: 'How does the ₹299 doorstep inspection fee work?',
      a: 'A certified technician visits your home, inspects the appliance, and provides an exact estimate. When you approve the repair work, the entire ₹299 visit fee is waived and adjusted directly in your final invoice.',
    },
    {
      q: 'Do you use original manufacturer spare parts?',
      a: 'Yes, 100%. We source certified OEM spare parts (LED backlight strips, inverter compressor relays, drain pumps, capacitors) backed by a 30 to 90-day service guarantee.',
    },
    {
      q: 'What payment modes are accepted?',
      a: 'You only pay after the repair is completed and tested in your presence. We accept Cash, UPI (Google Pay, PhonePe, Paytm), and Net Banking.',
    },
    {
      q: 'Can I get a rough estimate before the technician visits?',
      a: 'Certainly! Call our technical helpline or share your appliance model and symptoms on WhatsApp for an immediate preliminary estimate.',
    },
  ]

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900">Pricing &amp; Rate Card</span>
        </nav>

        {/* Editorial Page Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold mb-3">
            <BadgePercent className="w-4 h-4 text-red-600" />
            <span>TRANSPARENT REPAIR RATES • KANPUR DOORSTEP SERVICE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Transparent Pricing &amp; Service Rate Card
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Honest, competitive doorstep rates for all major home appliance repairs across Kanpur.
            Our inspection fee is <span className="font-bold text-slate-900">100% adjusted into your final invoice</span> when
            you approve the service.
          </p>
        </div>

        {/* Embedded Interactive Pricing Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-16">
          <PricingSection showHeader={false} />
        </div>

        {/* Pricing FAQs Section */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Frequently Asked Pricing Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <h3 className="text-base font-bold text-slate-900">{f.q}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Consultation CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Quick Phone Consultation
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Need an instant quote for your specific model?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Speak directly with our technical supervisor in Civil Lines, Kanpur. Share your appliance symptoms for a quick estimate.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={getWhatsAppUrl('Hello STAR DIGITAL, I need a price estimate for my appliance repair in Kanpur.')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#20bd5a] transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={getDialerUrl(contact.phone)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all shadow-sm"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Call: {contact.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
