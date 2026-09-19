'use client'

import React, { createContext, useContext } from 'react'
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
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
}

export function useBusinessContact(): ContactInfo {
  return useContext(ContactContext)
}
