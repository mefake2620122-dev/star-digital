'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import {
  Camera,
  Maximize2,
  X,
  MapPin,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react'

export interface PhotoItem {
  id: string
  title: string
  caption?: string | null
  imageUrl: string
  category: string
  location?: string | null
  sortOrder?: number
  published?: boolean
  createdAt?: string | Date
}

interface PhotosGalleryClientProps {
  initialPhotos: PhotoItem[]
}

const CATEGORY_TABS = [
  { id: 'ALL', label: 'All Photos' },
  { id: 'tv', label: 'LED / Smart TV' },
  { id: 'refrigerator', label: 'Refrigerators' },
  { id: 'washing_machine', label: 'Washing Machines' },
  { id: 'ac', label: 'Air Conditioners' },
  { id: 'workshop', label: 'Workshop & Testing' },
]

export function PhotosGalleryClient({ initialPhotos }: PhotosGalleryClientProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos || [])
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

  useEffect(() => {
    if (Array.isArray(initialPhotos)) {
      setPhotos(initialPhotos)
    }
  }, [initialPhotos])

  const loadPhotos = () => {
    fetch(`/api/photos?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPhotos(data.data)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'stardigital_updated_at') loadPhotos()
    }

    let channel: BroadcastChannel | null = null
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('stardigital_sync')
        channel.onmessage = (event) => {
          if (event.data?.type === 'PHOTOS_UPDATED' || event.data?.type === 'SYNC_ALL') {
            loadPhotos()
          }
        }
      }
    } catch {}

    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', loadPhotos)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', loadPhotos)
      if (channel) channel.close()
    }
  }, [])

  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'ALL') return photos
    return photos.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase())
  }, [photos, activeCategory])

  const activeLightboxPhoto =
    selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null

  // Lightbox keyboard controls
  useEffect(() => {
    if (selectedPhotoIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhotoIndex(null)
      if (e.key === 'ArrowRight' && selectedPhotoIndex < filteredPhotos.length - 1) {
        setSelectedPhotoIndex((prev) => (prev !== null ? prev + 1 : null))
      }
      if (e.key === 'ArrowLeft' && selectedPhotoIndex > 0) {
        setSelectedPhotoIndex((prev) => (prev !== null ? prev - 1 : null))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPhotoIndex, filteredPhotos])

  const getCategoryBadgeLabel = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'ac':
        return 'Split & Window AC'
      case 'washing_machine':
        return 'Washing Machine'
      case 'refrigerator':
        return 'Refrigerator'
      case 'workshop':
        return 'Workshop PCB Lab'
      default:
        return 'Doorstep Repair'
    }
  }

  return (
    <div className="space-y-8">
      {/* Category Navigation Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id
          const count =
            tab.id === 'ALL'
              ? photos.length
              : photos.filter((p) => p.category?.toLowerCase() === tab.id.toLowerCase()).length

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-3xl border border-black/[0.06] p-12 text-center text-slate-400 space-y-3">
          <Camera className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
          <p className="text-sm font-semibold">No work photos available in this category yet.</p>
          <button
            onClick={() => setActiveCategory('ALL')}
            className="text-xs text-red-600 font-bold underline"
          >
            View all work photos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group cursor-pointer bg-white rounded-3xl border border-black/[0.06] overflow-hidden shadow-apple hover:shadow-apple-hover transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container with zoom effect */}
              <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
                    <Sparkles className="w-3 h-3 text-red-600" />
                    <span>{getCategoryBadgeLabel(photo.category)}</span>
                  </span>

                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                    aria-label="View Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Location badge at bottom left of image */}
                {photo.location && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/50 backdrop-blur-md text-white">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{photo.location}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Details */}
              <div className="p-5 sm:p-6 space-y-2">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {photo.title}
                </h3>
                {photo.caption && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {photo.caption}
                  </p>
                )}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Genuine Repair</span>
                  </span>
                  <span className="text-slate-400 group-hover:text-red-600 font-bold transition-colors flex items-center gap-0.5">
                    Enlarge Photo &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HIGH RES LIGHTBOX MODAL ── */}
      {activeLightboxPhoto && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all active:scale-95"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          {selectedPhotoIndex !== null && selectedPhotoIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhotoIndex(selectedPhotoIndex - 1)
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all active:scale-95"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {selectedPhotoIndex !== null && selectedPhotoIndex < filteredPhotos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhotoIndex(selectedPhotoIndex + 1)
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all active:scale-95"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Lightbox Content Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
          >
            {/* Image display */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[320px] max-h-[65vh]">
              <img
                src={activeLightboxPhoto.imageUrl}
                alt={activeLightboxPhoto.title}
                className="w-full h-full object-contain max-h-[65vh]"
              />
            </div>

            {/* Description Bar */}
            <div className="p-6 bg-slate-900 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white">
                    {getCategoryBadgeLabel(activeLightboxPhoto.category)}
                  </span>
                  {activeLightboxPhoto.location && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      {activeLightboxPhoto.location}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {activeLightboxPhoto.title}
                </h2>
                {activeLightboxPhoto.caption && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {activeLightboxPhoto.caption}
                  </p>
                )}
              </div>

              <div className="shrink-0 text-slate-400 text-xs font-mono">
                {selectedPhotoIndex !== null ? selectedPhotoIndex + 1 : 1} of {filteredPhotos.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
