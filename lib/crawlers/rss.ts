import axios from 'axios'
import * as cheerio from 'cheerio'
import type { CrawledArticle, SourceConfig } from '@/types'

export async function crawlRSS(source: SourceConfig): Promise<CrawledArticle[]> {
  const { data } = await axios.get(source.feedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MedicalNewsBot/2.0)',
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
    },
    timeout: 15000,
    responseType: 'text',
  })

  const $ = cheerio.load(data, { xmlMode: true })
  const articles: CrawledArticle[] = []

  $('item, entry').each((_, el) => {
    const $el = $(el)

    const title = $el.find('title').first().text().trim().replace(/<!\[CDATA\[|\]\]>/g, '')
    if (!title) return

    const link =
      $el.find('link').first().text().trim() ||
      $el.find('link').first().attr('href') ||
      $el.find('guid').first().text().trim()
    if (!link || !link.startsWith('http')) return

    const pubDate =
      $el.find('pubDate, published, updated, dc\\:date').first().text().trim()

    const description =
      $el.find('description, summary, content\\:encoded, content').first().text().trim()
      .replace(/<[^>]+>/g, '')
      .slice(0, 500)

    let parsedDate: string | undefined
    if (pubDate) {
      try {
        parsedDate = new Date(pubDate).toISOString()
      } catch {
        /* skip invalid dates */
      }
    }

    articles.push({
      source: source.name,
      source_category: source.category,
      title,
      original_url: link,
      original_content: description || undefined,
      language: source.language,
      published_at: parsedDate,
    })
  })

  return articles.slice(0, 15)
}
