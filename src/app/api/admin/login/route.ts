import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, jsonOk, jsonError } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username?.trim() || !password) {
      return jsonError('Username and password are required', 'VALIDATION_ERROR', 400)
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username.trim().toLowerCase() },
          { email: username.trim().toLowerCase() },
        ],
      },
    })

    if (!user) {
      // timing-safe: always hash even on miss
      await bcrypt.hash('dummy', 10)
      return jsonError('Invalid username or password', 'INVALID_CREDENTIALS', 401)
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return jsonError('Invalid username or password', 'INVALID_CREDENTIALS', 401)
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role })

    // Never leak passwordHash
    return jsonOk({
      token,
      user: { id: user.id, name: user.name, email: user.email, username: user.username, role: user.role },
    })
  } catch {
    return jsonError('Authentication failed', 'SERVER_ERROR', 500)
  }
}
