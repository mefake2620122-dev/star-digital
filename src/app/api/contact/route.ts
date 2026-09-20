import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsonOk, jsonError } from '@/lib/auth'
import { normalizePhoneNumber } from '@/lib/phone-normalizer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, service, message } = body

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return jsonError('Name, phone, and message are required', 'VALIDATION_ERROR', 400)
    }

    const norm = normalizePhoneNumber(phone)
    if (!norm.isValid) {
      return jsonError('Please enter a valid 10-digit mobile number (e.g. 98390 12345)', 'VALIDATION_ERROR', 400)
    }

    const msg = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        phone: norm.display,
        email: email?.trim() || null,
        service: service?.trim() || null,
        message: message.trim(),
        status: 'NEW',
      },
    })

    return Response.json(
      {
        success: true,
        data: { id: msg.id, name: msg.name, createdAt: msg.createdAt },
        message: 'Your message has been received. We will call you back shortly.',
      },
      { status: 201 }
    )
  } catch {
    return jsonError('Failed to submit contact message', 'SERVER_ERROR', 500)
  }
}
