import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const items = await prisma.pricingItem.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error('Failed to fetch pricing items:', error)
    return NextResponse.json({ success: false, data: [], error: 'Failed to fetch pricing' }, { status: 500 })
  }
}
