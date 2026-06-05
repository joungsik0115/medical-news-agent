'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initial = searchParams.get('q') ?? ''
  const [value, setValue] = useState(initial)
  const [isPending, startTransition] = useTransition()

  // Keep input in sync if URL changes externally (back button, filter clear)
  useEffect(() => {
    setValue(searchParams.get('q') ?? '')
  }, [searchParams])

  // Debounced URL update
  useEffect(() => {
    const t = setTimeout(() => {
      const current = searchParams.get('q') ?? ''
      if (value === current) return
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) params.set('q', value.trim())
      else params.delete('q')
      params.delete('page')
      startTransition(() => {
        const qs = params.toString()
        router.push(qs ? `${pathname}?${qs}` : pathname)
      })
    }, 350)
    return () => clearTimeout(t)
  }, [value, pathname, router, searchParams])

  const clear = () => setValue('')

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        {isPending ? (
          <svg className="animate-spin h-4 w-4 text-[#5f6368]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        )}
      </div>

      <input
        type="search"
        placeholder="제목 검색 (예: ESG, 챗GPT, 노무, 재생의료...)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-11 pl-11 pr-11 rounded-full border border-[#dfe1e5] bg-white text-sm text-[#202124] placeholder:text-[#9aa0a6] outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/15 transition-all"
        style={{ boxShadow: '0 1px 6px rgba(32,33,36,.18)' }}
      />

      {value && (
        <button
          onClick={clear}
          className="absolute inset-y-0 right-3 my-auto h-7 w-7 flex items-center justify-center rounded-full text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
          aria-label="검색어 지우기"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  )
}
