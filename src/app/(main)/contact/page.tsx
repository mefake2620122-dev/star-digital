'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, MessageSquare, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'
import { useBusinessContact } from '@/context/ContactContext'

export default function ContactPage() {
  const contact = useBusinessContact()
  const activePhone = contact.phone || SITE_CONFIG.phone
  const activeWhatsapp = contact.whatsapp || SITE_CONFIG.whatsapp
  const activeSecondary = contact.secondaryPhone || SITE_CONFIG.secondaryPhone
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'AC Repair & Service',
    message: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || formData.phone.length < 10 || !formData.message.trim()) {
      setErrorMsg('Please enter your name, a valid 10-digit phone number, and problem details.')
      return
    }

    try {
      setSubmitting(true)
      setErrorMsg(null)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit')

      setSuccess(true)
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'AC Repair & Service',
        message: '',
      })
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit message. Please call our helpline directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900">Contact</span>
        </nav>

        {/* Heading */}
        <div className="max-w-3xl mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider mb-3">
            Kanpur Helpline Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Get In Touch With Our Service Team
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            Whether you need urgent doorstep repair or have questions regarding appliance maintenance, we are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Direct Contact Information</h3>

              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-red-50/50 hover:border-red-100 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                    <Phone className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                      Helpline & Calling
                    </p>
                    <a
                      href={getDialerUrl(activePhone)}
                      className="font-bold text-slate-900 hover:text-red-600 transition-colors text-base block"
                    >
                      {activePhone}
                    </a>
                    {activeSecondary && (
                      <a
                        href={getDialerUrl(activeSecondary)}
                        className="font-semibold text-slate-600 hover:text-red-600 transition-colors text-xs block mt-0.5"
                      >
                        Alt Phone: {activeSecondary}
                      </a>
                    )}
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Technical Desk: Mr. Nafees Alam (Direct dispatch)
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-100 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center shrink-0 border border-emerald-100">
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                      WhatsApp Assistance
                    </p>
                    <a
                      href={getWhatsAppUrl('Hello STAR DIGITAL, I have an appliance query.', activeWhatsapp)}
                      className="font-bold text-slate-900 hover:text-[#25D366] transition-colors text-base block"
                    >
                      Chat On WhatsApp
                    </a>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Direct photo sharing & symptom diagnosis
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-slate-200/70 text-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                      Central Service Hub
                    </p>
                    <p className="font-semibold text-slate-800 mt-0.5 text-sm">
                      Maqbara Gwaltoli, Near Elgin Mill
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Civil Lines, Kanpur - 208001, Uttar Pradesh
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-slate-200/70 text-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                      Operating Hours
                    </p>
                    <p className="font-semibold text-slate-800 mt-0.5 text-sm">
                      {SITE_CONFIG.hours}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">
                      Open 7 Days a Week • Rapid 2-Hour Response
                    </p>
                  </div>
                </div>

                {/* Service Guarantee Badge */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-xs">
                      ✓ 100%
                    </span>
                    <span className="text-xs text-emerald-950 font-semibold">
                      Doorstep Service Guarantee • Genuine OEM Spares
                    </span>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold">
                    Est. 2014
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Send Us A Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Fill out the form below and an engineer from our Civil Lines desk will call you back.
              </p>

              {success && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Thank you! Your message has been received. Our team will contact you shortly.
                  </span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9839012345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Related Appliance / Service
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all bg-white"
                    >
                      <option value="AC Repair & Service">AC Repair & Service</option>
                      <option value="Refrigerator Repair">Refrigerator Repair</option>
                      <option value="Washing Machine Service">Washing Machine Service</option>
                      <option value="LED / LCD TV Repair">LED / LCD TV Repair</option>
                      <option value="CCTV Security Setup">CCTV Security Setup</option>
                      <option value="Other Appliances">Other Home Appliances</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Problem Details / Symptoms *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the issue, appliance brand/model, and your locality in Kanpur..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Our Location in Kanpur</h3>
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
              title="Star Digital Location Map"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
