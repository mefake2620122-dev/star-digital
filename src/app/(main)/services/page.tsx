import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowRight, CheckCircle2, MessageSquare, Phone } from 'lucide-react'
import { SITE_CONFIG, getWhatsAppUrl, getDialerUrl } from '@/lib/site'
import { getLiveContact } from '@/lib/contact'

export const metadata = {
  title: 'Appliance Repair Services in Kanpur | STAR DIGITAL',
  description: 'Certified doorstep repair for AC, Refrigerator, Washing Machine, LED TV, CCTV, and Home Appliances in Kanpur. 30-day warranty & genuine parts.',
}
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { active: true },
      include: { categories: true, issues: true },
      orderBy: { sortOrder: 'asc' },
    })
  } catch (e) {
    console.error('Failed to query services:', e)
    return []
  }
}

export default async function ServicesPage() {
  const [services, contact] = await Promise.all([
    getServices(),
    getLiveContact(),
  ])

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900">Services</span>
        </nav>

        {/* Hero Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider mb-3">
            Kanpur Service Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Professional Repair & Service{' '}
            <span className="text-red-600 block sm:inline">For Your Home Appliances</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            Every appliance is diagnosed with component-level testing instruments. Select your appliance below to inspect common symptoms, repair procedures, and booking options.
          </p>
        </div>

        {/* Detailed Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.slug}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Visual Header */}
                <div className="relative h-48 sm:h-52 bg-slate-900 overflow-hidden">
                  <img
                    src={service.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                    alt={service.name}
                    className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                      Kanpur Doorstep Care
                    </span>
                    <h2 className="text-xl font-bold text-white mt-0.5">
                      {service.name}
                    </h2>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {service.shortDesc || service.description}
                  </p>

                  {/* Categories Pills */}
                  {service.categories && service.categories.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 mb-2">
                        Supported Types:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {service.categories.map((c) => (
                          <span
                            key={c.id}
                            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Highlight */}
                  <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>In-home diagnostics & genuine parts</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-100/80 mt-2">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-red-600 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={getWhatsAppUrl(`Hello STAR DIGITAL, I need doorstep repair for ${service.name} in Kanpur. Please share earliest technician availability.`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Help Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Don't see your specific appliance or brand?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Our technicians in Civil Lines handle bespoke electrical & electronic servicing across Kanpur.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={getDialerUrl(contact.phone)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Call Helpline</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all active:scale-95"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
