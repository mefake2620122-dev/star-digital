'use client'

import { useState, useEffect } from 'react'
import {
  Tv,
  Refrigerator,
  Flame,
  Wind,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageSquare,
  HelpCircle,
  Clock,
  Sparkles,
  BadgePercent
} from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'
import { useBusinessContact } from '@/context/ContactContext'
import { ScrollReveal } from '@/components/ScrollReveal'

interface PriceItem {
  name: string
  range: string
  time: string
  popular?: boolean
  description: string
  features: string[]
}

interface ServiceCategoryPricing {
  id: string
  category: string
  icon: any
  tagline: string
  items: PriceItem[]
}

const PRICING_DATA: ServiceCategoryPricing[] = [
  {
    id: 'tv',
    category: 'LED / Smart TV',
    icon: Tv,
    tagline: 'Specialist repair for Sony, Samsung, LG, Mi, OnePlus, TCL & all brands',
    items: [
      {
        name: 'Doorstep TV Diagnosis & Inspection',
        range: '₹299',
        time: '45–60 Mins',
        description: 'Complete board-level testing, power supply voltage verification & panel health check.',
        features: ['100% adjusted in repair bill', 'On-site fault detection', 'Written quote before repair'],
      },
      {
        name: 'LED Backlight Array Replacement',
        range: '₹899 – ₹1,899',
        time: 'Same Day',
        popular: true,
        description: 'Fixes dark screen, sound working but no display, flickering or dim patches on display.',
        features: ['Full genuine LED strip set', 'Even brightness calibration', '90-day parts warranty'],
      },
      {
        name: 'Power Supply Board Repair',
        range: '₹699 – ₹1,499',
        time: 'Same Day',
        description: 'Resolves TV dead condition, red standby light blinking, or sudden power shut-offs.',
        features: ['SMD component replacement', 'Surge protection check', '30-day service warranty'],
      },
      {
        name: 'Motherboard / Logic Card Repair',
        range: '₹1,199 – ₹2,499',
        time: '24–48 Hrs',
        description: 'Fixes logo hanging, HDMI/WiFi port failure, boot-loop, or software firmware crash.',
        features: ['Micro-soldering diagnostics', 'Firmware reprogramming', 'Component-level repair'],
      },
      {
        name: 'TV Audio / Speaker Repair',
        range: '₹549 – ₹999',
        time: 'Same Day',
        description: 'Fixes cracked sound, distorted audio, or zero volume output from TV speakers.',
        features: ['Dual speaker replacement', 'Audio IC check', '30-day warranty'],
      },
      {
        name: 'Wall Mount & Uninstallation',
        range: '₹399 – ₹699',
        time: '45 Mins',
        description: 'Heavy-duty swivel or fixed bracket installation with precision spirit-level alignment.',
        features: ['Standard/heavy mount included', 'Concealed wiring advice', 'Zero wall damage guarantee'],
      },
    ],
  },
  {
    id: 'refrigerator',
    category: 'Refrigerator',
    icon: Refrigerator,
    tagline: 'Single door, Double door, Side-by-Side & Inverter compressor repair',
    items: [
      {
        name: 'Doorstep Fridge Inspection Visit',
        range: '₹299',
        time: '45–60 Mins',
        description: 'Comprehensive cooling test, thermostat calibration & compressor amp-load check.',
        features: ['Adjusted against total bill', 'Doorstep testing', 'Honest fault report'],
      },
      {
        name: 'Full Gas Refilling (R600a / R134a)',
        range: '₹1,499 – ₹2,299',
        time: 'Same Day',
        popular: true,
        description: 'Complete nitrogen pressure leak detection, copper brazing, vacuuming & gas charging.',
        features: ['Pure grade refrigerant', 'Leak seal & test', '60-day cooling warranty'],
      },
      {
        name: 'Thermostat & Cooling Sensor Repair',
        range: '₹499 – ₹999',
        time: 'Same Day',
        description: 'Solves excess ice formation, low cooling in lower chamber, or continuous running.',
        features: ['OEM grade thermostat', 'Bimetal sensor check', 'Temperature tuning'],
      },
      {
        name: 'Relay, Overload Protector & Capacitor',
        range: '₹449 – ₹899',
        time: 'Same Day',
        description: 'Fixes humming noise, clicking compressor restart sounds, or fridge tripping MCB.',
        features: ['High-durability starter relay', 'PTC component testing', '30-day warranty'],
      },
      {
        name: 'Inverter Compressor Diagnostics & PCB',
        range: '₹1,899 – ₹3,499',
        time: 'Same Day / 24 Hrs',
        description: 'Inverter compressor board troubleshooting and certified motor drive repair.',
        features: ['Inverter PCB diagnostics', 'Genuine replacement spares', '90-day warranty'],
      },
    ],
  },
  {
    id: 'washing-machine',
    category: 'Washing Machine',
    icon: Wrench,
    tagline: 'Front Load, Top Load, Semi-Automatic & Fully-Automatic machines',
    items: [
      {
        name: 'Doorstep Washing Machine Inspection',
        range: '₹299',
        time: '45–60 Mins',
        description: 'Check drum rotation, motor torque, inlet valves, drain pump & error code scan.',
        features: ['Adjusted against repair', 'Error code clearance', 'Doorstep diagnostics'],
      },
      {
        name: 'Drain Pump Repair & Blockage Removal',
        range: '₹449 – ₹899',
        time: 'Same Day',
        popular: true,
        description: 'Solves water retention, OE error codes, slow draining, or pump motor humming.',
        features: ['Filter descaling', 'High-flow replacement pump', '30-day warranty'],
      },
      {
        name: 'Spin Dryer & Drive Belt Repair',
        range: '₹499 – ₹1,099',
        time: 'Same Day',
        description: 'Fixes clothes coming out soaking wet, drum not spinning, or burning rubber smell.',
        features: ['Heavy-duty drive belt', 'Clutch spring test', 'Vibration reduction'],
      },
      {
        name: 'Tub Bearing & Spider Arm Repair',
        range: '₹1,199 – ₹2,199',
        time: '24–48 Hrs',
        description: 'Eliminates loud metallic grinding noise, violent drum shaking during high RPM spin.',
        features: ['High-grade sealed bearings', 'Drum realignment', '60-day warranty'],
      },
      {
        name: 'Electronic Control PCB Repair',
        range: '₹1,199 – ₹2,499',
        time: '24–48 Hrs',
        description: 'Fixes display blanking, touch buttons not responding, or sudden cycle pause.',
        features: ['Micro-relay replacement', 'Moisture sealing', '30-day warranty'],
      },
    ],
  },
  {
    id: 'ac',
    category: 'Air Conditioner (AC)',
    icon: Wind,
    tagline: 'Split & Window AC chemical jet servicing, gas filling & board repair',
    items: [
      {
        name: 'Deep Foam Chemical Jet Servicing',
        range: '₹499 – ₹799',
        time: '45–60 Mins',
        popular: true,
        description: 'High-pressure water pump wash for cooling fins, blower fan, drain tray & condenser.',
        features: ['Anti-bacterial foam spray', 'Filter & fin cleaning', 'Airflow & cooling boost'],
      },
      {
        name: 'AC Gas Charging & Leak Brazing',
        range: '₹1,699 – ₹2,499',
        time: 'Same Day',
        description: 'Full nitrogen pressure testing, flare nut brazing, vacuuming & gas charging (R32/R410A).',
        features: ['100% pure refrigerant', 'Leak proof warranty', 'Coil pressure test'],
      },
      {
        name: 'Capacitor & Fan Motor Replacement',
        range: '₹599 – ₹1,299',
        time: 'Same Day',
        description: 'Resolves indoor/outdoor fan not running, low breeze, or compressor not starting.',
        features: ['Heavy-duty dual capacitor', 'Motor winding test', '30-day warranty'],
      },
      {
        name: 'Split AC Installation / Uninstallation',
        range: '₹799 – ₹1,499',
        time: '60–90 Mins',
        description: 'Professional bracket mounting, copper pipe flare connection & vacuum pump testing.',
        features: ['Vibration pads included', 'Level balanced mounting', 'Zero gas leak test'],
      },
    ],
  },
  {
    id: 'others',
    category: 'Microwave & Other Appliances',
    icon: Flame,
    tagline: 'Microwaves, RO Water Purifiers, Geysers & Small Home Electronics',
    items: [
      {
        name: 'Microwave Heating / Magnetron Repair',
        range: '₹699 – ₹1,499',
        time: 'Same Day',
        popular: true,
        description: 'Fixes microwave turning on and spinning but not heating food at all.',
        features: ['Magnetron tube test', 'High-voltage diode check', 'Safety radiation seal'],
      },
      {
        name: 'Microwave Touchpad & Button Repair',
        range: '₹499 – ₹999',
        time: 'Same Day',
        description: 'Fixes un-responsive start button, touch membrane failure, or timer glitch.',
        features: ['Membrane keypad repair', 'Micro-switch service', '30-day warranty'],
      },
      {
        name: 'Geyser Element & Thermostat Repair',
        range: '₹599 – ₹1,199',
        time: 'Same Day',
        description: 'Solves water not heating, tripping circuit breaker, or scale deposition.',
        features: ['Heavy copper heating element', 'Auto-cutoff thermostat', 'Leakage seal'],
      },
      {
        name: 'RO Water Purifier Full Service & Filters',
        range: '₹499 – ₹1,399',
        time: 'Same Day',
        description: 'Sediment, pre-carbon, post-carbon filter replacement & TDS water purity tuning.',
        features: ['Certified filter kit', 'Membrane flushing', 'TDS water quality check'],
      },
    ],
  },
]

interface PricingSectionProps {
  showHeader?: boolean
  className?: string
  initialItems?: any[]
}

export function PricingSection({ showHeader = true, className = '', initialItems = [] }: PricingSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('tv')
  const [dbItems, setDbItems] = useState<any[]>(initialItems)
  const [hasLoadedFromDb, setHasLoadedFromDb] = useState<boolean>(Boolean(initialItems && initialItems.length > 0))
  const liveContact = useBusinessContact()
  const activePhone = liveContact.phone || SITE_CONFIG.phone
  const activeSecondary = liveContact.secondaryPhone || SITE_CONFIG.secondaryPhone
  const activeWhatsapp = liveContact.whatsapp || SITE_CONFIG.whatsapp

  // Synchronize when initialItems prop updates from SSR
  useEffect(() => {
    if (Array.isArray(initialItems)) {
      setDbItems(initialItems)
      if (initialItems.length > 0) {
        setHasLoadedFromDb(true)
      }
    }
  }, [initialItems])

  const loadPricing = () => {
    fetch(`/api/pricing?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && Array.isArray(json.data)) {
          setDbItems(json.data)
          setHasLoadedFromDb(true)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadPricing()

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'stardigital_updated_at') {
        loadPricing()
      }
    }
    const handleFocus = () => {
      loadPricing()
    }

    let channel: BroadcastChannel | null = null
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('stardigital_sync')
        channel.onmessage = (event) => {
          if (event.data?.type === 'PRICING_UPDATED' || event.data?.type === 'SYNC_ALL') {
            loadPricing()
          }
        }
      }
    } catch {}

    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', handleFocus)
      if (channel) channel.close()
    }
  }, [])

  // Parse features helper
  const parseFeatures = (features: any): string[] => {
    if (Array.isArray(features)) return features
    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features)
        if (Array.isArray(parsed)) return parsed
      } catch {}
      return features.split('\n').map((s) => s.trim()).filter(Boolean)
    }
    return []
  }

  // Combine or build dynamic categories from DB items
  const dynamicCategories: ServiceCategoryPricing[] = PRICING_DATA.map((baseCat) => {
    const matchingDbItems = dbItems.filter((i) => i.categoryId === baseCat.id)
    // Once loaded from database, the database is the single source of truth
    if (hasLoadedFromDb) {
      return {
        ...baseCat,
        items: matchingDbItems.map((item) => ({
          name: item.name,
          range: item.priceRange || item.range,
          time: item.serviceTime || item.time || 'Same Day',
          popular: Boolean(item.popular),
          description: item.description,
          features: parseFeatures(item.features),
        })),
      }
    }

    // Only fallback before DB loads
    if (matchingDbItems.length > 0) {
      return {
        ...baseCat,
        items: matchingDbItems.map((item) => ({
          name: item.name,
          range: item.priceRange || item.range,
          time: item.serviceTime || item.time || 'Same Day',
          popular: Boolean(item.popular),
          description: item.description,
          features: parseFeatures(item.features),
        })),
      }
    }
    return baseCat
  })

  // Add any extra custom categories created by admin if any
  const existingCategoryIds = new Set(PRICING_DATA.map((c) => c.id))
  const extraCategoryIds = Array.from(new Set(dbItems.map((i) => i.categoryId))).filter(
    (id) => !existingCategoryIds.has(id)
  )
  for (const extraId of extraCategoryIds) {
    const catItems = dbItems.filter((i) => i.categoryId === extraId)
    if (catItems.length > 0) {
      dynamicCategories.push({
        id: extraId,
        category: catItems[0].category || extraId,
        icon: Wrench,
        tagline: `Professional repair and maintenance in Kanpur`,
        items: catItems.map((item) => ({
          name: item.name,
          range: item.priceRange,
          time: item.serviceTime || 'Same Day',
          popular: Boolean(item.popular),
          description: item.description,
          features: parseFeatures(item.features),
        })),
      })
    }
  }

  const currentCategory = dynamicCategories.find((c) => c.id === activeTab) || dynamicCategories[0] || PRICING_DATA[0]

  return (
    <section id="pricing" className={`${showHeader ? 'py-16 sm:py-24 bg-white border-b border-slate-100' : 'py-8 sm:py-12 bg-white'} scroll-mt-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        {showHeader && (
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
              <BadgePercent className="w-4 h-4 text-red-600" />
              <span>TRANSPARENT REPAIR RATES • NO HIDDEN SURPRISES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Transparent Pricing &amp; Service Rate Card
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
              Honest Kanpur doorstep repair rates. Our inspection charge is{' '}
              <span className="font-bold text-slate-900">100% adjusted into your final bill</span> when you
              proceed with the repair.
            </p>
          </div>
        )}

        {/* 4 Trust Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase">₹0 Inspection</p>
              <p className="text-xs text-slate-500">Waived on repair approval</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase">30–90 Day Warranty</p>
              <p className="text-xs text-slate-500">On genuine spare parts</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase">45–60 Min Arrival</p>
              <p className="text-xs text-slate-500">Rapid doorstep response</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase">100% Genuine Spares</p>
              <p className="text-xs text-slate-500">Direct OEM parts with bill</p>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {dynamicCategories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeTab === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.category}</span>
              </button>
            )
          })}
        </div>

        {/* Active Category Header Tagline */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
          <div>
            <span className="text-xs font-bold uppercase text-red-600 tracking-wider">
              {currentCategory.category} Rate Card
            </span>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{currentCategory.tagline}</p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Exact quote provided after physical diagnosis</span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        {currentCategory.items.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium text-sm">
              No service rate cards currently listed for this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory.items.map((item, idx) => (
              <ScrollReveal key={idx} animation="fade-up" delay={idx * 50}>
              <div
                className={`h-full relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                  item.popular
                    ? 'bg-white border-2 border-red-500 shadow-xl shadow-red-500/5'
                    : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300'
                }`}
              >
                {item.popular && (
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                    Most Requested
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{item.name}</h3>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {item.range}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">estimated cost</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-2 pb-5 border-t border-slate-100">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={getWhatsAppUrl(
                      `Hello STAR DIGITAL, I am inquiring about pricing for: ${item.name} (${item.range}). Please share technician availability in Kanpur.`
                    )}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20bd5a] transition-all shadow-sm"
                    aria-label={`Inquire about ${item.name} on WhatsApp`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={getDialerUrl(activePhone)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-red-600 transition-all shadow-sm"
                    aria-label={`Call technician for ${item.name}`}
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

        {/* Pricing Policy & Note Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Diagnostic Visit Charge</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard doorstep inspection across Kanpur is ₹299. If you approve the repair work, the
                entire ₹299 visit fee is waived and adjusted in your invoice.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Genuine Spares Guarantee</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We only utilize genuine manufacturer-certified replacement components (capacitors, motors,
                pumps, backlight strips) backed by a 30 to 90-day service warranty.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Flexible Payment Options</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pay only after you are completely satisfied with the repair. We accept Cash, UPI (Google Pay,
                PhonePe, Paytm), and Net Banking.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold text-slate-700">
                Have a unique issue or need a custom appliance repair quote?
              </p>
              <p className="text-xs text-slate-500">
                Speak directly with Star Digital’s technical manager at{' '}
                <span className="font-bold text-slate-800">{activePhone}</span> /{' '}
                <span className="font-bold text-slate-800">{activeSecondary}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={getDialerUrl(activePhone)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Call {activePhone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
