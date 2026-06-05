'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { CATEGORY_META } from '@/lib/crawlers/sources'
import type { SourceCategory } from '@/types'

const TOPICS: SourceCategory[] = [
  'medical_ai',
  'hospital_ai',
  'hospital_management',
  'our_hospitals',
  'regenerative_medicine',
  'hr_labor',
]

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

  return (
    <div className="-mx-4 sm:mx-0 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-4 sm:px-0 pb-1 min-w-max sm:flex-wrap sm:justify-center">

        <button
          onClick={() => setTopic('')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
            !active
              ? 'bg-[#202124] text-white border-[#202124] shadow-md'
              : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
          }`}
        >
          전체
          <span className={`text-[11px] font-bold ${!active ? 'opacity-80' : 'text-[#9aa0a6]'}`}>
            {Object.values(counts).reduce((a, b) => a + b, 0)}
          </span>
        </button>

        {TOPICS.map((topic) => {
          const meta = CATEGORY_META[topic]
          const count = counts[topic] ?? 0
          const isActive = active === topic
          return (
            <button
              key={topic}
              onClick={() => setTopic(topic)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
                isActive
                  ? `${meta.chip} text-white border-transparent shadow-md`
                  : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
              }`}
            >
              <span>{meta.emoji}</span>
              <span>{meta.label}</span>
              <span className={`text-[11px] font-bold ${isActive ? 'opacity-80' : 'text-[#9aa0a6]'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
