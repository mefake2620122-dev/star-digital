'use client'

import { useEffect, useState } from 'react'
import { Star, ShieldCheck } from 'lucide-react'

export function PageLoader() {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(10)
  const [statusText, setStatusText] = useState('Initializing STAR DIGITAL...')
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    setMounted(true)

    // Stage 1: Fast initial progress
    const t1 = setTimeout(() => {
      setProgress(45)
      setStatusText('Connecting to Kanpur Service Network...')
    }, 150)

    // Stage 2: Near completion
    const t2 = setTimeout(() => {
      setProgress(85)
      setStatusText('Loading Certified Technicians & Rates...')
    }, 450)

    // Stage 3: Complete
    const t3 = setTimeout(() => {
      setProgress(100)
      setStatusText('Welcome to STAR DIGITAL')
      setIsFadingOut(true)
    }, 750)

    // Stage 4: Unmount completely from DOM
    const t4 = setTimeout(() => {
      setShouldRender(false)
    }, 1250)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [])

  if (!shouldRender) return null

  return (
    <div
      aria-hidden={isFadingOut}
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-slate-950 text-white select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105 backdrop-blur-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/40 relative z-10 border border-white/20">
            <Star className="w-8 h-8 fill-current text-white animate-pulse" />
          </div>

          {/* Pulse Ripple Rings */}
          <div className="absolute inset-0 rounded-2xl bg-red-500/30 animate-ping pointer-events-none -z-0 opacity-40" />
          <div className="absolute -inset-1.5 rounded-3xl bg-white/5 border border-white/10 pointer-events-none" />
        </div>

        {/* Brand Name & Location */}
        <div className="space-y-1 mb-8">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>STAR DIGITAL</span>
          </h1>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            <span>Kanpur Doorstep Care</span>
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3 inline" /> Verified
            </span>
          </div>
        </div>

        {/* Apple-style thin sleek progress line */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden p-0 relative mb-4">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-red-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text */}
        <p className="text-xs font-medium text-slate-400 h-4 transition-opacity duration-200">
          {statusText}
        </p>
      </div>

      {/* Footer subtle brand tag */}
      <div className="absolute bottom-8 text-center">
        <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
          Est. 2012 &bull; Fast &bull; Guaranteed
        </p>
      </div>
    </div>
  )
}
