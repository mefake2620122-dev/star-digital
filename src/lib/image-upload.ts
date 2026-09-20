/**
 * Client-side image compression and upload utility
 * Automatically downscales phone camera photos (5MB - 10MB) to fast, optimized web images (~100KB - 200KB)
 * and uploads to Supabase-backed persistent storage.
 */

export async function compressImage(
  file: File,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.82
): Promise<File> {
  // If SVG or animated GIF, keep original to preserve vectors/animation
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }

  return new Promise((resolve) => {
    // Fallback if running in an environment without FileReader/Image
    if (typeof window === 'undefined' || !window.FileReader) {
      return resolve(file)
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate aspect-preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return resolve(file)
        }

        // Apply smoother image rendering
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file)

            const safeName = file.name.replace(/\.[^.]+$/, '.jpg')
            const compressed = new File([blob], safeName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })

            // If compressed is somehow larger than original, return original
            if (compressed.size > file.size) {
              return resolve(file)
            }

            resolve(compressed)
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => resolve(file)
    }

    reader.onerror = () => resolve(file)
  })
}

export async function uploadImageFile(
  file: File,
  token?: string | null
): Promise<{ url: string; id: string; fileName: string; size: number }> {
  // 1. Compress image in browser before uploading
  const optimizedFile = await compressImage(file)

  // 2. Prepare FormData
  const formData = new FormData()
  formData.append('file', optimizedFile)

  // 3. Post to upload API
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers,
    body: formData,
  })

  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to upload image')
  }

  return json.data
}
