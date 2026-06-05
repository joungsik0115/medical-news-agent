import { NextRequest, NextResponse } from 'next/server'
import { runAllCrawlers } from '@/lib/crawlers'
import { createServiceClient } from '@/lib/supabase'
import type { CrawledArticle } from '@/types'

export const maxDuration = 300

function authOk(req: NextRequest) {
  return req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-vercel-cron') === '1' && !authOk(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await runAllCrawlers()
    const db = createServiceClient()

    let totalInserted = 0
    let totalSkipped = 0

    for (const result of results) {
      if (result.error || result.articles.length === 0) continue

      const rows = result.articles.map((a: CrawledArticle) => ({
        source: a.source,
        source_category: a.source_category,
        title: a.title,
        original_url: a.original_url,
        original_content: a.original_content ?? null,
        category: a.source_category, // mirror source_category
        language: a.language,
        published_at: a.published_at ?? null,
        is_summarized: false,
      }))

      const { data, error } = await db
        .from('news_articles')
        .upsert(rows, { onConflict: 'original_url', ignoreDuplicates: true })
        .select('id')

      if (error) {
        console.error(`[crawl] DB error for ${result.source}:`, error.message)
        continue
      }
      totalInserted += data?.length ?? 0
      totalSkipped += rows.length - (data?.length ?? 0)
    }

    return NextResponse.json({
      success: true,
      totalInserted,
      totalSkipped,
      sources: results.map((r) => ({ source: r.source, found: r.count, error: r.error })),
    })
  } catch (err) {
    console.error('[crawl] Unexpected error:', err)
    return NextResponse.json({ error: 'Crawl failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return POST(req)
}
