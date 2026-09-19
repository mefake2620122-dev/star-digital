import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword)
      return jsonError('Both passwords are required', 'VALIDATION_ERROR', 400)
    if (newPassword.length < 6)
      return jsonError('New password must be at least 6 characters', 'VALIDATION_ERROR', 400)

    const user = await prisma.user.findUnique({ where: { id: auth.id } })
    if (!user) return jsonError('User not found', 'NOT_FOUND', 404)

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isMatch) return jsonError('Current password does not match', 'INVALID_PASSWORD', 400)

    const newHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: auth.id }, data: { passwordHash: newHash } })

    return jsonOk({ message: 'Password updated successfully' })
  } catch {
    return jsonError('Failed to change password', 'SERVER_ERROR', 500)
  }
}
