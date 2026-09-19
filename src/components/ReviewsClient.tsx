'use client'

import React, { useState, useEffect, useMemo } from 'react'
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

const KANPUR_LOCALITY_SUGGESTIONS = [
  'Civil Lines',
  'Kakadeo',
  'Swaroop Nagar',
  'Kidwai Nagar',
  'Govind Nagar',
  'Kalyanpur',
  'Shyam Nagar',
  'Barra',
  'Panki',
]

const APPLIANCE_SUGGESTIONS = [
  'Split AC',
  'Washing Machine',
  'Refrigerator',
  'Microwave Oven',
  'LED / Smart TV',
  'RO Water Purifier',
]

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL')

  // Form states
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [selectedAppliance, setSelectedAppliance] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
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

  // Lock background scroll and handle Escape key when review screen is open
  useEffect(() => {
    if (isModalOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsModalOpen(false)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = originalOverflow
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isModalOpen])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).')
      return
    }

    if (!area.trim() || area.trim().length < 2) {
      setErrorMsg('Please select or type your locality in Kanpur (e.g. Kakadeo, Civil Lines).')
      return
    }

    if (!reviewText.trim() || reviewText.trim().length < 5) {
      setErrorMsg('Please write a short review describing your service experience.')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          area: area.trim(),
          appliance: selectedAppliance.trim(),
          rating,
          review: reviewText.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish review. Please try again.')
      }

      // Optimistically add to top of reviews list in REAL TIME
      const newReview: ReviewItem = {
        ...data.data,
        isJustAdded: true,
      }

      setReviews((prev) => [newReview, ...prev])
      setIsModalOpen(false)
      setName('')
      setArea('')
      setSelectedAppliance('')
      setRating(5)
      setReviewText('')
      setToastMessage('Thank you! Your review has been published and is now live.')

      // Scroll smoothly to reviews section
      const el = document.getElementById('reviews-container')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while submitting.')
    } finally {
      setSubmitting(false)
    }
  }

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5:
        return '⭐️⭐️⭐️⭐️⭐️ Outstanding! Highly Recommended'
      case 4:
        return '⭐️⭐️⭐️⭐️ Very Good & Professional'
      case 3:
        return '⭐️⭐️⭐️ Average / Standard Service'
      case 2:
        return '⭐️⭐️ Needs Improvement'
      case 1:
        return '⭐️ Disappointed'
      default:
        return ''
    }
  }

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

        {/* CTA Button: Open Review Modal */}
        <div className="shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-600/25 active:scale-98 transition-all group"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Rate Your Experience</span>
          </button>
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

      {/* ── FULL SCREEN DEDICATED REVIEW SCREEN (NO NAVBAR, NO BACKGROUND BLEED, NEVER CUT OFF) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#f5f5f7] overflow-y-auto flex flex-col min-h-screen">
          {/* Scrollable Content Form Area (Navbar completely removed as requested) */}
          <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24">
            <div className="bg-white rounded-3xl border border-black/[0.08] shadow-apple-hover p-6 sm:p-10 space-y-6 relative">
              {/* Subtle top-right close icon on the card */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all active:scale-95"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header pitch */}
              <div className="text-center space-y-2 pb-5 border-b border-slate-100 pr-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Share Your Experience</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Rate Your Star Digital Experience
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your review is published live instantly and helps fellow Kanpur residents choose trusted local appliance repairs.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
                    <X className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Star Rating Picker */}
                <div className="space-y-1.5 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <label className="block text-xs font-bold text-slate-700">
                    Tap to Rate Our Service *
                  </label>
                  <div className="flex items-center justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating !== null ? hoverRating : rating) >= star
                      return (
                        <button
                          type="button"
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-all ${
                              active
                                ? 'text-amber-500 fill-amber-500 drop-shadow-sm'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs font-bold text-amber-600 min-h-[18px]">
                    {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditya Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
                  />
                </div>

                {/* Kanpur Area / Locality */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kanpur Locality / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kakadeo, Civil Lines, Swaroop Nagar"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
                  />
                  {/* Locality suggestions chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {KANPUR_LOCALITY_SUGGESTIONS.map((loc) => (
                      <button
                        type="button"
                        key={loc}
                        onClick={() => setArea(loc)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          area.toLowerCase() === loc.toLowerCase()
                            ? 'bg-red-600 text-white border-red-600 font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appliance Type (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Appliance Repaired (Optional)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {APPLIANCE_SUGGESTIONS.map((app) => (
                      <button
                        type="button"
                        key={app}
                        onClick={() =>
                          setSelectedAppliance((prev) => (prev === app ? '' : app))
                        }
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          selectedAppliance === app
                            ? 'bg-slate-900 text-white border-slate-900 font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Your Review & Experience *
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {reviewText.length}/800
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    maxLength={800}
                    placeholder="Describe your service experience: technician punctuality, diagnosis accuracy, repair quality, pricing transparency..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 leading-relaxed resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-600/25 active:scale-98 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Posting Live...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Post Review Instantly</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
