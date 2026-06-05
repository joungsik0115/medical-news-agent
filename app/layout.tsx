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
  description: 'AI가 수집·요약하는 글로벌·국내 의료 뉴스 — 27개 소스 자동 크롤링',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={cn('font-sans', inter.variable)}>
      <body className="bg-[#f8f9fa] min-h-screen">

        {/* Google-style Header */}
        <header className="bg-white sticky top-0 z-20" style={{ boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.06)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

            {/* Logo */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shrink-0 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white" opacity="0.3"/>
                  <path d="M9 16V8h2v8H9zm4-8v8h2V8h-2z" fill="white"/>
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-semibold text-[#202124] leading-tight truncate">
                  좋은문화 인총쌤의 뉴스 에이전트
                </h1>
                <p className="text-[11px] text-[#5f6368] leading-tight hidden sm:block">
                  Lancet · JAMA · MedicalXpress · 히트뉴스 · 청년의사 외 27개 소스
                </p>
              </div>
            </div>

            {/* Right badges */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#5f6368] bg-[#f1f3f4] px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                매일 07:00 KST 자동 수집
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#5f6368] bg-[#f1f3f4] px-3 py-1.5 rounded-full">
                <span className="text-blue-500 font-semibold">AI</span>
                한국어 3줄 요약
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        <footer className="border-t border-[#e8eaed] mt-16 py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-[#5f6368]">
              © 2026 좋은문화 인총쌤의 뉴스 에이전트
            </p>
            <p className="text-xs text-[#5f6368]">
              Powered by OpenRouter · Supabase · Vercel
            </p>
          </div>
        </footer>

      </body>
    </html>
  )
}
