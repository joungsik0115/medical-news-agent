'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { SourceCategory } from '@/types'

const SOURCE_CATEGORIES: { value: SourceCategory; label: string }[] = [
  { value: 'global_health_org', label: '글로벌 보건기구' },
  { value: 'global_journal', label: '글로벌 저널' },
  { value: 'global_medical_ai', label: '글로벌 의료AI' },
  { value: 'korea_gov', label: '국내 공공기관' },
  { value: 'korea_medical_ai', label: '국내 의료AI' },
  { value: 'korea_medical_news', label: '국내 의료뉴스' },
]

const TOPIC_CATEGORIES = [
  { value: 'disease', label: '질병' },
  { value: 'medical_ai', label: '의료 AI' },
  { value: 'korea_hospital', label: '한국 병원' },
  { value: 'general', label: '일반' },
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
    <div className="flex flex-wrap gap-2 items-center">
      <Input
        type="search"
        placeholder="제목 검색..."
        value={q}
        onChange={(e) => update('q', e.target.value)}
        className="w-44 h-9 text-sm"
      />

      <Select
        value={sourceCat || 'all'}
        onValueChange={(v: string | null) => update('source_category', !v || v === 'all' ? '' : v)}
      >
        <SelectTrigger className="w-40 h-9 text-sm">
          <SelectValue placeholder="소스 카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 소스</SelectItem>
          {SOURCE_CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={topic || 'all'}
        onValueChange={(v: string | null) => update('category', !v || v === 'all' ? '' : v)}
      >
        <SelectTrigger className="w-36 h-9 text-sm">
          <SelectValue placeholder="토픽" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 토픽</SelectItem>
          {TOPIC_CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={lang || 'all'}
        onValueChange={(v: string | null) => update('language', !v || v === 'all' ? '' : v)}
      >
        <SelectTrigger className="w-28 h-9 text-sm">
          <SelectValue placeholder="언어" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          {LANGUAGES.map((l) => (
            <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 text-muted-foreground"
          onClick={() => router.push(pathname)}
        >
          초기화 ✕
        </Button>
      )}
    </div>
  )
}
