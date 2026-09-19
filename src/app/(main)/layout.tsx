import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MobileStickyBar } from '@/components/MobileStickyBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <Footer />
      <MobileStickyBar />
    </div>
  )
}
