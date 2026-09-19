import { ShieldCheck, Clock, MapPin, Wrench } from 'lucide-react'

export function TrustStrip() {
  const items = [
    { icon: ShieldCheck, label: 'Certified Technicians', color: 'text-emerald-600 bg-emerald-50' },
    { icon: Clock, label: 'Same-Day Service', color: 'text-blue-600 bg-blue-50' },
    { icon: MapPin, label: 'Kanpur Doorstep', color: 'text-star-600 bg-star-50' },
    { icon: Wrench, label: 'Transparent Pricing', color: 'text-amber-600 bg-amber-50' },
  ]

  return (
    <section className="py-4 bg-white border-y border-slate-100" aria-label="Trust indicators">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {items.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2.5 py-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-apple-text">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
