import { CATEGORY_META } from '@/lib/crawlers/sources'
import type { NewsArticle, SourceCategory } from '@/types'

function cleanTitle(title: string) {
  return title.replace(/\s*-\s*[^-]+$/, '').trim() || title
}

function firstBullet(summary: string | null) {
  if (!summary) return ''
  const lines = summary.split('\n').map((l) => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
  return lines[0] ?? ''
}

const RANK_STYLE = [
  'bg-gradient-to-br from-rose-500 to-rose-600',     // #1
  'bg-gradient-to-br from-orange-500 to-orange-600', // #2
  'bg-gradient-to-br from-amber-500 to-amber-600',   // #3
  'bg-gradient-to-br from-slate-500 to-slate-600',   // #4
  'bg-gradient-to-br from-slate-500 to-slate-600',   // #5
]

export default function NewsBriefing({
  articles,
  label,
}: {
  articles: NewsArticle[]
  label?: string
}) {
  if (articles.length === 0) return null

  return (
    <section
      className="rounded-2xl border border-[#e8eaed] bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 p-5 sm:p-6"
      style={{ boxShadow: '0 1px 3px 0 rgba(60,64,67,.1), 0 4px 12px 2px rgba(60,64,67,.06)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📰</span>
        <h3 className="text-[15px] font-bold text-[#202124]">
          오늘의 핵심 5선 브리핑
          {label && (
            <span className="text-[#5f6368] font-medium ml-1.5">· {label}</span>
          )}
        </h3>
      </div>

      {/* Briefing list */}
      <ol className="space-y-3">
        {articles.slice(0, 5).map((article, i) => {
          const meta = CATEGORY_META[article.source_category as SourceCategory]
          const title = cleanTitle(article.title)
          const brief = firstBullet(article.summary_ko)
          return (
            <li key={article.id} className="flex gap-3 group">
              {/* Rank badge */}
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-white text-[12px] font-bold shrink-0 shadow-sm ${RANK_STYLE[i]}`}
              >
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${meta?.ring ?? 'bg-gray-50 border-gray-200'} ${meta?.color ?? 'text-gray-700'}`}>
                    {meta?.emoji}
                    {meta?.label ?? article.source_category}
                  </span>
                </div>
                <a
                  href={article.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[14px] sm:text-[15px] font-semibold text-[#202124] leading-snug hover:text-[#1a73e8] transition-colors line-clamp-2"
                >
                  {title}
                </a>
                {brief && (
                  <p className="text-[12.5px] text-[#5f6368] leading-relaxed mt-1 line-clamp-2">
                    {brief}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
