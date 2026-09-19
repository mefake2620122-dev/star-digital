import { ShieldCheck, Clock, BadgeIndianRupee, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { ScrollReveal } from '@/components/ScrollReveal'

interface Benefit {
  icon: ReactNode
  title: string
  desc: string
}

export function WhyStarDigital() {
  const benefits: Benefit[] = [
    {
      icon: <Clock className="w-6 h-6 text-star-600" />,
      title: 'Prompt In-Home Service',
      desc: 'No need to transport heavy appliances across Kanpur traffic. Our technicians bring testing gauges, pumps, and genuine spares straight to your house.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-star-600" />,
      title: 'Skilled Technicians',
      desc: 'Hands-on troubleshooting for modern inverter PCB microcontrollers, brushless motors, and dual-zone cooling systems.',
    },
    {
      icon: <BadgeIndianRupee className="w-6 h-6 text-star-600" />,
      title: 'Fair & Transparent Pricing',
      desc: 'Direct quotes prior to commencing any work. If replacement spares are required, we explain exactly why with honest diagnostics.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-star-600" />,
      title: 'Local Kanpur Reliability',
      desc: 'Operating centrally near Elgin Mill, Gwaltoli & Civil Lines with rapid service coverage across Swaroop Nagar, Kakadeo, and all Kanpur neighborhoods.',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-apple-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-star-600">
            The Star Digital Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-apple-text tracking-tight mt-1">
            Why Star Digital?
          </h2>
          <p className="text-sm sm:text-base text-apple-secondary mt-2">
            Built on engineering diligence, punctuality, and long-term local trust in Kanpur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => (
            <ScrollReveal
              key={idx}
              animation="fade-up"
              delay={idx * 80}
              duration={600}
              className="h-full"
            >
              <div className="bg-white rounded-apple-lg border border-black/[0.07] p-6 shadow-apple hover:shadow-apple-card transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-apple bg-star-50 border border-star-100/70 flex items-center justify-center mb-5">
                    {b.icon}
                  </div>
                  <h3 className="text-base font-bold text-apple-text tracking-tight">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-apple-secondary mt-2 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
