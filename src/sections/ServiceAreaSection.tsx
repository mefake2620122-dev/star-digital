import Link from 'next/link'
import { MapPin, ArrowRight, Check } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site'

export function ServiceAreaSection() {
  const primaryLocalities = [
    'Civil Lines & Elgin Mill (Primary Hub)',
    'Maqbara Gwaltoli',
    'Swaroop Nagar',
    'Mall Road',
    'Kakadeo',
    'Kidwai Nagar',
    'Govind Nagar',
    'Shyam Nagar',
    'Kalyanpur',
    'Harsh Nagar',
  ]

  return (
    <section className="py-16 sm:py-24 bg-apple-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Coverage Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-star-50 border border-star-100 text-star-700 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-star-600" />
              <span>Local Service Coverage</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-apple-text tracking-tight">
              Serving Kanpur &amp; Nearby Areas
            </h2>

            <p className="text-sm sm:text-base text-apple-secondary leading-relaxed">
              Centrally based near Elgin Mill, Gwaltoli and Civil Lines in Kanpur. Our certified mobile technicians
              are dispatched across city zones to ensure prompt doorstep arrival within 45 to 90 minutes.
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-apple-text">
                Key Localities Covered:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-apple-secondary">
                {primaryLocalities.map((loc, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-star-600 shrink-0" />
                    <span className="leading-snug">{loc}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/service-areas"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-star-600 hover:text-star-700 transition-colors"
            >
              <span>Check Your Neighborhood Coverage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Embedded Google Map */}
          <div className="lg:col-span-7">
            <div className="rounded-apple-xl overflow-hidden border border-black/[0.08] shadow-apple-card bg-white">
              {/* Address Header Bar */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-red-100/80 text-red-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      Maqbara Gwaltoli, Near Elgin Mill
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Civil Lines, Kanpur - 208001, Uttar Pradesh
                    </p>
                  </div>
                </div>
                <a
                  href={(SITE_CONFIG as any).directionsUrl || 'https://www.google.com/maps/search/?api=1&query=Maqbara+Gwaltoli+Near+Elgin+Mill+Civil+Lines+Kanpur+208001'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-red-600 hover:border-red-200 shadow-sm transition-all shrink-0"
                >
                  <span>Open in Maps</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>

              <iframe
                src={SITE_CONFIG.mapEmbedUrl}
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Star Digital Service Area Map — Kanpur"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
