'use client'

import { useState } from 'react'
import { HelpCircle, CheckCircle2, MessageSquare } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/site'

const commonProblems = [
  {
    id: 'ac-cooling',
    label: 'AC not cooling / blowing normal air',
    appliance: 'ac',
    problem: 'AC not cooling / Low cooling',
  },
  {
    id: 'fridge-cooling',
    label: 'Fridge not cooling or ice melting',
    appliance: 'refrigerator',
    problem: 'Fridge not cooling at all',
  },
  {
    id: 'wm-spinning',
    label: 'Washing machine not spinning or draining',
    appliance: 'washing-machine',
    problem: 'Washing machine not spinning / Drum stuck',
  },
  {
    id: 'tv-blank',
    label: 'TV screen blank / Sound but no picture',
    appliance: 'led-lcd-tv',
    problem: 'Sound working but screen is black / No display',
  },
  {
    id: 'cctv-offline',
    label: 'CCTV cameras offline or not recording',
    appliance: 'cctv',
    problem: 'Camera showing "No Video" / Blank channel',
  },
  {
    id: 'ac-water',
    label: 'AC leaking water inside room',
    appliance: 'ac',
    problem: 'Water leakage / Dripping inside',
  },
]

export function QuickHelpSection() {
  const [selectedId, setSelectedId] = useState(commonProblems[0].id)

  const handleGetHelp = () => {
    const selected = commonProblems.find((p) => p.id === selectedId)
    if (selected) {
      const url = getWhatsAppUrl(
        `Hello STAR DIGITAL, I have an appliance issue in Kanpur: "${selected.label}". Please share technician availability.`
      )
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-star-50 border border-star-100 text-star-700 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-star-600" />
            <span>Fast Problem Diagnosis</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-apple-text tracking-tight">
            What Seems To Be The Problem?
          </h2>

          <p className="text-sm sm:text-base text-apple-secondary">
            You don&apos;t need to know technical parts or terminology. Select the symptom you are
            observing, and we will dispatch the right tools and technician.
          </p>
        </div>

        {/* Symptom Selector */}
        <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {commonProblems.map((item) => {
            const isSelected = selectedId === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                type="button"
                className={`flex items-center justify-between text-left p-4 rounded-apple border transition-all ${
                  isSelected
                    ? 'border-star-600 bg-star-50/50 shadow-apple-card ring-1 ring-star-600'
                    : 'border-black/10 bg-apple-canvas hover:bg-white hover:border-black/20'
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isSelected ? 'text-star-900 font-semibold' : 'text-apple-text'
                  }`}
                >
                  {item.label}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-star-600 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4 fill-current" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <button
            onClick={handleGetHelp}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-apple bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base active:scale-[0.98] transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Chat With Technician On WhatsApp</span>
          </button>
          <p className="text-xs text-apple-secondary mt-2.5">
            Opens direct WhatsApp conversation with your selected problem pre-filled.
          </p>
        </div>
      </div>
    </section>
  )
}
