'use client'

import { CATEGORY_META } from '@/lib/crawlers/sources'
import type { NewsArticle } from '@/types'

function formatDate(d: string | null) {
  if (!d) return ''
  const date = new Date(d)
  const now = new Date()
  const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000)
  if (diffH < 1) return '방금'
  if (diffH < 24) return `${diffH}시간 전`
  if (diffH < 48) return '어제'
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `${diffD}일 전`
  return date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
}

function cleanTitle(title: string) {
  // Strip trailing " - source name" pattern from Google News titles
  return title.replace(/\s*-\s*[^-]+$/, '').trim() || title
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  const meta = CATEGORY_META[article.source_category]
  const cleanedTitle = cleanTitle(article.title)

  return (
    <a
      href={article.original_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-xl border border-[#e8eaed] px-4 py-3.5 flex items-start gap-3 transition-all duration-150 hover:border-[#1a73e8]/50 hover:bg-[#f8fbff]"
    >
      <span
        className={`inline-flex items-center justify-center text-base shrink-0 w-9 h-9 rounded-lg border ${meta?.ring ?? 'bg-gray-50 border-gray-200'}`}
        title={meta?.label}
      >
        {meta?.emoji}
      </span>

      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-semibold text-[#202124] leading-snug group-hover:text-[#1a73e8] transition-colors line-clamp-2">
          {cleanedTitle}
        </h3>
        <p className="text-[11px] text-[#9aa0a6] mt-1">
          {formatDate(article.published_at ?? article.crawled_at)}
        </p>
      </div>

      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-[#dadce0] group-hover:text-[#1a73e8] shrink-0 mt-1 transition-colors"
      >
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </a>
  )
}
