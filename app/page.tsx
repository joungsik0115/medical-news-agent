import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import NewsCard from '@/components/NewsCard'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import CrawlButton from '@/components/CrawlButton'
import type { NewsArticle, SourceCategory } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  return {
    articles: (data ?? []) as NewsArticle[],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

async function getStats() {
  const { data } = await supabase
    .from('news_articles')
    .select('source_category, is_summarized, language')

  if (!data) return { total: 0, summarized: 0, byCat: {} as Record<string, number>, korean: 0 }

  const byCat: Record<string, number> = {}
  let summarized = 0, korean = 0
  for (const r of data) {
    if (r.source_category) {
      byCat[r.source_category] = (byCat[r.source_category] ?? 0) + 1
    }
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

const CAT_COLORS: Record<SourceCategory, { bar: string; text: string; bg: string }> = {
  global_health_org: { bar: 'bg-blue-500',   text: 'text-blue-700',   bg: 'bg-blue-50' },
  global_journal:    { bar: 'bg-violet-500',  text: 'text-violet-700', bg: 'bg-violet-50' },
  global_medical_ai: { bar: 'bg-indigo-500',  text: 'text-indigo-700', bg: 'bg-indigo-50' },
  korea_gov:         { bar: 'bg-teal-500',    text: 'text-teal-700',   bg: 'bg-teal-50' },
  korea_medical_ai:  { bar: 'bg-orange-500',  text: 'text-orange-700', bg: 'bg-orange-50' },
  korea_medical_news:{ bar: 'bg-green-500',   text: 'text-green-700',  bg: 'bg-green-50' },
}

export default async function HomePage({ searchParams }: PageProps) {
  const [{ articles, total, page, totalPages }, stats] = await Promise.all([
    getArticles(searchParams),
    getStats(),
  ])

  const summarizeRate = stats.total > 0
    ? Math.round((stats.summarized / stats.total) * 100)
    : 0

  return (
    <div className="space-y-6">

      {/* ── KPI Stats ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📰"
          label="총 기사"
          value={stats.total.toLocaleString()}
          sub="27개 소스"
          accent="border-l-blue-500"
        />
        <StatCard
          icon="✨"
          label="AI 요약 완료"
          value={stats.summarized.toLocaleString()}
          sub={`완료율 ${summarizeRate}%`}
          accent="border-l-green-500"
        />
        <StatCard
          icon="🇰🇷"
          label="국내 뉴스"
          value={stats.korean.toLocaleString()}
          sub="한국어 소스"
          accent="border-l-teal-500"
        />
        <StatCard
          icon="🔍"
          label="검색 결과"
          value={total.toLocaleString()}
          sub={totalPages > 1 ? `${totalPages}페이지` : '단일 페이지'}
          accent="border-l-violet-500"
        />
      </div>

      {/* ── Category Chips ─────────────────────────────── */}
      {stats.total > 0 && (
        <div className="bg-white rounded-2xl border border-[#e8eaed] p-5 google-card-shadow">
          <p className="text-xs font-medium text-[#5f6368] mb-4 uppercase tracking-wide">
            카테고리별 현황
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(Object.entries(stats.byCat) as [SourceCategory, number][]).map(([cat, count]) => {
              const c = CAT_COLORS[cat]
              return (
                <div key={cat} className={`flex flex-col gap-1 p-3 rounded-xl ${c?.bg ?? 'bg-gray-50'} border border-transparent`}>
                  <div className="flex items-center justify-between">
                    <div className={`w-2 h-2 rounded-full ${c?.bar ?? 'bg-gray-400'}`} />
                    <span className={`text-sm font-bold ${c?.text ?? 'text-gray-700'}`}>{count}</span>
                  </div>
                  <span className="text-[11px] text-[#5f6368] leading-tight">{CAT_LABELS[cat]}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Search & Controls ──────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] p-4 google-card-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Suspense fallback={<div className="h-10 w-96 bg-[#f1f3f4] rounded-full animate-pulse" />}>
            <FilterBar />
          </Suspense>
          <CrawlButton />
        </div>
      </div>

      {/* ── Article Grid ───────────────────────────────── */}
      {articles.length === 0 ? (
        <div className="text-center py-32 text-[#5f6368]">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#f1f3f4] flex items-center justify-center text-3xl">
            📭
          </div>
          <p className="text-lg font-medium text-[#202124]">기사가 없습니다</p>
          <p className="text-sm mt-1">필터를 변경하거나 &quot;지금 수집&quot;을 눌러보세요.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#5f6368]">
              <span className="font-medium text-[#202124]">{total.toLocaleString()}</span>개 기사
            </p>
          </div>
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

function StatCard({
  icon, label, value, sub, accent,
}: {
  icon: string
  label: string
  value: string
  sub?: string
  accent: string
}) {
  return (
    <div className={`bg-white rounded-2xl border-l-4 border border-[#e8eaed] ${accent} p-5 google-card-shadow`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-[#202124] leading-none">{value}</p>
      <p className="text-xs font-medium text-[#202124] mt-1.5">{label}</p>
      {sub && <p className="text-[11px] text-[#5f6368] mt-0.5">{sub}</p>}
    </div>
  )
}
