export type SourceCategory =
  | 'medical_ai'            // 의료 AI 일반
  | 'hospital_ai'           // 병원 AI 도입 사례
  | 'hospital_management'   // 병원 경영 혁신
  | 'our_hospitals'         // 좋은문화병원·은성의료재단·좋은병원들
  | 'regenerative_medicine' // 첨단재생의료
  | 'hr_labor'              // 인사노무 이슈
  | 'coaching_leadership'   // 코칭 리더십

export interface NewsArticle {
  id: string
  source: string
  source_category: SourceCategory
  title: string
  original_url: string
  original_content: string | null
  summary_ko: string | null
  category: string | null
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
}
