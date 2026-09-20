import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Clock,
  MessageSquare,
  ChevronDown,
} from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl, generateServiceMsg } from '@/lib/site'
import { getLiveContact } from '@/lib/contact'
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } })
  if (!service) return { title: 'Service Not Found | STAR DIGITAL' }
  return {
    title: `${service.name} Repair & Service in Kanpur | STAR DIGITAL`,
    description: service.shortDesc || `Professional doorstep ${service.name} repair in Kanpur. Certified technicians, genuine parts & 30-day warranty.`,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const [service, contact] = await Promise.all([
    prisma.service.findUnique({
      where: { slug: params.slug },
      include: { categories: true, issues: true, faqs: true },
    }),
    getLiveContact(),
  ])

  if (!service) notFound()

  const allServices = await prisma.service.findMany({
    where: { active: true, NOT: { slug: params.slug } },
    take: 3,
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-red-600 transition-colors">Services</Link>
          <span>/</span>
          <span className="text-slate-900">{service.name}</span>
        </nav>

        {/* Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-block px-3.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider">
              {service.tagline || 'Specialized Doorstep Service'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {service.name} Repair & Service in Kanpur
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {service.description || service.shortDesc}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={getWhatsAppUrl(generateServiceMsg(service.name))}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm active:scale-95 transition-all shadow-md shadow-emerald-600/20"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Enquire on WhatsApp</span>
              </a>

              <a
                href={getDialerUrl(contact.phone)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
              >
                <Phone className="w-4 h-4 fill-current text-red-600" />
                <span>Call Technician</span>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-3 text-xs text-slate-500 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>45–60 Mins Arrival</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Transparent Diagnostics</span>
              </div>
            </div>
          </div>

          {/* Large Visual */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 h-72 sm:h-96 relative">
              <img
                src={service.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                alt={service.name}
                className="w-full h-full object-cover object-center opacity-90 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Common Problems Section */}
        {service.issues && service.issues.length > 0 && (
          <div className="mb-16 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Troubleshooting Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                Common {service.name} Issues We Resolve
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Click any problem to immediately launch a WhatsApp consultation with our Kanpur technician.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.issues.map((issue) => (
                <a
                  key={issue.id}
                  href={getWhatsAppUrl(generateServiceMsg(service.name, issue.name))}
                  className="group flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {issue.name}
                    </h4>
                    {issue.description && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {issue.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-1.5 mt-0.5">
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Categories Breakdown */}
        {service.categories && service.categories.length > 0 && (
          <div className="mb-16">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Comprehensive Scope
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                Supported Models & Types
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {service.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 mb-4">
                      <Wrench className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {cat.description || 'Full diagnostic and component servicing.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doorstep Service Protocol */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Doorstep Service Protocol
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-red-600 font-extrabold text-xs tracking-wider">STEP 1: INSPECTION</div>
              <h4 className="text-base font-bold text-slate-900">Multi-point Diagnostics</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Technician performs electrical, mechanical, and pressure tests at your home to pinpoint exact failure points.
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-red-600 font-extrabold text-xs tracking-wider">STEP 2: QUOTATION</div>
              <h4 className="text-base font-bold text-slate-900">Clear Upfront Estimate</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We present the repair cost and parts pricing transparently before any work starts.
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-red-600 font-extrabold text-xs tracking-wider">STEP 3: EXECUTION</div>
              <h4 className="text-base font-bold text-slate-900">On-Site Testing</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Repair is completed, tested for full performance in your presence, and backed by a 30-day service warranty.
              </p>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {allServices.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Other Appliances We Service in Kanpur
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {allServices.map((rs) => (
                <Link
                  key={rs.slug}
                  href={`/services/${rs.slug}`}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      {rs.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Doorstep diagnostics
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
