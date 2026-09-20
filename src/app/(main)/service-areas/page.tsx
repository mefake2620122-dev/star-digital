'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Search, Clock, MessageSquare, Phone } from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'
import { useBusinessContact } from '@/context/ContactContext'

interface ServiceArea {
  id: string
  name: string
  district: string
  pincode: string | null
  estimatedArrivalMins: number
  active: boolean
}


export default function ServiceAreasPage() {
  const liveContact = useBusinessContact()
  const activePhone = liveContact.phone || SITE_CONFIG.phone
  const [areas, setAreas] = useState<ServiceArea[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const loadAreas = () => {
    fetch('/api/service-areas', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setAreas(data.data)
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAreas()

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'stardigital_updated_at') loadAreas()
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', loadAreas)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', loadAreas)
    }
  }, [])

  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.pincode?.includes(searchTerm)
  )

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900">Service Areas</span>
        </nav>

        {/* Heading */}
        <div className="max-w-3xl mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider mb-3">
            Kanpur Metropolitan Coverage
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Kanpur Service Areas & Neighborhoods
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            We operate mobile technician units across Kanpur. Search your locality below to verify doorstep coverage and estimated response times.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-xl mb-10">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your Kanpur locality or pin code (e.g. Civil Lines, Kakadeo, 208001)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Localities Directory Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 rounded-3xl bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredAreas.map((area) => (
              <div
                key={area.id || area.name}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                      <MapPin className="w-4 h-4" />
                    </div>
                    {area.pincode && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        PIN: {area.pincode}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {area.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Zone: {area.district}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50/60 p-2.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Avg. Response: ~{area.estimatedArrivalMins} Mins</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={getDialerUrl(activePhone)}
                    className="text-xs font-semibold text-slate-600 hover:text-red-600 inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Desk</span>
                  </a>
                  <a
                    href={getWhatsAppUrl(`Hello STAR DIGITAL, I am located in ${area.name}, Kanpur and need an appliance repair technician.`)}
                    className="text-xs font-semibold text-[#128C7E] hover:text-[#075E54] inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAreas.length === 0 && !loading && (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 mb-16 space-y-3">
            <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">No exact locality match found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We service almost all residential and commercial zones in Kanpur. Call our desk to confirm coverage for your specific address.
            </p>
            <div className="pt-2">
              <a
                href={getDialerUrl(activePhone)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 text-white text-xs font-bold shadow-sm"
              >
                Call Helpline: {activePhone}
              </a>
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Kanpur Operational Center</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Maqbara Gwaltoli, Near Elgin Mill, Civil Lines, Kanpur, Uttar Pradesh 208001</span>
              </p>
            </div>
            <a
              href={(SITE_CONFIG as any).directionsUrl || 'https://www.google.com/maps/search/?api=1&query=Maqbara+Gwaltoli+Near+Elgin+Mill+Civil+Lines+Kanpur+208001'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-slate-700 transition-colors border border-slate-200 shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>Get Directions</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200">
            <iframe
              src={SITE_CONFIG.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Star Digital Kanpur Coverage Map"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
