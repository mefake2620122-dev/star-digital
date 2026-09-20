'use client'

import { useEffect } from 'react'
import { formatWhatsAppNumber } from '@/lib/phone-normalizer'

/**
 * Universal WhatsApp click interceptor:
 * - On Mobile (Android / iOS): Opens native WhatsApp app directly via whatsapp:// URI scheme.
 * - On Desktop / Laptop: Ensures official https://api.whatsapp.com/send gateway opens smoothly
 *   in a new tab (allows both WhatsApp Web and WhatsApp Desktop app without popup blocking).
 */
export function WhatsAppGlobalHandler() {
  useEffect(() => {
    function handleAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      const isWhatsApp =
        href.startsWith('whatsapp://') ||
        href.includes('wa.me') ||
        href.includes('api.whatsapp.com') ||
        href.includes('web.whatsapp.com')

      if (!isWhatsApp) return

      let phone = '919005888922'
      let text = 'Hello STAR DIGITAL, I need doorstep appliance repair service in Kanpur.'

      try {
        if (href.startsWith('http')) {
          const url = new URL(href, window.location.origin)
          const p = url.searchParams.get('phone')
          const t = url.searchParams.get('text')
          if (p) phone = p
          if (t) text = t
          if (!p && url.pathname) {
            const digits = url.pathname.replace(/[^0-9]/g, '')
            if (digits) phone = digits
          }
        } else if (href.startsWith('whatsapp://')) {
          const queryStr = href.split('?')[1] || ''
          const params = new URLSearchParams(queryStr)
          const p = params.get('phone')
          const t = params.get('text')
          if (p) phone = p
          if (t) text = t
        }
      } catch {
        const phoneMatch = href.match(/phone=(\d+)/) || href.match(/wa\.me\/(\d+)/)
        if (phoneMatch) phone = phoneMatch[1]
        const textMatch = href.match(/text=([^&]+)/)
        if (textMatch) text = decodeURIComponent(textMatch[1])
      }

      // Universal phone normalization (clean 91XXXXXXXXXX)
      const cleanPhone = formatWhatsAppNumber(phone)
      const encodedText = encodeURIComponent(text)

      const isMobile =
        typeof navigator !== 'undefined' &&
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile) {
        // Direct native application protocol dispatch on mobile
        e.preventDefault()
        window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`
      } else {
        // On Desktop / Laptop:
        // Set standard attributes and allow native browser link navigation to official API gateway
        target.setAttribute('target', '_blank')
        target.setAttribute('rel', 'noopener noreferrer')
        target.setAttribute(
          'href',
          `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodedText}`
        )
      }
    }

    document.addEventListener('click', handleAnchorClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true })
    }
  }, [])

  return null
}
