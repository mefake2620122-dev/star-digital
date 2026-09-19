import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | STAR DIGITAL Kanpur',
  description: 'Privacy policy and customer data handling policies for STAR DIGITAL home appliance services in Kanpur.',
}

export default function PrivacyPage() {
  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900">Privacy Policy</span>
        </nav>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-6 text-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: September 2026</p>

          <div className="space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900">1. Information We Collect</h3>
            <p>
              When you call our helpline, contact us on WhatsApp, or submit a message, we collect essential service coordination data including your name, contact phone number, address in Kanpur, and appliance fault descriptions.
            </p>

            <h3 className="text-base font-bold text-slate-900">2. How We Use Your Information</h3>
            <p>
              Your contact and locality details are exclusively utilized to coordinate doorstep technician dispatch, schedule visits, and provide warranty records on completed repairs.
            </p>

            <h3 className="text-base font-bold text-slate-900">3. Data Sharing & Confidentiality</h3>
            <p>
              We do not sell, rent, or lease your personal information to third-party telemarketers or external marketers. Your details are accessible solely by our service dispatch desk and the technician assigned to your call.
            </p>

            <h3 className="text-base font-bold text-slate-900">4. Contacting Us</h3>
            <p>
              For questions regarding our privacy practices, please contact our Civil Lines service desk directly via phone or WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
