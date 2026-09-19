import { PhoneCall, UserCheck, CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { ScrollReveal } from '@/components/ScrollReveal'

export function HowItWorksSection() {
  const steps: { step: string; title: string; desc: string; icon: ReactNode }[] = [
    {
      step: '01',
      title: 'Direct WhatsApp or Call Helpline',
      desc: 'Send a quick WhatsApp message or call our Kanpur helpline. Share your appliance type and observed symptoms.',
      icon: <PhoneCall className="w-6 h-6 text-star-600" />,
    },
    {
      step: '02',
      title: 'Technician Visits Your Doorstep',
      desc: 'A verified Star Digital technician arrives with specialized tools, conducts inspection, and provides a clear quote.',
      icon: <UserCheck className="w-6 h-6 text-star-600" />,
    },
    {
      step: '03',
      title: 'Repair Done & Tested',
      desc: 'The repair is executed on-site, tested in front of you for performance, and backed by a service warranty.',
      icon: <CheckCircle2 className="w-6 h-6 text-star-600" />,
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-star-600">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-apple-text tracking-tight mt-1">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-apple-secondary mt-2">
            Minimum friction. Zero runaround. Clear communication from first call to final testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => (
            <ScrollReveal
              key={s.step}
              animation="fade-up"
              delay={idx * 120}
              duration={600}
              className="h-full"
            >
              <div className="relative flex flex-col items-center text-center p-6 sm:p-8 rounded-apple-lg bg-apple-canvas border border-black/[0.06] shadow-apple h-full">
                <div className="absolute top-4 right-5 text-2xl font-black text-slate-300 select-none">
                  {s.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white border border-black/[0.08] flex items-center justify-center mb-6 shadow-sm">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-apple-text tracking-tight">{s.title}</h3>
                <p className="text-xs sm:text-sm text-apple-secondary mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
