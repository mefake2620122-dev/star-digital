import Link from 'next/link'
import { Camera, MapPin, ShieldCheck, Sparkles, MessageSquare, Phone } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { PhotosGalleryClient } from '@/components/PhotosGalleryClient'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'

export const metadata = {
  title: 'Work Photos & Service Gallery | STAR DIGITAL Kanpur Appliance Care',
  description:
    'Real workshop and doorstep repair photos from Star Digital in Kanpur. High-resolution photos of LED TV panel repair, AC chemical servicing, refrigerator cooling fixes, and washing machine rebuilds.',
}

async function getPhotos() {
  try {
    const photos = await prisma.photo.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return JSON.parse(JSON.stringify(photos))
  } catch {
    return []
  }
}

export default async function PhotosPage() {
  const photos = await getPhotos()

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900">Work Photos</span>
        </nav>

        {/* Editorial Page Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] sm:text-xs font-bold mb-3 max-w-full">
            <Camera className="w-4 h-4 text-red-600" />
            <span>REAL WORK IN KANPUR HOMES • AUTHENTIC PHOTO GALLERY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Our Work in Action Across Kanpur
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Genuine photographic documentation from our Civil Lines diagnostic workshop and on-site doorstep
            repairs. Inspect our component-level LED TV motherboard repairs, split AC foam jet servicing, and
            compressor diagnostics.
          </p>
        </div>

        {/* 3 Quick Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">100% Genuine Work</p>
              <p className="text-[11px] text-slate-500">Real doorstep and lab photos</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Kanpur Localities</p>
              <p className="text-[11px] text-slate-500">Civil Lines, Gwaltoli &amp; all areas</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Certified Technicians</p>
              <p className="text-[11px] text-slate-500">Equipped with diagnostic instruments</p>
            </div>
          </div>
        </div>

        {/* Interactive Client Gallery */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm mb-16">
          <PhotosGalleryClient initialPhotos={photos} />
        </div>

        {/* Consultation Callout */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Doorstep Service Assistance
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Facing an issue with your home appliance?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Send photos or video of the issue directly to our technicians on WhatsApp for immediate diagnosis.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={getWhatsAppUrl('Hello STAR DIGITAL, I am sharing a photo of my faulty appliance for diagnosis.')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#20bd5a] transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Share on WhatsApp</span>
            </a>
            <a
              href={getDialerUrl(SITE_CONFIG.phone)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all shadow-sm"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Call: {SITE_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
