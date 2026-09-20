import { prisma } from '@/lib/prisma'
import { jsonOk, jsonError } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const items = await prisma.pricingItem.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return jsonOk(items)
  } catch (error) {
    console.error('Failed to fetch pricing items:', error)
    return jsonError('Failed to fetch pricing', 'SERVER_ERROR', 500)
  }
}
