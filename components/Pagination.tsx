'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const btnBase = 'min-w-[40px] h-10 px-3 rounded-full text-sm font-medium transition-all'
  const btnActive = 'bg-[#1a73e8] text-white shadow-sm'
  const btnDefault = 'text-[#1a73e8] hover:bg-[#f1f3f4]'
  const btnDisabled = 'text-[#9aa0a6] cursor-not-allowed'

  return (
    <div className="flex items-center justify-center gap-1 mt-10 pb-4">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnDefault} flex items-center gap-1`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        이전
      </button>

      {start > 1 && (
        <>
          <button onClick={() => goTo(1)} className={`${btnBase} ${btnDefault}`}>1</button>
          {start > 2 && <span className="px-2 text-[#5f6368]">⋯</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`${btnBase} ${p === currentPage ? btnActive : btnDefault}`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-[#5f6368]">⋯</span>}
          <button onClick={() => goTo(totalPages)} className={`${btnBase} ${btnDefault}`}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnDefault} flex items-center gap-1`}
      >
        다음
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  )
}
