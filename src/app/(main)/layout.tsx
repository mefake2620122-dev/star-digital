import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MobileStickyBar } from '@/components/MobileStickyBar'
import { getLiveContact } from '@/lib/contact'
import { ContactProvider } from '@/context/ContactContext'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const contact = await getLiveContact()

  return (
    <ContactProvider value={contact}>
      <div className="min-h-screen flex flex-col">
        <Navbar contact={contact} />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <Footer contact={contact} />
        <MobileStickyBar contact={contact} />
      </div>
    </ContactProvider>
  )
}
