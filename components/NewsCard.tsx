'use client'

import type { NewsArticle, SourceCategory, TopicCategory } from '@/types'

const SOURCE_CAT_STYLE: Record<SourceCategory, string> = {
  global_health_org:  'bg-blue-50 text-blue-700 border-blue-200',
  global_journal:     'bg-violet-50 text-violet-700 border-violet-200',
  global_medical_ai:  'bg-indigo-50 text-indigo-700 border-indigo-200',
  korea_gov:          'bg-teal-50 text-teal-700 border-teal-200',
  korea_medical_ai:   'bg-orange-50 text-orange-700 border-orange-200',
  korea_medical_news: 'bg-green-50 text-green-700 border-green-200',
}

const SOURCE_CAT_LABELS: Record<SourceCategory, string> = {
  global_health_org:  '글로벌 보건기구',
  global_journal:     '글로벌 저널',
  global_medical_ai:  '글로벌 의료AI',
  korea_gov:          '국내 공공기관',
  korea_medical_ai:   '국내 의료AI',
  korea_medical_news: '국내 의료뉴스',
}

const TOPIC_STYLE: Record<TopicCategory, string> = {
  disease:        'bg-red-50 text-red-600',
  medical_ai:     'bg-blue-50 text-blue-600',
  korea_hospital: 'bg-teal-50 text-teal-600',
  general:        'bg-gray-100 text-gray-500',
}

const TOPIC_LABELS: Record<TopicCategory, string> = {
  disease:        '질병',
  medical_ai:     '의료AI',
  korea_hospital: '한국병원',
  general:        '일반',
}

function formatDate(d: string | null) {
  if (!d) return ''
  const date = new Date(d)
  const now = new Date()
  const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000)
  if (diffH < 1) return '방금 전'
  if (diffH < 24) return `${diffH}시간 전`
  if (diffH < 48) return '어제'
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

function cleanText(text: string | null | undefined) {
  if (!text) return ''
  return text.replace(/\s+/g, ' ').trim()
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  const catStyle = SOURCE_CAT_STYLE[article.source_category] ?? 'bg-gray-100 text-gray-600 border-gray-200'
  const fallback = cleanText(article.original_content).slice(0, 200)

  return (
    <a
      href={article.original_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl border border-[#e8eaed] p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 hover:border-[#1a73e8]/30 cursor-pointer block"
      style={{ boxShadow: '0 1px 2px 0 rgba(60,64,67,.18), 0 1px 3px 1px rgba(60,64,67,.1)' }}
    >
      {/* Top metadata row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catStyle}`}>
          {SOURCE_CAT_LABELS[article.source_category]}
        </span>
        <span className="text-[11px] font-medium text-[#202124] bg-[#f1f3f4] px-2 py-0.5 rounded-full">
          {article.source}
        </span>
        {article.category && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TOPIC_STYLE[article.category]}`}>
            {TOPIC_LABELS[article.category]}
          </span>
        )}
        {article.language === 'ko' && (
          <span className="text-[11px]" title="한국어">🇰🇷</span>
        )}
        <span className="text-[11px] text-[#9aa0a6] ml-auto whitespace-nowrap">
          {formatDate(article.published_at ?? article.crawled_at)}
        </span>
      </div>

      {/* Title - large, prominent */}
      <h3 className="text-[17px] font-bold text-[#202124] leading-snug group-hover:text-[#1a73e8] transition-colors line-clamp-3">
        {article.title}
      </h3>

      {/* Summary or fallback content */}
      <div className="flex-1">
        {article.summary_ko ? (
          <div className="space-y-1.5 bg-blue-50/40 rounded-lg p-3 border-l-2 border-blue-200">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wide">AI 요약</span>
            </div>
            {article.summary_ko
              .split('\n')
              .filter((l) => l.trim())
              .map((line, i) => (
                <p key={i} className="text-[13px] text-[#3c4043] leading-relaxed">
                  {line}
                </p>
              ))}
          </div>
        ) : fallback ? (
          <p className="text-[13px] text-[#5f6368] leading-relaxed line-clamp-3">
            {fallback}
            {article.original_content && article.original_content.length > 200 && '...'}
          </p>
        ) : (
          <div className="flex items-center gap-2 text-[12px] text-[#9aa0a6]">
            <span className="w-3 h-3 rounded-full border-2 border-[#9aa0a6] border-t-transparent animate-spin" />
            AI 요약 처리 중...
          </div>
        )}
      </div>

      {/* Footer: read more arrow */}
      <div className="pt-2 border-t border-[#f1f3f4] flex items-center justify-between">
        <span className="text-[11px] text-[#9aa0a6] truncate flex-1">
          {new URL(article.original_url).hostname.replace('www.', '')}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1a73e8] group-hover:gap-2 transition-all">
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
