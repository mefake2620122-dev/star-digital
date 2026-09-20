import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return new NextResponse('Image ID is required', { status: 400 })
    }

    const image = await prisma.uploadedImage.findUnique({
      where: { id },
      select: {
        mimeType: true,
        data: true,
        fileName: true,
      },
    })

    if (!image) {
      return new NextResponse('Image not found', { status: 404 })
    }

    const buffer = Buffer.from(image.data, 'base64')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': image.mimeType || 'image/jpeg',
        'Content-Length': buffer.length.toString(),
        // Enable strong edge CDN & browser caching for high performance
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Failed to serve image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
