import { NextRequest } from 'next/server'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import path from 'path'

export const dynamic = 'force-dynamic'

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
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/jpg']
    if (!validMimes.includes(file.type.toLowerCase())) {
      return jsonError('Invalid file type. Please upload a JPEG, PNG, WEBP, or GIF image.', 'VALIDATION_ERROR', 400)
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return jsonError('File size exceeds maximum limit of 10MB', 'VALIDATION_ERROR', 400)
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')

    // Generate safe clean filename
    const ext = path.extname(file.name) || '.jpg'
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
    const fileName = `${cleanBase}${ext}`

    // Persist permanently in Supabase PostgreSQL
    const record = await prisma.uploadedImage.create({
      data: {
        fileName,
        mimeType: file.type || 'image/jpeg',
        data: base64Data,
        size: file.size,
      },
    })

    const publicUrl = `/api/images/${record.id}`

    return jsonOk({
      url: publicUrl,
      id: record.id,
      fileName,
      size: file.size,
      mimeType: file.type,
    })
  } catch (error: any) {
    console.error('File upload failed:', error)
    return jsonError(error?.message || 'Failed to upload image', 'SERVER_ERROR', 500)
  }
}
