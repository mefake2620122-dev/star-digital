import { prisma } from '@/lib/prisma'
import { jsonOk, jsonError } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const content = await prisma.siteContent.findMany({ orderBy: { group: 'asc' } })
    // Return as a key→value map for easy client use
    const map: Record<string, string> = {}
    content.forEach((c) => { map[c.key] = c.value })
    return jsonOk(map)
  } catch {
    return jsonError('Failed to fetch site content', 'SERVER_ERROR', 500)
  }
}
