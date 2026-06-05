import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 300

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const source = searchParams.get('source')
  const sourceCategory = searchParams.get('source_category')
  const category = searchParams.get('category')
  const language = searchParams.get('language')
  const q = searchParams.get('q')

  const from = (page - 1) * limit

  let query = supabase
    .from('news_articles')
    .select('*', { count: 'exact' })
    .order('crawled_at', { ascending: false })
    .range(from, from + limit - 1)

  if (source) query = query.eq('source', source)
  if (sourceCategory) query = query.eq('source_category', sourceCategory)
  if (category) query = query.eq('category', category)
  if (language) query = query.eq('language', language)
  if (q) query = query.ilike('title', `%${q}%`)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    articles: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  })
}
