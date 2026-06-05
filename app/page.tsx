import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import NewsCard from '@/components/NewsCard'
import NewsBriefing from '@/components/NewsBriefing'
import TopicTabs from '@/components/TopicTabs'
import SearchBar from '@/components/SearchBar'
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
  const limit = 20
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

const BRIEFING_PRIORITY: SourceCategory[] = [
  'our_hospitals',
  'hospital_ai',
  'medical_ai',
  'hr_labor',
  'hospital_management',
  'coaching_leadership',
]

async function getBriefing(sp: PageProps['searchParams']) {
  if (sp.topic || sp.q) {
    let query = supabase
      .from('news_articles')
      .select('*')
      .eq('is_summarized', true)
      .order('crawled_at', { ascending: false })
      .limit(5)
    if (sp.topic) query = query.eq('source_category', sp.topic)
    if (sp.q) query = query.ilike('title', `%${sp.q}%`)
    const { data } = await query
    return (data ?? []) as NewsArticle[]
  }

  const results = await Promise.all(
    BRIEFING_PRIORITY.map((cat) =>
      supabase
        .from('news_articles')
        .select('*')
        .eq('source_category', cat)
        .eq('is_summarized', true)
        .order('crawled_at', { ascending: false })
        .limit(1)
        .maybeSingle()
    )
  )
  return results.filter((r) => r.data).map((r) => r.data) as NewsArticle[]
}

export default async function HomePage({ searchParams }: PageProps) {
  const [{ articles, total, page, totalPages }, counts, briefing] = await Promise.all([
    getArticles(searchParams),
    getTopicCounts(),
    getBriefing(searchParams),
  ])

  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0)
  const activeTopic = searchParams.topic as SourceCategory | undefined
  const activeMeta = activeTopic ? CATEGORY_META[activeTopic] : null

  return (
    <div className="flex flex-col gap-3">

      {/* ── Controls row: 검색 + 총계 + 수집 버튼 ─────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <Suspense fallback={<div className="h-10 w-full bg-[#f1f3f4] rounded-full animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
        <span className="text-[11px] text-[#9aa0a6] whitespace-nowrap hidden sm:inline shrink-0">
          총 <span className="font-semibold text-[#202124]">{totalAll}</span>개
        </span>
        <div className="shrink-0">
          <CrawlButton />
        </div>
      </div>

      {/* ── Topic Tabs ─────────────────────────────────────────── */}
      <Suspense fallback={<div className="h-10 bg-[#f1f3f4] rounded-full animate-pulse" />}>
        <TopicTabs counts={counts} />
      </Suspense>

      {/* ── Split: 브리핑 (left) + 최신 뉴스 (right) ─────────── */}
      {/* 데스크탑: 뷰포트 높이를 채우는 50/50 분할 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-[calc(100vh-13.5rem)] min-h-[500px]">

        {/* Left: 5선 브리핑 */}
        <div className="lg:overflow-y-auto lg:rounded-2xl">
          {briefing.length > 0 ? (
            <NewsBriefing
              articles={briefing}
              label={
                searchParams.q
                  ? `"${searchParams.q}" 검색`
                  : activeMeta?.label
              }
            />
          ) : (
            <div className="rounded-2xl border border-[#e8eaed] bg-[#f8f9fa] p-6 flex items-center justify-center text-[#9aa0a6] text-sm h-full min-h-[200px]">
              브리핑 기사가 없습니다
            </div>
          )}
        </div>

        {/* Right: 최신 뉴스 — 패널 내부 스크롤 */}
        <div
          className="rounded-2xl border border-[#e8eaed] bg-white flex flex-col lg:overflow-hidden"
          style={{ boxShadow: '0 1px 3px 0 rgba(60,64,67,.1), 0 4px 12px 2px rgba(60,64,67,.06)' }}
        >
          {/* 스티키 헤더 */}
          <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 pt-5 pb-3 border-b border-[#f1f3f4]">
            <div className="flex items-center gap-2">
              <span className="text-xl">🗞️</span>
              <h3 className="text-[15px] font-bold text-[#202124]">최신 뉴스</h3>
            </div>
            <span className="text-[12px] text-[#9aa0a6]">
              {searchParams.q
                ? <><span className="font-semibold text-[#202124]">&quot;{searchParams.q}&quot;</span> 검색</>
                : activeTopic
                  ? `${activeMeta?.label} ${total}개`
                  : `총 ${total}개`}
            </span>
          </div>

          {/* 기사 목록 — 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
            {articles.length === 0 ? (
              <div className="text-center py-16 text-[#5f6368]">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f1f3f4] flex items-center justify-center text-2xl">
                  {searchParams.q ? '🔍' : '📭'}
                </div>
                <p className="text-sm font-medium text-[#202124]">
                  {searchParams.q ? `"${searchParams.q}" 검색 결과가 없습니다` : '기사가 없습니다'}
                </p>
                <p className="text-xs mt-1 text-[#9aa0a6]">
                  {searchParams.q
                    ? '다른 키워드로 검색하거나 필터를 초기화해 보세요.'
                    : '"지금 수집" 버튼을 눌러 첫 수집을 시작하세요.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>

          {/* 페이지네이션 — 패널 하단 고정 */}
          {totalPages > 1 && (
            <div className="shrink-0 border-t border-[#f1f3f4] px-5 sm:px-6 py-3">
              <Suspense>
                <Pagination currentPage={page} totalPages={totalPages} />
              </Suspense>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
