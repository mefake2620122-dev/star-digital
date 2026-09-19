'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Menu, X, Star, MessageSquare, Shield } from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'
import { useBusinessContact } from '@/context/ContactContext'
import type { ContactInfo } from '@/lib/contact'

interface NavbarProps {
  contact?: ContactInfo
}

export function Navbar({ contact }: NavbarProps) {
  const liveContact = useBusinessContact()
  const activePhone = contact?.phone || liveContact.phone || SITE_CONFIG.phone
  const activeWhatsapp = contact?.whatsapp || liveContact.whatsapp || SITE_CONFIG.whatsapp

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Work Photos', path: '/photos' },
    { name: 'Service Areas', path: '/service-areas' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false
    return pathname.startsWith(path)
  }

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-navbar border-b border-black/[0.06] shadow-sm py-3'
            : 'bg-white/80 backdrop-blur-md border-b border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group focus:outline-none" aria-label="Star Digital Home">
            <div className="w-9 h-9 rounded-apple bg-star-600 text-white flex items-center justify-center shadow-sm group-hover:bg-star-700 transition-colors">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-apple-text leading-none group-hover:text-star-600 transition-colors">
                STAR DIGITAL
              </span>
              <span className="text-[10px] font-semibold text-apple-secondary tracking-wider uppercase mt-0.5">
                Appliance Care • Kanpur
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3.5 py-2 text-sm font-medium rounded-apple transition-colors ${
                  isActive(link.path)
                    ? 'text-star-600 bg-star-50 font-semibold'
                    : 'text-apple-secondary hover:text-apple-text hover:bg-black/[0.03]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href={getWhatsAppUrl('Hello STAR DIGITAL, I need doorstep appliance repair service in Kanpur.', activeWhatsapp)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs lg:text-sm font-semibold rounded-apple text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] transition-all"
              aria-label="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366] fill-current" />
              <span>WhatsApp</span>
            </a>

            <a
              href={getDialerUrl(activePhone)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs lg:text-sm font-semibold rounded-apple bg-star-600 text-white hover:bg-star-700 active:scale-[0.98] transition-all shadow-sm"
              aria-label={`Call Star Digital at ${activePhone}`}
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Call Now</span>
            </a>

            {/* Admin Portal Button — subtle shield icon */}
            <Link
              href="/admin"
              className="p-2 rounded-xl text-slate-400 hover:text-star-600 hover:bg-star-50 transition-all"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-apple text-apple-text hover:bg-black/[0.04] focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Full-Screen Sheet (Elevated above all elements including bottom bars) */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[99999] bg-white flex flex-col h-[100dvh] w-full overflow-hidden animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Top Bar inside Drawer */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-md shrink-0">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-apple bg-star-600 text-white flex items-center justify-center shadow-sm">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                  STAR DIGITAL
                </span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                  Kanpur Appliance Hub
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Middle Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 pb-8">
            {/* Navigation Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    isActive(link.path)
                      ? 'bg-star-50 text-star-600 font-bold'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Direct Admin Control Center link in list */}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all mt-1"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-600" />
                  <span>Admin Control Center</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">/admin</span>
              </Link>
            </div>
          </div>

          {/* Fixed Drawer Bottom Bar */}
          <div className="p-4 border-t border-slate-100 bg-white/95 backdrop-blur-md safe-bottom shrink-0 shadow-lg">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={getWhatsAppUrl('Hello STAR DIGITAL, I need doorstep appliance repair service in Kanpur.', activeWhatsapp)}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#25D366] active:bg-[#20bd5a] text-white font-bold text-xs shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>

              <a
                href={getDialerUrl(activePhone)}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-star-600 active:bg-star-700 text-white font-bold text-xs shadow-md"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
