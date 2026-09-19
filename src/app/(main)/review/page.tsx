import Link from 'next/link'
import { Star, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react'
import { ReviewFormClient } from './ReviewFormClient'

export const metadata = {
  title: 'Rate Your Experience & Add Review | STAR DIGITAL Kanpur',
  description:
    'Share your verified doorstep appliance repair review for STAR DIGITAL Kanpur. Help fellow Kanpur residents choose honest, certified technicians with genuine spare parts.',
}

export default function ReviewPage() {
  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 max-w-2xl mx-auto">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/#reviews" className="hover:text-red-600 transition-colors">Customer Reviews</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Write a Review</span>
        </nav>

        {/* Dedicated Review Form Client */}
        <ReviewFormClient />
      </div>
    </div>
  )
}
