import { NextRequest } from 'next/server'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'

export async function POST(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return jsonError('No file provided', 'VALIDATION_ERROR', 400)
    }

    // Validate type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!validMimes.includes(file.type)) {
      return jsonError('Invalid file type. Please upload a JPEG, PNG, WEBP, or GIF image.', 'VALIDATION_ERROR', 400)
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return jsonError('File size exceeds maximum limit of 10MB', 'VALIDATION_ERROR', 400)
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate safe unique filename
    const ext = path.extname(file.name) || '.jpg'
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
    const fileName = `${Date.now()}-${cleanBase}${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'photos')
    await fs.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, fileName)
    await fs.writeFile(filePath, buffer)

    const publicUrl = `/uploads/photos/${fileName}`

    return jsonOk({
      url: publicUrl,
      fileName,
      size: file.size,
      mimeType: file.type,
    })
  } catch (error) {
    console.error('File upload failed:', error)
    return jsonError('Failed to upload file', 'SERVER_ERROR', 500)
  }
}
