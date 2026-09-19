import Link from 'next/link'
import { Phone, MessageSquare, ArrowRight, ShieldCheck, MapPin, Clock } from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'
import { prisma } from '@/lib/prisma'

async function getHeroContent() {
  try {
    const items = await prisma.siteContent.findMany({
      where: { group: { in: ['hero', 'contact'] } },
    })
    const map: Record<string, string> = {}
    items.forEach((it) => {
      map[it.key] = it.value
    })
    return map
  } catch {
    return {}
  }
}

export async function HeroSection() {
  const content = await getHeroContent()

  const heroBadge = content.hero_badge || 'Near Elgin Mill, Civil Lines, Kanpur'
  const heroTitle = content.hero_title || 'Expert Repair. Right At Your Doorstep.'
  const heroSubtitle =
    content.hero_subtitle ||
    'Fast, reliable repair & installation services for your home appliances. Certified technicians dispatched across Kanpur.'
  const heroImage =
    content.hero_image ||
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
  const businessPhone = content.business_phone || SITE_CONFIG.phone
  const businessWhatsapp = content.business_whatsapp || SITE_CONFIG.whatsapp

  const appliances = [
    { name: 'AC', slug: 'ac' },
    { name: 'Refrigerator', slug: 'refrigerator' },
    { name: 'Washing Machine', slug: 'washing-machine' },
    { name: 'LED TV', slug: 'led-lcd-tv' },
    { name: 'CCTV', slug: 'cctv' },
    { name: 'Microwave & RO', slug: 'other' },
  ]

  return (
    <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Top Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs sm:text-sm font-medium">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>{heroBadge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span className="text-slate-500">Doorstep Service</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              {heroTitle}
            </h1>

            {/* Sub-copy */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {heroSubtitle}
            </p>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
                We Fix:
              </span>
              {appliances.map((app) => (
                <Link
                  key={app.slug}
                  href={`/services/${app.slug}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 hover:border-red-600 hover:text-red-600 shadow-sm transition-all"
                >
                  {app.name}
                </Link>
              ))}
            </div>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppUrl(
                  'Hello STAR DIGITAL, I need doorstep appliance repair service in Kanpur.',
                  businessWhatsapp
                )}
                target="_blank"
                rel="noopener"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold rounded-2xl bg-[#25D366] text-white hover:bg-[#20bd5a] active:scale-[0.98] transition-all shadow-md shadow-emerald-600/20"
                aria-label="Chat on WhatsApp with Star Digital technician"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Call CTA */}
              <a
                href={getDialerUrl(businessPhone)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold rounded-2xl bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition-all shadow-md shadow-red-600/20"
                aria-label={`Call Star Digital at ${businessPhone}`}
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Call: {businessPhone}</span>
              </a>

              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 text-sm sm:text-base font-semibold rounded-2xl bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
              >
                <span>View All Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Micro Trust */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>45–60 Min Rapid Arrival</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Transparent Diagnostics</span>
              </div>
            </div>
          </div>

          {/* Right Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900">
                <img
                  src={heroImage}
                  alt="Professional technician inspecting electronics in Kanpur"
                  className="w-full h-80 sm:h-96 object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Floating Badge */}
                <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-lg text-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
                        Kanpur Doorstep Service
                      </p>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        Qualified Technicians At Your Door
                      </h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
