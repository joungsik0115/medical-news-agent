export type SourceCategory =
  | 'global_health_org'
  | 'global_journal'
  | 'global_medical_ai'
  | 'korea_gov'
  | 'korea_medical_ai'
  | 'korea_medical_news'

export type TopicCategory = 'disease' | 'medical_ai' | 'korea_hospital' | 'general'

export interface NewsArticle {
  id: string
  source: string
  source_category: SourceCategory
  title: string
  original_url: string
  original_content: string | null
  summary_ko: string | null
  category: TopicCategory | null
  language: 'en' | 'ko'
  published_at: string | null
  crawled_at: string
  is_summarized: boolean
}

export interface CrawledArticle {
  source: string
  source_category: SourceCategory
  title: string
  original_url: string
  original_content?: string
  category?: TopicCategory
  language: 'en' | 'ko'
  published_at?: string
}

export interface CrawlResult {
  source: string
  count: number
  articles: CrawledArticle[]
  error?: string
}

export interface SourceConfig {
  id: string
  name: string
  feedUrl: string
  type: 'rss' | 'html'
  category: SourceCategory
  language: 'en' | 'ko'
  selectors?: HtmlSelectors
}

export interface HtmlSelectors {
  item: string
  title: string
  link: string
  content?: string
  date?: string
  linkBase?: string
}
