import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonOk, jsonError } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: params.slug },
      include: {
        categories: { where: { active: true }, orderBy: { sortOrder: 'asc' } },
        issues: { where: { active: true }, orderBy: { sortOrder: 'asc' } },
        faqs: { where: { published: true }, orderBy: { sortOrder: 'asc' } },
      },
    })
    if (!service) return jsonError('Service not found', 'NOT_FOUND', 404)
    return jsonOk(service)
  } catch {
    return jsonError('Failed to fetch service', 'SERVER_ERROR', 500)
  }
}
