import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'
import { revalidateAll } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const body = await req.json()
    const {
      name,
      categoryId,
      category,
      priceRange,
      serviceTime,
      description,
      features,
      popular,
      active,
      sortOrder,
    } = body

    const dataToUpdate: any = {}

    if (name !== undefined) dataToUpdate.name = name.trim()
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId.trim()
    if (category !== undefined) dataToUpdate.category = category.trim()
    if (priceRange !== undefined) dataToUpdate.priceRange = priceRange.trim()
    if (serviceTime !== undefined) dataToUpdate.serviceTime = serviceTime.trim()
    if (description !== undefined) dataToUpdate.description = description.trim()
    if (popular !== undefined) dataToUpdate.popular = Boolean(popular)
    if (active !== undefined) dataToUpdate.active = Boolean(active)
    if (sortOrder !== undefined) dataToUpdate.sortOrder = Number(sortOrder)

    if (features !== undefined) {
      if (Array.isArray(features)) {
        dataToUpdate.features = JSON.stringify(features.filter(Boolean))
      } else if (typeof features === 'string') {
        try {
          const parsed = JSON.parse(features)
          dataToUpdate.features = Array.isArray(parsed) ? JSON.stringify(parsed) : JSON.stringify([features])
        } catch {
          dataToUpdate.features = JSON.stringify(
            features
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
      }
    }

    const updated = await prisma.pricingItem.update({
      where: { id: params.id },
      data: dataToUpdate,
    })

    revalidateAll()
    return jsonOk(updated)
  } catch (error) {
    console.error('Failed to update pricing item:', error)
    return jsonError('Failed to update pricing item', 'SERVER_ERROR', 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    await prisma.pricingItem.delete({
      where: { id: params.id },
    })

    revalidateAll()
    return jsonOk({ message: 'Pricing item deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      revalidateAll()
      return jsonOk({ message: 'Pricing item deleted successfully' })
    }
    console.error('Failed to delete pricing item:', error)
    return jsonError('Failed to delete pricing item', 'SERVER_ERROR', 500)
  }
}
