import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

/** GET all site content as array (for admin UI) */
export async function GET(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const content = await prisma.siteContent.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] })
    return jsonOk(content)
  } catch {
    return jsonError('Failed to fetch site content', 'SERVER_ERROR', 500)
  }
}

/** PUT — update a single key */
export async function PUT(req: NextRequest) {
  if (!getAuthFromHeader(req.headers.get('authorization')))
    return jsonError('Unauthorized', 'UNAUTHORIZED', 401)
  try {
    const { key, value } = await req.json()
    if (!key || value === undefined) return jsonError('key and value are required', 'VALIDATION_ERROR', 400)
    const updated = await prisma.siteContent.update({ where: { key }, data: { value } })
    return jsonOk(updated)
  } catch {
    return jsonError('Failed to update site content', 'SERVER_ERROR', 500)
  }
}
