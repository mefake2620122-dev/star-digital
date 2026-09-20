import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'star-digital-super-secret-key-kanpur-2026'

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ [SECURITY WARNING]: JWT_SECRET is not explicitly defined in production environment variables!')
}

export interface JWTPayload {
  id: string
  email: string
  role: string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

/**
 * Extract and verify JWT from Authorization header value.
 * Returns decoded payload or null.
 */
export function getAuthFromHeader(authHeader: string | null): JWTPayload | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  return verifyToken(token)
}

/**
 * JSON response helpers with strict no-store headers
 */
const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
}

export function jsonOk<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status, headers: noCacheHeaders })
}

export function jsonError(message: string, code = 'ERROR', status = 400) {
  return Response.json({ success: false, error: message, code }, { status, headers: noCacheHeaders })
}

