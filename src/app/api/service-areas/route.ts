import { prisma } from '@/lib/prisma'
import { jsonOk, jsonError } from '@/lib/auth'

export async function GET() {
  try {
    const areas = await prisma.serviceArea.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    })
    return jsonOk(areas)
  } catch {
    return jsonError('Failed to fetch service areas', 'SERVER_ERROR', 500)
  }
}
