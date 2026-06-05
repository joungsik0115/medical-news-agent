'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { SourceCategory } from '@/types'

const SOURCE_CATEGORIES: { value: SourceCategory; label: string }[] = [
  { value: 'global_health_org',  label: '글로벌 보건기구' },
  { value: 'global_journal',     label: '글로벌 저널' },
  { value: 'global_medical_ai',  label: '글로벌 의료AI' },
  { value: 'korea_gov',          label: '국내 공공기관' },
  { value: 'korea_medical_ai',   label: '국내 의료AI' },
  { value: 'korea_medical_news', label: '국내 의료뉴스' },
]

const TOPIC_CATEGORIES = [
  { value: 'disease',        label: '질병' },
  { value: 'medical_ai',     label: '의료AI' },
  { value: 'korea_hospital', label: '한국병원' },
  { value: 'general',        label: '일반' },
]

const LANGUAGES = [
  { value: 'en', label: '영어' },
  { value: 'ko', label: '한국어' },
]

export default function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) { params.set(key, value) } else { params.delete(key) }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const q: string = searchParams.get('q') ?? ''
  const sourceCat: string = searchParams.get('source_category') ?? ''
  const topic: string = searchParams.get('category') ?? ''
  const lang: string = searchParams.get('language') ?? ''
  const hasFilters = !!(q || sourceCat || topic || lang)

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Google-style Search Bar */}
      <div className="relative w-full max-w-xl">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input
          type="search"
          placeholder="의료 뉴스 검색..."
          value={q}
          onChange={(e) => update('q', e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-full border border-[#dfe1e5] bg-white text-sm text-[#202124] placeholder:text-[#9aa0a6] outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 transition-all"
          style={{ boxShadow: '0 1px 6px rgba(32,33,36,.28)' }}
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 items-center">

        {/* Source Category Chips */}
        <div className="flex flex-wrap gap-1.5">
          {SOURCE_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => update('source_category', sourceCat === c.value ? '' : c.value)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all ${
                sourceCat === c.value
                  ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-sm'
                  : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#dadce0] mx-1 hidden sm:block" />

        {/* Topic chips */}
        <div className="flex flex-wrap gap-1.5">
          {TOPIC_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => update('category', topic === c.value ? '' : c.value)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all ${
                topic === c.value
                  ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-sm'
                  : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Language chips */}
        <div className="flex gap-1.5">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              onClick={() => update('language', lang === l.value ? '' : l.value)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all ${
                lang === l.value
                  ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-sm'
                  : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={() => router.push(pathname)}
            className="px-3 py-1 rounded-full text-[12px] font-medium text-[#5f6368] hover:bg-[#f1f3f4] transition-colors flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            필터 초기화
          </button>
        )}
      </div>
    </div>
  )
}
