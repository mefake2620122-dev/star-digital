import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'
import { revalidateAll } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const { name, district, estimatedArrivalMins, active, pincode, sortOrder } = await req.json()
    const updated = await prisma.serviceArea.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(district !== undefined ? { district: district.trim() } : {}),
        ...(estimatedArrivalMins !== undefined
          ? { estimatedArrivalMins: Number(estimatedArrivalMins) }
          : {}),
        ...(active !== undefined ? { active: Boolean(active) } : {}),
        ...(pincode !== undefined ? { pincode: pincode?.trim() || null } : {}),
        ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) } : {}),
      },
    })
    revalidateAll()
    return jsonOk(updated)
  } catch {
    return jsonError('Failed to update service area', 'SERVER_ERROR', 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    await prisma.serviceArea.delete({
      where: { id: params.id },
    })
    revalidateAll()
    return jsonOk({ message: 'Service area deleted successfully' })
  } catch (error) {
    console.error('Failed to delete service area:', error)
    return jsonError('Failed to delete service area', 'SERVER_ERROR', 500)
  }
}
