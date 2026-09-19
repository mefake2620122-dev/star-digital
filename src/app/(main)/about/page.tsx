import Link from 'next/link'
import { ShieldCheck, Wrench, Clock, Users, MessageSquare, Phone } from 'lucide-react'
import { SITE_CONFIG, getDialerUrl, getWhatsAppUrl } from '@/lib/site'

export const metadata = {
  title: 'About Us | STAR DIGITAL Kanpur Appliance Care',
  description: 'Learn about STAR DIGITAL: Certified doorstep appliance repair and installation specialists operating from Maqbara Gwaltoli, Near Elgin Mill, Civil Lines, Kanpur since 2014.',
}

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900">About Us</span>
        </nav>

        {/* Hero Editorial Header */}
        <div className="max-w-3xl mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider mb-3">
            Established 2014 • Kanpur Appliance Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Engineering Reliability.{' '}
            <span className="text-red-600 block sm:inline">Right At Your Home.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            STAR DIGITAL was founded in 2014 near Elgin Mill, Civil Lines to eliminate the hassle of transporting delicate LED TVs and heavy appliances to distant shops. We bring testing instruments, diagnostic tools, and certified technicians straight to your doorstep across Kanpur.
          </p>
        </div>

        {/* Section: Who We Are & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Who We Are
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              A Dedicated Local Service Team Based in Civil Lines
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Operating centrally from Maqbara Gwaltoli, Near Elgin Mill, Civil Lines in Kanpur, Star Digital provides specialized servicing for smart LED/LCD televisions, air conditioners, refrigerators, washing machines, and microwave ovens.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              With 13+ years of continuous service across Kanpur homes, we believe modern appliances require proper diagnostic methodology—not guesswork. Our technicians carry refrigerant gauges, multimeters, leak detectors, and certified OEM replacement spares.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">2014</h4>
                <p className="text-xs text-slate-500 mt-0.5">Year Established</p>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">13+ Yrs</h4>
                <p className="text-xs text-slate-500 mt-0.5">Local Experience</p>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">Doorstep</h4>
                <p className="text-xs text-slate-500 mt-0.5">Across Kanpur</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-black/10 bg-slate-900 relative">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80"
                alt="Technician testing air conditioning electronics with digital equipment"
                className="w-full h-80 sm:h-96 object-cover object-center opacity-90 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Section: What We Do & Our Approach */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Our Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              The Star Digital Approach
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Four principles that govern every technician visit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Wrench className="w-5 h-5 text-red-600" />,
                title: 'Exact Diagnostics First',
                desc: 'We never begin replacing components blindly. We isolate the electrical, mechanical, or thermodynamic root cause.',
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
                title: 'Genuine Spares Only',
                desc: 'Every replaced capacitor, compressor relay, drain pump, or LED backlight strip is sourced with genuine quality standards.',
              },
              {
                icon: <Clock className="w-5 h-5 text-red-600" />,
                title: 'Respect For Your Schedule',
                desc: 'We confirm visit windows before dispatch and arrive equipped to complete the job in a single visit whenever feasible.',
              },
              {
                icon: <Users className="w-5 h-5 text-red-600" />,
                title: 'Customer Transparency',
                desc: 'All quotes are communicated before any disassembly. If a repair is not cost-effective, we advise you honestly.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4 border border-red-100">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Service Hub Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Kanpur Operations
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Serving All Key Neighborhoods
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              From Swaroop Nagar, Mall Road, and Kakadeo to Kidwai Nagar and Kalyanpur, our technicians are on standby for same-day service.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 z-10">
            <a
              href={getWhatsAppUrl('Hello STAR DIGITAL, I want to learn more about your appliance repair services in Kanpur.')}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={getDialerUrl(SITE_CONFIG.phone)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
