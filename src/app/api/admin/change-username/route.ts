import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getAuthFromHeader, jsonOk, jsonError } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  const auth = getAuthFromHeader(req.headers.get('authorization'))
  if (!auth) return jsonError('Unauthorized', 'UNAUTHORIZED', 401)

  try {
    const { newUsername, currentPassword } = await req.json()

    if (!newUsername || typeof newUsername !== 'string') {
      return jsonError('New username is required', 'VALIDATION_ERROR', 400)
    }

    const cleanUsername = newUsername.trim().toLowerCase()
    if (cleanUsername.length < 3) {
      return jsonError('Username must be at least 3 characters', 'VALIDATION_ERROR', 400)
    }
    if (cleanUsername.length > 30) {
      return jsonError('Username cannot exceed 30 characters', 'VALIDATION_ERROR', 400)
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      return jsonError('Username can only contain letters, numbers, hyphens, and underscores', 'VALIDATION_ERROR', 400)
    }

    const user = await prisma.user.findUnique({ where: { id: auth.id } })
    if (!user) return jsonError('User not found', 'NOT_FOUND', 404)

    // Verify current password if provided
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isMatch) {
        return jsonError('Current password does not match', 'INVALID_PASSWORD', 400)
      }
    }

    // Check if new username is already taken by another user
    const existing = await prisma.user.findFirst({
      where: {
        username: cleanUsername,
        NOT: { id: auth.id },
      },
    })
    if (existing) {
      return jsonError('This username is already taken. Please choose another.', 'USERNAME_TAKEN', 400)
    }

    const updated = await prisma.user.update({
      where: { id: auth.id },
      data: { username: cleanUsername },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
      },
    })

    return jsonOk({
      message: 'Username updated successfully',
      user: updated,
    })
  } catch {
    return jsonError('Failed to change username', 'SERVER_ERROR', 500)
  }
}
