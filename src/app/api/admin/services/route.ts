import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'
import { revalidateAll } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const services = await prisma.service.findMany({
      include: { categories: true, issues: true },
      orderBy: { sortOrder: 'asc' },
    })
    return jsonOk(services)
  } catch {
    return jsonError('Failed to fetch services', 'SERVER_ERROR', 500)
  }
}

export async function POST(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const body = await req.json()
    const { name, slug, tagline, shortDesc, description, icon, image, sortOrder, active } = body

    if (!name?.trim()) return jsonError('Service name is required', 'VALIDATION_ERROR', 400)

    const finalSlug = (slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    
    // Check if slug already exists
    const existing = await prisma.service.findUnique({ where: { slug: finalSlug } })
    if (existing) {
      return jsonError(`Service slug "${finalSlug}" already exists`, 'DUPLICATE_SLUG', 400)
    }

    const newService = await prisma.service.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        tagline: tagline?.trim() || `Professional ${name} repair in Kanpur`,
        shortDesc: shortDesc?.trim() || `Certified doorstep repair and servicing for ${name} in Kanpur.`,
        description: description?.trim() || `STAR DIGITAL provides certified doorstep repair and maintenance for ${name} across Kanpur with transparent pricing and warranty.`,
        icon: icon?.trim() || 'Wrench',
        image: image?.trim() || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    })

    revalidateAll()
    return jsonOk(newService, 201)
  } catch (error) {
    console.error('Error creating service:', error)
    return jsonError('Failed to create service', 'SERVER_ERROR', 500)
  }
}

export async function PUT(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const body = await req.json()
    const { id, name, slug, tagline, shortDesc, description, icon, image, sortOrder, active } = body

    if (!id) return jsonError('Service ID is required', 'VALIDATION_ERROR', 400)

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(slug !== undefined ? { slug: slug.trim() } : {}),
        ...(tagline !== undefined ? { tagline: tagline.trim() } : {}),
        ...(shortDesc !== undefined ? { shortDesc: shortDesc.trim() } : {}),
        ...(description !== undefined ? { description: description.trim() } : {}),
        ...(icon !== undefined ? { icon: icon.trim() } : {}),
        ...(image !== undefined ? { image: image.trim() } : {}),
        ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) } : {}),
        ...(active !== undefined ? { active: Boolean(active) } : {}),
      },
    })

    revalidateAll()
    return jsonOk(updated)
  } catch (error) {
    console.error('Error updating service:', error)
    return jsonError('Failed to update service', 'SERVER_ERROR', 500)
  }
}
