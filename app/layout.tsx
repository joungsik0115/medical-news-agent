import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '좋은문화 인총쌤의 뉴스 에이전트',
  description: '의료 AI · 병원 경영혁신 · 우리 병원들 · 첨단재생의료 · 인사노무 핵심 이슈를 AI가 매일 요약',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={cn('font-sans', inter.variable)}>
      <body className="bg-white min-h-screen">

        {/* Header — Busan seagull + clean title */}
        <header className="bg-white border-b border-[#e8eaed] sticky top-0 z-20 backdrop-blur-md bg-white/95">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 shadow-sm relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #4FC3F7 0%, #1976D2 60%, #0D47A1 100%)',
                }}
                title="부산 갈매기"
              >
                <svg width="26" height="26" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="부산 상징 갈매기">
                  <circle cx="48" cy="20" r="5" fill="#FFD54F" opacity="0.9"/>
                  <path d="M10 30 Q20 14 30 28 Q34 22 38 28 Q48 14 58 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M22 38 Q28 32 34 38 Q40 32 46 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
                  <path d="M4 50 Q14 44 24 50 T44 50 T64 50" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85"/>
                  <path d="M4 56 Q14 50 24 56 T44 56 T64 56" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-[15px] sm:text-base font-bold text-[#202124] leading-tight truncate">
                  좋은문화 인총쌤의 뉴스 에이전트
                </h1>
                <p className="text-[11px] text-[#5f6368] leading-tight">
                  의료 AI · 병원 경영혁신 · 우리 병원들
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#5f6368] bg-[#f1f3f4] px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                매일 07:00 KST
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>

        <footer className="border-t border-[#e8eaed] mt-20 py-8 bg-[#fafafa]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs text-[#5f6368]">
              © 2026 좋은문화 인총쌤의 뉴스 에이전트 · AI 한국어 3줄 요약
            </p>
          </div>
        </footer>

      </body>
    </html>
  )
}
