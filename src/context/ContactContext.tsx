'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ContactInfo } from '@/lib/contact'
import { SITE_CONFIG } from '@/lib/site'

const defaultContact: ContactInfo = {
  phone: SITE_CONFIG.phone,
  whatsapp: SITE_CONFIG.whatsapp,
  secondaryPhone: SITE_CONFIG.secondaryPhone,
  email: SITE_CONFIG.email,
  address: SITE_CONFIG.address,
}

const ContactContext = createContext<ContactInfo>(defaultContact)

export function ContactProvider({
  value,
  children,
}: {
  value: ContactInfo
  children: React.ReactNode
}) {
  const [contact, setContact] = useState<ContactInfo>(value || defaultContact)

  // Keep state updated if server value changes
  useEffect(() => {
    if (value) setContact(value)
  }, [value])

  const refreshContact = useCallback(async () => {
    try {
      const res = await fetch('/api/business/contact', { cache: 'no-store' })
      if (!res.ok) return
      const json = await res.json()
      if (json?.success && json?.data) {
        setContact({
          phone: json.data.phone || SITE_CONFIG.phone,
          whatsapp: json.data.whatsapp || SITE_CONFIG.whatsapp,
          secondaryPhone: json.data.secondaryPhone || SITE_CONFIG.secondaryPhone,
          email: json.data.email || SITE_CONFIG.email,
          address: json.data.address || SITE_CONFIG.address,
        })
      }
    } catch {}
  }, [])

  // Silent sync across tabs and window focus
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Storage event listener for cross-tab updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'stardigital_updated_at') {
        refreshContact()
      }
    }

    // BroadcastChannel listener
    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel('stardigital_sync')
      channel.onmessage = () => {
        refreshContact()
      }
    } catch {}

    // Focus & visibility change listener
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshContact()
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', refreshContact)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', refreshContact)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (channel) channel.close()
    }
  }, [refreshContact])

  return <ContactContext.Provider value={contact}>{children}</ContactContext.Provider>
}

export function useBusinessContact(): ContactInfo {
  return useContext(ContactContext)
}
