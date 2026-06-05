import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import NewsCard from '@/components/NewsCard'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import CrawlButton from '@/components/CrawlButton'
import { Separator } from '@/components/ui/separator'
import type { NewsArticle, SourceCategory } from '@/types'

export const revalidate = 300

interface PageProps {
  searchParams: {
    page?: string
    source_category?: string
    category?: string
    language?: string
    q?: string
  }
}

async function getArticles(sp: PageProps['searchParams']) {
  const page = Math.max(1, parseInt(sp.page ?? '1'))
  const limit = 21
  const from = (page - 1) * limit

  let query = supabase
    .from('news_articles')
    .select('*', { count: 'exact' })
    .order('crawled_at', { ascending: false })
    .range(from, from + limit - 1)

  if (sp.source_category) query = query.eq('source_category', sp.source_category)
  if (sp.category) query = query.eq('category', sp.category)
  if (sp.language) query = query.eq('language', sp.language)
  if (sp.q) query = query.ilike('title', `%${sp.q}%`)

  const { data, count, error } = await query
  if (error) throw error
  return { articles: (data ?? []) as NewsArticle[], total: count ?? 0, page, totalPages: Math.ceil((count ?? 0) / limit) }
}

async function getStats() {
  const { data } = await supabase
    .from('news_articles')
    .select('source_category, is_summarized, language')

  if (!data) return { total: 0, summarized: 0, byCat: {} as Record<string, number>, korean: 0 }

  const byCat: Record<string, number> = {}
  let summarized = 0, korean = 0
  for (const r of data) {
    byCat[r.source_category] = (byCat[r.source_category] ?? 0) + 1
    if (r.is_summarized) summarized++
    if (r.language === 'ko') korean++
  }
  return { total: data.length, summarized, byCat, korean }
}

const CAT_LABELS: Record<SourceCategory, string> = {
  global_health_org: '글로벌 보건기구',
  global_journal: '글로벌 저널',
  global_medical_ai: '글로벌 의료AI',
  korea_gov: '국내 공공기관',
  korea_medical_ai: '국내 의료AI',
  korea_medical_news: '국내 의료뉴스',
}

const CAT_COLORS: Record<SourceCategory, string> = {
  global_health_org: 'bg-blue-500',
  global_journal: 'bg-purple-500',
  global_medical_ai: 'bg-indigo-500',
  korea_gov: 'bg-teal-500',
  korea_medical_ai: 'bg-orange-500',
  korea_medical_news: 'bg-green-500',
}

export default async function HomePage({ searchParams }: PageProps) {
  const [{ articles, total, page, totalPages }, stats] = await Promise.all([
    getArticles(searchParams),
    getStats(),
  ])

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="총 기사" value={stats.total} sub="27개 소스" />
        <StatCard label="AI 요약 완료" value={stats.summarized} sub={`미완료 ${stats.total - stats.summarized}개`} />
        <StatCard label="국내 뉴스" value={stats.korean} sub="한국어 소스" />
        <StatCard label="검색 결과" value={total} sub={`${totalPages}페이지`} />
      </div>

      {/* Category breakdown */}
      {stats.total > 0 && (
        <div className="bg-card border rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">카테고리별 기사 수</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {(Object.entries(stats.byCat) as [SourceCategory, number][]).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full shrink-0 ${CAT_COLORS[cat] ?? 'bg-gray-400'}`} />
                <span className="text-xs text-muted-foreground truncate">{CAT_LABELS[cat]}</span>
                <span className="text-xs font-semibold ml-auto">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Suspense fallback={<div className="h-9 w-80 bg-muted rounded-md animate-pulse" />}>
          <FilterBar />
        </Suspense>
        <CrawlButton />
      </div>

      {/* Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-5xl mb-4">📰</p>
          <p className="text-lg font-medium">기사가 없습니다</p>
          <p className="text-sm mt-1">필터를 변경하거나 &quot;지금 수집&quot;을 눌러보세요.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">총 {total.toLocaleString()}개 기사</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}

      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-card border rounded-xl p-4 text-center">
      <p className="text-2xl font-bold">{value.toLocaleString()}</p>
      <p className="text-xs font-medium mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

