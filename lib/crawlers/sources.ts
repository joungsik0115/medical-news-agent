import type { SourceConfig } from '@/types'

// Google News RSS search format
const gnews = (q: string) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ko&gl=KR&ceid=KR:ko`

export const SOURCES: SourceConfig[] = [
  // ── 의료 AI ───────────────────────────────────────────
  {
    id: 'gnews_medical_ai',
    name: '의료 AI',
    feedUrl: gnews('의료 AI OR 의료인공지능 OR "medical AI"'),
    type: 'rss',
    category: 'medical_ai',
    language: 'ko',
  },

  // ── 병원 AI 도입 ──────────────────────────────────────
  {
    id: 'gnews_hospital_ai',
    name: '병원 AI',
    feedUrl: gnews('병원 AI OR 병원 인공지능 도입'),
    type: 'rss',
    category: 'hospital_ai',
    language: 'ko',
  },

  // ── 병원 경영 혁신 ────────────────────────────────────
  {
    id: 'gnews_hospital_management',
    name: '병원 경영 혁신',
    feedUrl: gnews('병원 경영 혁신 OR 의료기관 경영'),
    type: 'rss',
    category: 'hospital_management',
    language: 'ko',
  },

  // ── 우리 병원들 ───────────────────────────────────────
  {
    id: 'gnews_good_culture',
    name: '좋은문화병원',
    feedUrl: gnews('좋은문화병원'),
    type: 'rss',
    category: 'our_hospitals',
    language: 'ko',
  },
  {
    id: 'gnews_eunseong',
    name: '은성의료재단',
    feedUrl: gnews('은성의료재단'),
    type: 'rss',
    category: 'our_hospitals',
    language: 'ko',
  },
  {
    id: 'gnews_good_hospitals',
    name: '좋은병원들',
    feedUrl: gnews('좋은병원들 OR "좋은삼선병원" OR "좋은강안병원" OR "좋은수병원"'),
    type: 'rss',
    category: 'our_hospitals',
    language: 'ko',
  },

  // ── 첨단재생의료 ─────────────────────────────────────
  {
    id: 'gnews_regenerative',
    name: '첨단재생의료',
    feedUrl: gnews('첨단재생의료 OR 재생의료기관 OR 세포치료 OR 유전자치료'),
    type: 'rss',
    category: 'regenerative_medicine',
    language: 'ko',
  },

  // ── 인사노무 이슈 ────────────────────────────────────
  {
    id: 'gnews_hr_labor',
    name: '인사노무 이슈',
    feedUrl: gnews('인사노무 OR 근로기준법 OR 의료기관 노무 OR 병원 노무'),
    type: 'rss',
    category: 'hr_labor',
    language: 'ko',
  },

  // ── 코칭 리더십 ──────────────────────────────────────
  {
    id: 'gnews_coaching_leadership',
    name: '코칭 리더십',
    feedUrl: gnews('"코칭 리더십" OR "리더십 코칭" OR executive coaching OR 임원 코칭'),
    type: 'rss',
    category: 'coaching_leadership',
    language: 'ko',
  },
]

export const CATEGORY_META: Record<
  SourceConfig['category'],
  { label: string; emoji: string; color: string; ring: string; chip: string }
> = {
  medical_ai: {
    label: '의료 AI',
    emoji: '🧬',
    color: 'text-blue-700',
    ring: 'bg-blue-50 border-blue-200',
    chip: 'bg-blue-600',
  },
  hospital_ai: {
    label: '병원 AI 도입',
    emoji: '🏥',
    color: 'text-indigo-700',
    ring: 'bg-indigo-50 border-indigo-200',
    chip: 'bg-indigo-600',
  },
  hospital_management: {
    label: '병원 경영혁신',
    emoji: '📈',
    color: 'text-violet-700',
    ring: 'bg-violet-50 border-violet-200',
    chip: 'bg-violet-600',
  },
  our_hospitals: {
    label: '우리 병원들',
    emoji: '⭐',
    color: 'text-rose-700',
    ring: 'bg-rose-50 border-rose-200',
    chip: 'bg-rose-600',
  },
  regenerative_medicine: {
    label: '첨단재생의료',
    emoji: '🧪',
    color: 'text-teal-700',
    ring: 'bg-teal-50 border-teal-200',
    chip: 'bg-teal-600',
  },
  hr_labor: {
    label: '인사·노무',
    emoji: '⚖️',
    color: 'text-amber-700',
    ring: 'bg-amber-50 border-amber-200',
    chip: 'bg-amber-600',
  },
  coaching_leadership: {
    label: '코칭 리더십',
    emoji: '🎯',
    color: 'text-purple-700',
    ring: 'bg-purple-50 border-purple-200',
    chip: 'bg-purple-600',
  },
}
