import type { CrawlResult } from '@/types'
import { SOURCES } from './sources'
import { crawlRSS } from './rss'
import { crawlHTML } from './html'

export async function runAllCrawlers(): Promise<CrawlResult[]> {
  const results = await Promise.allSettled(
    SOURCES.map(async (source) => {
      const articles =
        source.type === 'rss' ? await crawlRSS(source) : await crawlHTML(source)
      return { source: source.name, count: articles.length, articles } as CrawlResult
    })
  )

  return results.map((result, i) => {
    const sourceName = SOURCES[i].name
    if (result.status === 'fulfilled') return result.value
    return {
      source: sourceName,
      count: 0,
      articles: [],
      error: result.reason instanceof Error ? result.reason.message : String(result.reason),
    }
  })
}
