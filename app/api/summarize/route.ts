import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { summarizeToKorean, classifyTopic } from '@/lib/openrouter'

export const maxDuration = 300

function authOk(req: NextRequest) {
  return req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-vercel-cron') === '1' && !authOk(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServiceClient()
  const { data: articles, error } = await db
    .from('news_articles')
    .select('id, title, original_content, language')
    .eq('is_summarized', false)
    .order('crawled_at', { ascending: true })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!articles?.length) return NextResponse.json({ success: true, summarized: 0 })

  let summarized = 0
  let failed = 0

  for (const article of articles) {
    try {
      const summary = await summarizeToKorean(
        article.title,
        article.original_content ?? article.title,
        article.language ?? 'en'
      )
      const category = classifyTopic(article.title, article.original_content ?? '')

      const { error: upErr } = await db
        .from('news_articles')
        .update({ summary_ko: summary, category, is_summarized: true })
        .eq('id', article.id)

      if (upErr) throw upErr
      summarized++
      await new Promise((r) => setTimeout(r, 1000))
    } catch (err) {
      console.error(`[summarize] ${article.id}:`, err)
      failed++
    }
  }

  return NextResponse.json({ success: true, summarized, failed })
}

export async function GET(req: NextRequest) {
  return POST(req)
}
