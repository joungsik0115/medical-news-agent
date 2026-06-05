import axios from 'axios'
import * as cheerio from 'cheerio'
import type { CrawledArticle, SourceConfig } from '@/types'

export async function crawlHTML(source: SourceConfig): Promise<CrawledArticle[]> {
  if (!source.selectors) return []

  const { data } = await axios.get(source.feedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
    },
    timeout: 15000,
  })

  const $ = cheerio.load(data)
  const { item, title: titleSel, link: linkSel, content, date, linkBase = '' } = source.selectors
  const articles: CrawledArticle[] = []

  $(item).each((_, el) => {
    const $el = $(el)

    const titleEl = $el.find(titleSel).first()
    const titleText = titleEl.text().trim()
    if (!titleText || titleText.length < 3) return

    const linkEl = $el.find(linkSel).first()
    const href = linkEl.attr('href') || titleEl.closest('a').attr('href')
    if (!href) return

    const url = href.startsWith('http') ? href : `${linkBase}${href}`
    if (!url.startsWith('http')) return

    const snippet = content ? $el.find(content).first().text().trim().slice(0, 300) : undefined
    const dateText = date ? $el.find(date).first().text().trim() : undefined

    let parsedDate: string | undefined
    if (dateText) {
      try {
        parsedDate = new Date(dateText).toISOString()
      } catch {
        /* skip */
      }
    }

    articles.push({
      source: source.name,
      source_category: source.category,
      title: titleText,
      original_url: url,
      original_content: snippet,
      language: source.language,
      published_at: parsedDate,
    })
  })

  return articles.slice(0, 15)
}
