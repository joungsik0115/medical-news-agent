'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

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
  }

  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => goTo(currentPage - 1)}>
        ← 이전
      </Button>
      {start > 1 && <Button variant="ghost" size="sm" onClick={() => goTo(1)}>1</Button>}
      {start > 2 && <span className="px-1 text-muted-foreground">…</span>}
      {pages.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === currentPage ? 'default' : 'outline'}
          onClick={() => goTo(p)}
        >
          {p}
        </Button>
      ))}
      {end < totalPages - 1 && <span className="px-1 text-muted-foreground">…</span>}
      {end < totalPages && <Button variant="ghost" size="sm" onClick={() => goTo(totalPages)}>{totalPages}</Button>}
      <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => goTo(currentPage + 1)}>
        다음 →
      </Button>
    </div>
  )
}
