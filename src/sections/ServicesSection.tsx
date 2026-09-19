import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { active: true },
      include: { categories: { where: { active: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    return []
  }
}

// Simple icon map (icon stored as string in DB)
const iconMap: Record<string, string> = {
  Wind: '❄️',
  Refrigerator: '🧊',
  Washing: '🌀',
  Tv: '📺',
  Camera: '📷',
  Zap: '⚡',
}

export async function ServicesSection() {
  const services = await getServices()

  return (
    <section className="py-16 sm:py-24 bg-apple-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-star-600">
              Our Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-apple-text tracking-tight mt-1">
              What Can We Fix?
            </h2>
            <p className="text-sm sm:text-base text-apple-secondary mt-2 max-w-xl">
              Professional doorstep diagnostic, maintenance, and genuine parts replacement for all household electronics in Kanpur.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm font-semibold text-star-600 hover:text-star-700 transition-colors shrink-0"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-apple-secondary text-sm py-12">
            Services are being loaded. Please run{' '}
            <code className="bg-slate-100 px-1 rounded">npm run db:setup</code> to seed the database.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <ScrollReveal
                key={service.id}
                animation="fade-up"
                delay={idx * 60}
                duration={600}
                className="h-full"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group bg-white rounded-apple-lg border border-black/[0.07] p-6 shadow-apple hover:shadow-apple-hover hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 h-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-apple bg-star-50 border border-star-100 flex items-center justify-center text-xl">
                      {iconMap[service.icon] ?? '🔧'}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-star-600 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-apple-text tracking-tight group-hover:text-star-700 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-apple-secondary mt-1.5 line-clamp-2 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Doorstep Service</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
