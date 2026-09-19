import { prisma } from '@/lib/prisma'
import { Camera } from 'lucide-react'
import { PhotosGalleryClient } from '@/components/PhotosGalleryClient'

async function getPhotos() {
  try {
    const photos = await prisma.photo.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return JSON.parse(JSON.stringify(photos))
  } catch {
    return []
  }
}

export async function PhotosSection() {
  const photos = await getPhotos()

  if (!photos || photos.length === 0) return null

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-slate-50/60 border-b border-black/[0.06] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
            <Camera className="w-3.5 h-3.5 text-red-600" />
            <span>On-Site Service Gallery</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-apple-text tracking-tight">
            Real Work in Kanpur Homes
          </h2>

          <p className="text-sm sm:text-base text-apple-secondary">
            Transparent photographic proof of genuine doorstep appliance servicing, deep chemical cleaning, and component replacements across Kanpur.
          </p>
        </div>

        {/* Real-time Interactive Photos Gallery */}
        <PhotosGalleryClient initialPhotos={photos} />
      </div>
    </section>
  )
}
