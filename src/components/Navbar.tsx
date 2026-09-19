'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Menu, X, Star, MessageSquare, Shield } from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'

export function Navbar() {
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
    { name: 'Work Photos', path: '/photos' },
    { name: 'Service Areas', path: '/service-areas' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false
    return pathname.startsWith(path)
  }

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
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-star-50 text-star-600 font-semibold'
                    : 'text-apple-secondary hover:text-apple-text hover:bg-black/[0.03]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href={getWhatsAppUrl('Hello STAR DIGITAL, I need urgent appliance repair consultation in Kanpur.')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs lg:text-sm font-semibold rounded-apple bg-[#25D366] text-white hover:bg-[#20bd5a] active:scale-[0.98] transition-all shadow-sm"
              aria-label="Chat with technician on WhatsApp"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>

            <a
              href={getDialerUrl(SITE_CONFIG.phone)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs lg:text-sm font-semibold rounded-apple bg-star-600 text-white hover:bg-star-700 active:scale-[0.98] transition-all shadow-sm"
              aria-label={`Call Star Digital at ${SITE_CONFIG.phone}`}
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-x-0 top-0 bg-white border-b border-black/10 shadow-2xl p-5 pt-16 flex flex-col gap-4 animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer top close button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation Menu</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-base font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-star-50 text-star-600 font-bold'
                      : 'text-apple-text hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <a
                href={getWhatsAppUrl('Hello STAR DIGITAL, I need doorstep appliance repair service in Kanpur.')}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] active:bg-[#20bd5a] text-white font-bold text-sm shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={getDialerUrl(SITE_CONFIG.phone)}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-600 active:bg-red-700 text-white font-bold text-sm shadow-md"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Call {SITE_CONFIG.phone}</span>
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
