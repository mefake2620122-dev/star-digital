import Link from 'next/link'
import { ReviewsSection } from '@/sections/ReviewsSection'

export const metadata = {
  title: 'Customer Reviews & Ratings | STAR DIGITAL Kanpur Appliance Care',
  description:
    'Read real, verified doorstep appliance repair reviews from Kanpur residents. Rated 4.9/5 for LED TV, AC, Refrigerator, and Washing Machine repairs.',
}
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ReviewsPage() {
  return (
    <div className="py-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Customer Reviews</span>
        </nav>
      </div>

      <ReviewsSection />
    </div>
  )
}
