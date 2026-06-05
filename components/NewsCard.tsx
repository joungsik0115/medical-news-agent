'use client'

import { CATEGORY_META } from '@/lib/crawlers/sources'
import type { NewsArticle } from '@/types'

function formatDate(d: string | null) {
  if (!d) return ''
  const date = new Date(d)
  const now = new Date()
  const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000)
  if (diffH < 1) return '방금 전'
  if (diffH < 24) return `${diffH}시간 전`
  if (diffH < 48) return '어제'
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `${diffD}일 전`
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  const meta = CATEGORY_META[article.source_category]

  return (
    <a
      href={article.original_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl border border-[#e8eaed] p-6 flex flex-col gap-4 transition-all duration-200 hover:border-[#1a73e8]/40 hover:-translate-y-0.5"
      style={{ boxShadow: '0 1px 2px 0 rgba(60,64,67,.12), 0 1px 3px 1px rgba(60,64,67,.08)' }}
    >
      {/* Topic chip */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${meta?.ring ?? 'bg-gray-50 border-gray-200'} ${meta?.color ?? 'text-gray-700'}`}>
          <span>{meta?.emoji}</span>
          {meta?.label ?? article.source_category}
        </span>
        <span className="text-[11px] text-[#9aa0a6] whitespace-nowrap">
          {formatDate(article.published_at ?? article.crawled_at)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[18px] sm:text-[19px] font-bold text-[#202124] leading-snug group-hover:text-[#1a73e8] transition-colors line-clamp-3">
        {article.title}
      </h3>

      {/* AI Summary */}
      {article.summary_ko ? (
        <div className="space-y-2 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 rounded-xl p-4 border border-blue-100/60">
          <div className="flex items-center gap-1.5 mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2l2.39 7.36H22l-6.18 4.48 2.36 7.16L12 16.5l-6.18 4.5 2.36-7.16L2 9.36h7.61z"/>
            </svg>
            <span className="text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider">AI 요약</span>
          </div>
          <div className="space-y-1.5">
            {article.summary_ko
              .split('\n')
              .filter((l) => l.trim())
              .slice(0, 3)
              .map((line, i) => (
                <p key={i} className="text-[14px] text-[#3c4043] leading-relaxed">
                  {line}
                </p>
              ))}
          </div>
        </div>
      ) : article.original_content ? (
        <p className="text-[14px] text-[#5f6368] leading-relaxed line-clamp-3">
          {article.original_content.slice(0, 200)}...
        </p>
      ) : (
        <div className="flex items-center gap-2 text-[13px] text-[#9aa0a6]">
          <span className="w-3 h-3 rounded-full border-2 border-[#9aa0a6] border-t-transparent animate-spin"/>
          AI 요약 처리 중...
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 mt-auto">
        <span className="text-[12px] text-[#9aa0a6] truncate max-w-[60%]">
          {hostname(article.original_url)}
        </span>
        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1a73e8] group-hover:gap-2 transition-all">
          원문 보기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>
    </a>
  )
}
