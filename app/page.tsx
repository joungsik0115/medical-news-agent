import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import NewsCard from '@/components/NewsCard'
import TopicTabs from '@/components/TopicTabs'
import Pagination from '@/components/Pagination'
import CrawlButton from '@/components/CrawlButton'
import { CATEGORY_META } from '@/lib/crawlers/sources'
import type { NewsArticle, SourceCategory } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  searchParams: {
    page?: string
    topic?: string
    q?: string
  }
}

async function getArticles(sp: PageProps['searchParams']) {
  const page = Math.max(1, parseInt(sp.page ?? '1'))
  const limit = 12
  const from = (page - 1) * limit

  let query = supabase
    .from('news_articles')
    .select('*', { count: 'exact' })
    .order('crawled_at', { ascending: false })
    .range(from, from + limit - 1)

  if (sp.topic) query = query.eq('source_category', sp.topic)
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

async function getTopicCounts() {
  const { data } = await supabase
    .from('news_articles')
    .select('source_category')

  const counts: Record<string, number> = {}
  for (const r of data ?? []) {
    if (r.source_category) counts[r.source_category] = (counts[r.source_category] ?? 0) + 1
  }
  return counts
}

export default async function HomePage({ searchParams }: PageProps) {
  const [{ articles, total, page, totalPages }, counts] = await Promise.all([
    getArticles(searchParams),
    getTopicCounts(),
  ])

  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0)
  const activeTopic = searchParams.topic as SourceCategory | undefined
  const activeMeta = activeTopic ? CATEGORY_META[activeTopic] : null

  return (
    <div className="space-y-8">

      {/* ── Hero / Welcome ─────────────────────────────────────── */}
      <section className="text-center pt-2 pb-1">
        <p className="text-[13px] text-[#5f6368] font-medium tracking-wider uppercase mb-2">
          오늘의 의료·병원·AI 핵심 이슈
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#202124] leading-tight tracking-tight">
          {activeMeta ? (
            <>
              <span className="mr-2">{activeMeta.emoji}</span>
              <span className={activeMeta.color}>{activeMeta.label}</span>
            </>
          ) : (
            <>오늘의 헤드라인</>
          )}
        </h2>
        <p className="text-sm text-[#5f6368] mt-3">
          총 <span className="font-semibold text-[#202124]">{totalAll}</span>개 기사 ·
          매일 AI가 핵심 3줄로 요약합니다
        </p>
      </section>

      {/* ── Topic Tabs ─────────────────────────────────────────── */}
      <Suspense fallback={<div className="h-12 bg-[#f1f3f4] rounded-full animate-pulse" />}>
        <TopicTabs counts={counts} />
      </Suspense>

      {/* ── Crawl button (subtle, right-aligned) ───────────────── */}
      <div className="flex items-center justify-between -mt-4">
        <p className="text-xs text-[#5f6368]">
          {activeTopic ? `${activeMeta?.label} ${total}개` : `최신 ${total}개`}
        </p>
        <CrawlButton />
      </div>

      {/* ── Article Grid ───────────────────────────────────────── */}
      {articles.length === 0 ? (
        <div className="text-center py-32 text-[#5f6368]">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#f1f3f4] flex items-center justify-center text-3xl">
            📭
          </div>
          <p className="text-lg font-medium text-[#202124]">기사가 없습니다</p>
          <p className="text-sm mt-1">우측 상단의 &quot;지금 수집&quot; 버튼을 눌러 첫 수집을 시작하세요.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>

    </div>
  )
}
