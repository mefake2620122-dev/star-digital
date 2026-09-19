'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Star,
  MessageSquareQuote,
  Sparkles,
  X,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from 'lucide-react'

export interface ReviewItem {
  id: string
  customerName: string
  area: string
  rating: number
  review: string
  isPlaceholder?: boolean
  published?: boolean
  sortOrder?: number
  createdAt?: string | Date
  isJustAdded?: boolean
}

interface ReviewsClientProps {
  initialReviews: ReviewItem[]
}

const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-600',
  'from-purple-500 to-violet-700',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[index]
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews || [])
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Real-time background sync: updates reviews periodically without page reload
  useEffect(() => {
    const fetchLatestReviews = async () => {
      try {
        const res = await fetch('/api/reviews', { cache: 'no-store' })
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setReviews((prev) => {
            const existingIds = new Set(json.data.map((r: ReviewItem) => r.id))
            const localOnly = prev.filter((r) => r.isJustAdded && !existingIds.has(r.id))
            return [...localOnly, ...json.data]
          })
        }
      } catch {
        // silent sync fallback
      }
    }

    const interval = setInterval(fetchLatestReviews, 20000)
    return () => clearInterval(interval)
  }, [])

  // Auto-hide celebratory toast after 6 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Average Rating
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: '5.0', count: 0, fiveStars: 0 }
    const total = reviews.reduce((sum, r) => sum + (r.rating || 5), 0)
    const avg = (total / reviews.length).toFixed(1)
    const fiveStars = reviews.filter((r) => r.rating === 5).length
    return { avg, count: reviews.length, fiveStars }
  }, [reviews])

  const filteredReviews = useMemo(() => {
    if (filterRating === 'ALL') return reviews
    return reviews.filter((r) => r.rating === filterRating)
  }, [reviews, filterRating])

  return (
    <div id="reviews-container" className="relative space-y-10">
      {/* Toast Notification for Real-Time Feedback */}
      {toastMessage && (
        <div className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Review Published Live
            </h4>
            <p className="text-xs text-slate-200 leading-snug">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-auto"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Trust & Action Header */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-black/[0.06] p-6 sm:p-8 shadow-apple flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
          <div className="flex flex-col items-center justify-center bg-white px-5 py-4 rounded-2xl border border-black/[0.06] shadow-sm">
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              <Star className="w-6 h-6 fill-current" />
              <span className="text-3xl font-black text-slate-900">{stats.avg}</span>
            </div>
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-slate-500 mt-1">
              Based on {stats.count} reviews
            </span>
          </div>

          <div className="space-y-1.5 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Verified Kanpur Customers</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-apple-text">
              Real Reviews from Genuine Kanpur Homes
            </h3>
            <p className="text-xs sm:text-sm text-apple-secondary leading-relaxed">
              Have you experienced our appliance repair services recently? Share your feedback to help Kanpur neighbors!
            </p>
          </div>
        </div>

        {/* CTA Button: Navigate to Dedicated Review Page */}
        <div className="shrink-0 w-full sm:w-auto">
          <Link
            href="/review"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-600/25 active:scale-98 transition-all group"
            id="write-review-button"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Rate Your Experience</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setFilterRating('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filterRating === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilterRating(5)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
              filterRating === 5
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>5 Stars ({stats.fiveStars})</span>
          </button>
        </div>

        <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Live Feed</span>
        </div>
      </div>

      {/* Review Cards Grid */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-black/[0.06] p-12 text-center text-slate-400 space-y-3">
          <MessageSquareQuote className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
          <p className="text-sm font-semibold">No reviews matching the selected filter.</p>
          <button
            onClick={() => setFilterRating('ALL')}
            className="text-xs text-red-600 font-bold underline"
          >
            View all reviews
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-white rounded-3xl border p-6 shadow-apple flex flex-col justify-between transition-all duration-300 hover:shadow-apple-hover hover:border-black/15 ${
                rev.isJustAdded
                  ? 'border-emerald-500 ring-4 ring-emerald-500/20 animate-in fade-in zoom-in-95'
                  : 'border-black/[0.06]'
              }`}
            >
              <div>
                {/* Header: Rating & Real-time badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {rev.isJustAdded ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Just Added</span>
                    </span>
                  ) : (
                    <MessageSquareQuote className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                {/* Review body */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                      rev.customerName
                    )} text-white flex items-center justify-center font-black text-xs shadow-sm`}
                  >
                    {getInitials(rev.customerName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {rev.customerName}
                      </h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="truncate max-w-[150px]">{rev.area}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {rev.isJustAdded ? 'Today' : 'Verified'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
