import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const items = await prisma.pricingItem.findMany({
      orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return jsonOk(items)
  } catch (error) {
    console.error('Failed to fetch admin pricing:', error)
    return jsonError('Failed to fetch pricing items', 'SERVER_ERROR', 500)
  }
}

export async function POST(req: NextRequest) {
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

    if (!name?.trim() || !priceRange?.trim()) {
      return jsonError('Service Name and Price Range are required', 'VALIDATION_ERROR', 400)
    }

    // Default category label mapping if not provided
    const categoryMap: Record<string, string> = {
      tv: 'LED / Smart TV',
      refrigerator: 'Refrigerator',
      'washing-machine': 'Washing Machine',
      ac: 'Air Conditioner (AC)',
      others: 'Microwave & Other Appliances',
    }

    const catId = categoryId?.trim() || 'tv'
    const catName = category?.trim() || categoryMap[catId] || 'Other Services'

    // Format features as JSON string
    let formattedFeatures = '[]'
    if (Array.isArray(features)) {
      formattedFeatures = JSON.stringify(features.filter(Boolean))
    } else if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features)
        formattedFeatures = Array.isArray(parsed) ? JSON.stringify(parsed) : JSON.stringify([features])
      } catch {
        formattedFeatures = JSON.stringify(
          features
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        )
      }
    }

    const newItem = await prisma.pricingItem.create({
      data: {
        name: name.trim(),
        categoryId: catId,
        category: catName,
        priceRange: priceRange.trim(),
        serviceTime: serviceTime?.trim() || 'Same Day',
        description: description?.trim() || '',
        features: formattedFeatures,
        popular: Boolean(popular),
        active: active !== undefined ? Boolean(active) : true,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
      },
    })

    return jsonOk(newItem, 201)
  } catch (error) {
    console.error('Failed to create pricing item:', error)
    return jsonError('Failed to create pricing item', 'SERVER_ERROR', 500)
  }
}
