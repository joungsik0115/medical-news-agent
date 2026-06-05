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
  if (diffH < 24) return `${diffH}시간 전`
  if (diffH < 48) return '어제'
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  const catStyle = SOURCE_CAT_STYLE[article.source_category] ?? 'bg-gray-100 text-gray-600 border-gray-200'

  return (
    <article
      className="bg-white rounded-2xl border border-[#e8eaed] p-5 flex flex-col gap-3 transition-all duration-200 hover:google-shadow-hover hover:-translate-y-0.5 cursor-default"
      style={{ boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)' }}
    >
      {/* Top row: category + source + date */}
      <div className="flex items-center gap-2 flex-wrap">
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
        <span className="text-[11px] text-[#9aa0a6] ml-auto">
          {formatDate(article.published_at ?? article.crawled_at)}
        </span>
      </div>

      {/* Title */}
      <a
        href={article.original_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[15px] font-semibold text-[#202124] leading-snug hover:text-[#1a73e8] transition-colors line-clamp-2"
      >
        {article.title}
      </a>

      {/* Summary */}
      <div className="flex-1">
        {article.summary_ko ? (
          <div className="space-y-1.5">
            {article.summary_ko
              .split('\n')
              .filter((l) => l.trim())
              .map((line, i) => (
                <p key={i} className="text-[13px] text-[#3c4043] leading-relaxed">
                  {line}
                </p>
              ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[13px] text-[#9aa0a6]">
            <span className="w-3 h-3 rounded-full border-2 border-[#9aa0a6] border-t-transparent animate-spin" />
            AI 요약 처리 중...
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#f1f3f4] flex items-center justify-end">
        <a
          href={article.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1a73e8] hover:text-[#1557b0] transition-colors"
        >
          원문 보기
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    </article>
  )
}
