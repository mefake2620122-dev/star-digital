import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | STAR DIGITAL Kanpur',
  description: 'Terms and conditions for doorstep appliance repairs and servicing across Kanpur by STAR DIGITAL.',
}

export default function TermsPage() {
  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900">Terms of Service</span>
        </nav>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-6 text-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Terms of Service</h1>
          <p className="text-xs text-slate-400">Last updated: September 2026</p>

          <div className="space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900">1. Service Scope</h3>
            <p>
              STAR DIGITAL provides on-site diagnostic, maintenance, and repair services for domestic and commercial appliances across Kanpur. All service visits require customer confirmation before technician dispatch.
            </p>

            <h3 className="text-base font-bold text-slate-900">2. Transparent Estimates & Approvals</h3>
            <p>
              Diagnostic findings and transparent cost estimates for labor and spare parts are communicated to the customer prior to any replacement or extensive repair work. No unapproved repairs are initiated.
            </p>

            <h3 className="text-base font-bold text-slate-900">3. Warranty Policy</h3>
            <p>
              Repairs performed and replacement components supplied by Star Digital carry a standard 30-day service warranty against the specific malfunction addressed, subject to normal electrical supply and operating conditions.
            </p>

            <h3 className="text-base font-bold text-slate-900">4. Payment Terms</h3>
            <p>
              Payment is due upon completion and verification of the repair. We accept UPI (Google Pay, PhonePe, Paytm), cash, and direct bank transfers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
