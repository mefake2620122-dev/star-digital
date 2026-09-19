import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const { name, estimatedArrivalMins, active, pincode } = await req.json()
    const updated = await prisma.serviceArea.update({
      where: { id: params.id },
      data: {
        ...(name ? { name } : {}),
        ...(estimatedArrivalMins !== undefined
          ? { estimatedArrivalMins: Number(estimatedArrivalMins) }
          : {}),
        ...(active !== undefined ? { active } : {}),
        ...(pincode !== undefined ? { pincode } : {}),
      },
    })
    return jsonOk(updated)
  } catch {
    return jsonError('Failed to update service area', 'SERVER_ERROR', 500)
  }
}
