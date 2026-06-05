'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { CATEGORY_META } from '@/lib/crawlers/sources'
import type { SourceCategory } from '@/types'

const TOPICS: { id: SourceCategory; short: string }[] = [
  { id: 'medical_ai',             short: '의료AI' },
  { id: 'hospital_ai',            short: '병원AI' },
  { id: 'hospital_management',    short: '경영혁신' },
  { id: 'our_hospitals',          short: '우리병원' },
  { id: 'regenerative_medicine',  short: '재생의료' },
  { id: 'hr_labor',               short: '인사노무' },
]

// All possible chip backgrounds (kept here so Tailwind sees them and includes them)
const ACTIVE_BG: Record<SourceCategory, string> = {
  medical_ai:             'bg-blue-600 text-white border-transparent shadow-md',
  hospital_ai:            'bg-indigo-600 text-white border-transparent shadow-md',
  hospital_management:    'bg-violet-600 text-white border-transparent shadow-md',
  our_hospitals:          'bg-rose-600 text-white border-transparent shadow-md',
  regenerative_medicine:  'bg-teal-600 text-white border-transparent shadow-md',
  hr_labor:               'bg-amber-600 text-white border-transparent shadow-md',
}

export default function TopicTabs({ counts }: { counts: Record<string, number> }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('topic') ?? ''

  const setTopic = (topic: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (topic && topic !== active) {
      params.set('topic', topic)
    } else {
      params.delete('topic')
    }
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">

      <button
        onClick={() => setTopic('')}
        className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold border transition-all whitespace-nowrap ${
          !active
            ? 'bg-[#202124] text-white border-transparent shadow-md'
            : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
        }`}
      >
        전체
        <span className={`text-[11px] font-bold ${!active ? 'opacity-80' : 'text-[#9aa0a6]'}`}>
          {totalAll}
        </span>
      </button>

      {TOPICS.map(({ id, short }) => {
        const meta = CATEGORY_META[id]
        const count = counts[id] ?? 0
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => setTopic(id)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold border transition-all whitespace-nowrap ${
              isActive
                ? ACTIVE_BG[id]
                : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
            }`}
          >
            <span>{meta.emoji}</span>
            <span>{short}</span>
            <span className={`text-[11px] font-bold ${isActive ? 'opacity-80' : 'text-[#9aa0a6]'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
