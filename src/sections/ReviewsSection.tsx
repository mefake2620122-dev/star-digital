import { prisma } from '@/lib/prisma'
import { Info } from 'lucide-react'
import { ReviewsClient } from '@/components/ReviewsClient'

async function getReviews() {
  try {
    const reviews = await prisma.review.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return JSON.parse(JSON.stringify(reviews))
  } catch {
    return []
  }
}

export async function ReviewsSection() {
  const reviews = await getReviews()

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-white border-b border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-apple-secondary text-xs font-semibold">
            <Info className="w-3.5 h-3.5 text-apple-secondary" />
            <span>Customer Testimonials & Ratings</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-apple-text tracking-tight">
            What Kanpur Residents Say
          </h2>

          <p className="text-sm sm:text-base text-apple-secondary">
            Genuine feedback from doorstep appliance repairs across Civil Lines, Swaroop Nagar, Kakadeo, and beyond.
          </p>
        </div>

        {/* Real-time Interactive Reviews Client */}
        <ReviewsClient initialReviews={reviews} />
      </div>
    </section>
  )
}
