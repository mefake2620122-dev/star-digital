import type { Metadata } from 'next'
import './globals.css'
import { SITE_CONFIG } from '@/lib/site'

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — Expert Appliance Repair in Kanpur`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ['appliance repair Kanpur', 'AC repair Kanpur', 'refrigerator repair Kanpur', 'STAR DIGITAL'],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  metadataBase: new URL('https://stardigital.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: SITE_CONFIG.name,
  },
}

import { WhatsAppGlobalHandler } from '@/components/WhatsAppGlobalHandler'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <WhatsAppGlobalHandler />
        {children}
      </body>
    </html>
  )
}
