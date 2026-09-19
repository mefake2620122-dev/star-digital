'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Star,
  Sparkles,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Wrench,
  ThumbsUp,
  Clock,
  HeartHandshake,
} from 'lucide-react'

const KANPUR_LOCALITIES = [
  'Civil Lines',
  'Kakadeo',
  'Swaroop Nagar',
  'Kidwai Nagar',
  'Govind Nagar',
  'Kalyanpur',
  'Shyam Nagar',
  'Barra',
  'Panki',
  'Lajpat Nagar',
  'Arya Nagar',
  'Rawatpur',
]

const APPLIANCE_TYPES = [
  'Split AC',
  'LED / Smart TV',
  'Washing Machine',
  'Refrigerator',
  'Microwave Oven',
  'RO Water Purifier',
  'Other Home Appliance',
]

export function ReviewFormClient() {
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [selectedAppliance, setSelectedAppliance] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

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
        throw new Error(data.error || 'Failed to submit review. Please try again.')
      }

      setIsSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while submitting your review.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-emerald-200/80 p-8 sm:p-10 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              Published Live Instantly
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Thank You, {name}!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your genuine review has been successfully posted. Your honest feedback helps fellow Kanpur families discover trustworthy doorstep appliance repairs!
            </p>
          </div>

          {/* Rating Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 max-w-sm mx-auto space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-500">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-500">
              {selectedAppliance ? `${selectedAppliance} repair in ${area}` : `Appliance repair in ${area}`}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#reviews"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>View All Customer Reviews</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-black/[0.08] shadow-apple-hover p-6 sm:p-10 space-y-8 relative">
        {/* Header pitch */}
        <div className="text-center space-y-2.5 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Customer Feedback Form</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Rate Your Service Experience
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Took repair service from Star Digital? Share your feedback to help fellow Kanpur residents make informed decisions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Star Rating Picker */}
          <div className="space-y-2 text-center bg-gradient-to-b from-slate-50 to-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tap Stars to Rate *
            </label>
            <div className="flex items-center justify-center gap-2.5 py-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating !== null ? hoverRating : rating) >= star
                return (
                  <button
                    type="button"
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 transition-all ${
                        active
                          ? 'text-amber-500 fill-amber-500 drop-shadow-md'
                          : 'text-slate-300 hover:text-amber-300'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-600 min-h-[20px]">
              {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aditya Verma / Sneha Dixit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all"
            />
          </div>

          {/* Kanpur Locality / Area */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Kanpur Locality / Area *</span>
              <span className="text-[11px] font-normal text-slate-400">Select chip or type below</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kakadeo, Civil Lines, Swaroop Nagar"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all"
            />
            {/* Quick area chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {KANPUR_LOCALITIES.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setArea(loc)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    area.toLowerCase() === loc.toLowerCase()
                      ? 'bg-red-600 text-white border-red-600 font-bold shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Appliance Repaired */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Appliance Repaired (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {APPLIANCE_TYPES.map((app) => (
                <button
                  type="button"
                  key={app}
                  onClick={() =>
                    setSelectedAppliance((prev) => (prev === app ? '' : app))
                  }
                  className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all ${
                    selectedAppliance === app
                      ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>

          {/* Review Experience */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Your Review &amp; Experience *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {reviewText.length}/800
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={800}
              placeholder="Describe your service experience: technician punctuality, diagnosis accuracy, repair quality, genuine spare parts, pricing transparency..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 leading-relaxed resize-none transition-all"
            />
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Genuine Kanpur Resident Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Publishes Instantly to Live Feed</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <Link
              href="/#reviews"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all text-center inline-flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Reviews</span>
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-600/25 active:scale-98 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit My Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
