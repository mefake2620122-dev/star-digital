'use client'

import Link from 'next/link'
import { Star, MessageSquare, Phone, MapPin, Clock, Mail, Shield } from 'lucide-react'
import { SITE_CONFIG, getWhatsAppUrl, getDialerUrl } from '@/lib/site'
import { useBusinessContact } from '@/context/ContactContext'
import type { ContactInfo } from '@/lib/contact'

interface FooterProps {
  contact?: ContactInfo
}

export function Footer({ contact }: FooterProps) {
  const liveContact = useBusinessContact()
  const activePhone = contact?.phone || liveContact.phone || SITE_CONFIG.phone
  const activeWhatsapp = contact?.whatsapp || liveContact.whatsapp || SITE_CONFIG.whatsapp
  const activeSecondary = contact?.secondaryPhone || liveContact.secondaryPhone || SITE_CONFIG.secondaryPhone
  const activeAddress = contact?.address || liveContact.address || SITE_CONFIG.address
  const activeEmail = contact?.email || liveContact.email || SITE_CONFIG.email

  const services = [
    { name: 'AC Repair', slug: 'ac' },
    { name: 'Refrigerator Repair', slug: 'refrigerator' },
    { name: 'Washing Machine Repair', slug: 'washing-machine' },
    { name: 'LED TV Repair', slug: 'led-lcd-tv' },
    { name: 'CCTV Installation', slug: 'cctv' },
  ]

  return (
    <footer className="bg-apple-dark text-white pt-16 pb-24 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="w-10 h-10 rounded-apple bg-star-600 text-white flex items-center justify-center">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight">STAR DIGITAL</p>
                <p className="text-xs text-white/50 font-medium uppercase tracking-wider">
                  Expert Appliance Service
                </p>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-4">
              Kanpur's trusted doorstep appliance repair service since 2014. Certified technicians for LED/LCD TV, AC,
              refrigerators, washing machines, and microwave ovens.
            </p>

            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/90 mb-5">
              <span className="text-emerald-400 font-bold">✓ Verified Center</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/80">Est. 2014</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/60">Civil Lines, Kanpur</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={getWhatsAppUrl('Hello STAR DIGITAL, I need doorstep appliance repair in Kanpur.', activeWhatsapp)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-apple bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] active:scale-[0.97] transition-all"
                aria-label="WhatsApp Chat"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>

              <a
                href={getDialerUrl(activePhone)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-apple bg-white/10 hover:bg-white/20 text-white text-sm font-semibold active:scale-[0.97] transition-all"
                aria-label={`Call ${activePhone}`}
              >
                <Phone className="w-4 h-4" />
                <span>{activePhone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links & Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/pricing" className="text-white/60 hover:text-white transition-colors">
                  Pricing &amp; Rate Card
                </Link>
              </li>
              <li>
                <Link href="/photos" className="text-white/60 hover:text-white transition-colors">
                  Real Work Photos
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white/60 hover:text-white transition-colors">
                  All Repair Services
                </Link>
              </li>
              <li>
                <Link href="/service-areas" className="text-white/60 hover:text-white transition-colors">
                  Kanpur Service Areas
                </Link>
              </li>
              <li>
                <Link href="/review" className="text-white/60 hover:text-white transition-colors">
                  Rate Your Experience
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Contact & Hub
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-star-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block text-white/90 font-medium text-xs sm:text-sm">{activeAddress}</span>
                  <span className="block text-[11px] text-white/60">Kanpur, Uttar Pradesh</span>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-star-400 shrink-0" />
                <div>
                  <a href={getDialerUrl(activePhone)} className="hover:text-white transition-colors block">
                    {activePhone}
                  </a>
                  {activeSecondary && (
                    <a href={getDialerUrl(activeSecondary)} className="text-xs text-white/50 hover:text-white transition-colors block">
                      Alt: {activeSecondary}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-star-400 shrink-0" />
                <span>{SITE_CONFIG.hours}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-star-400 shrink-0" />
                <a href={`mailto:${activeEmail}`} className="hover:text-white transition-colors">
                  {activeEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>
            © {new Date().getFullYear()} STAR DIGITAL (Est. 2014). Serving Civil Lines, Swaroop Nagar, Kakadeo & all Kanpur.
          </p>
          <Link
            href="/admin"
            className="flex items-center gap-1 hover:text-white/60 transition-colors"
            aria-label="Admin Portal"
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
