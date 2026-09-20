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
    const areas = await prisma.serviceArea.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
    return jsonOk(areas)
  } catch {
    return jsonError('Failed to fetch areas', 'SERVER_ERROR', 500)
  }
}

export async function POST(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const body = await req.json()
    const { name, district, pincode, estimatedArrivalMins, sortOrder, active } = body

    if (!name?.trim()) return jsonError('Locality name is required', 'VALIDATION_ERROR', 400)

    const newArea = await prisma.serviceArea.create({
      data: {
        name: name.trim(),
        district: district?.trim() || 'Kanpur',
        pincode: pincode?.trim() || null,
        estimatedArrivalMins: estimatedArrivalMins ? Number(estimatedArrivalMins) : 60,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    })

    revalidateAll()
    return jsonOk(newArea, 201)
  } catch (error) {
    console.error('Failed to create service area:', error)
    return jsonError('Failed to create service area', 'SERVER_ERROR', 500)
  }
}

export async function PUT(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const body = await req.json()
    const { id, name, district, pincode, estimatedArrivalMins, sortOrder, active } = body

    if (!id) return jsonError('Service Area ID is required', 'VALIDATION_ERROR', 400)

    const updated = await prisma.serviceArea.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(district !== undefined ? { district: district.trim() } : {}),
        ...(pincode !== undefined ? { pincode: pincode.trim() || null } : {}),
        ...(estimatedArrivalMins !== undefined ? { estimatedArrivalMins: Number(estimatedArrivalMins) } : {}),
        ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) } : {}),
        ...(active !== undefined ? { active: Boolean(active) } : {}),
      },
    })

    revalidateAll()
    return jsonOk(updated)
  } catch (error) {
    console.error('Failed to update service area:', error)
    return jsonError('Failed to update service area', 'SERVER_ERROR', 500)
  }
}
