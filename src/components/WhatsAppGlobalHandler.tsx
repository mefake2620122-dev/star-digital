'use client'

import { useEffect } from 'react'

/**
 * Universal WhatsApp click interceptor:
 * - On Mobile (Android / iOS): Opens native WhatsApp app directly via whatsapp:// URI scheme.
 *   This avoids the api.whatsapp.com bounce / redirect loop in mobile Chrome.
 * - On Desktop: Opens https://web.whatsapp.com/send in a new tab for seamless desktop chatting.
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

      // Prevent standard browser navigation to avoid redirect bounce on mobile
      e.preventDefault()

      let phone = '919035085031'
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

      // Ensure 91 country code
      phone = phone.replace(/[^0-9]/g, '')
      if (phone.length === 10) phone = '91' + phone
      else if (phone.length === 11 && phone.startsWith('0')) phone = '91' + phone.slice(1)
      if (!phone) phone = '919035085031'

      const encodedText = encodeURIComponent(text)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )

      if (isMobile) {
        // Direct native application protocol dispatch
        window.location.href = `whatsapp://send?phone=${phone}&text=${encodedText}`
      } else {
        // Desktop Web WhatsApp in new tab
        window.open(
          `https://web.whatsapp.com/send?phone=${phone}&text=${encodedText}`,
          '_blank',
          'noopener,noreferrer'
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
