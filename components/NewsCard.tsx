'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { NewsArticle, SourceCategory, TopicCategory } from '@/types'

const SOURCE_CAT_LABELS: Record<SourceCategory, string> = {
  global_health_org: '글로벌 보건기구',
  global_journal: '글로벌 저널',
  global_medical_ai: '글로벌 의료AI',
  korea_gov: '국내 공공기관',
  korea_medical_ai: '국내 의료AI',
  korea_medical_news: '국내 의료뉴스',
}

const SOURCE_CAT_VARIANTS: Record<SourceCategory, string> = {
  global_health_org: 'bg-blue-100 text-blue-800 border-blue-200',
  global_journal: 'bg-purple-100 text-purple-800 border-purple-200',
  global_medical_ai: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  korea_gov: 'bg-teal-100 text-teal-800 border-teal-200',
  korea_medical_ai: 'bg-orange-100 text-orange-800 border-orange-200',
  korea_medical_news: 'bg-green-100 text-green-800 border-green-200',
}

const TOPIC_LABELS: Record<TopicCategory, string> = {
  disease: '질병',
  medical_ai: '의료AI',
  korea_hospital: '한국병원',
  general: '일반',
}

function formatDate(d: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  const catStyle = SOURCE_CAT_VARIANTS[article.source_category] ?? 'bg-gray-100 text-gray-700'

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${catStyle}`}>
            {SOURCE_CAT_LABELS[article.source_category]}
          </span>
          <Badge variant="outline" className="text-[11px] py-0.5">
            {article.source}
          </Badge>
          {article.category && (
            <Badge variant="secondary" className="text-[11px] py-0.5">
              {TOPIC_LABELS[article.category]}
            </Badge>
          )}
          {article.language === 'ko' && (
            <span className="text-[11px] text-gray-400">🇰🇷</span>
          )}
          <span className="text-[11px] text-muted-foreground ml-auto">
            {formatDate(article.published_at ?? article.crawled_at)}
          </span>
        </div>

        <a
          href={article.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sm leading-snug hover:text-blue-600 transition-colors line-clamp-2"
        >
          {article.title}
        </a>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between gap-3 pt-0">
        {article.summary_ko ? (
          <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
            {article.summary_ko.split('\n').filter(Boolean).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">요약 처리 중...</p>
        )}

        <a
          href={article.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline self-end"
        >
          원문 보기 →
        </a>
      </CardContent>
    </Card>
  )
}
