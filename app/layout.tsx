import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
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

        <header className="bg-white border-b border-[#e8eaed] sticky top-0 z-20 backdrop-blur-md bg-white/95">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">
              {/* 좋은문화병원 공식 로고 */}
              <Image
                src="/moonhwa-logo.png"
                alt="좋은문화병원 (GOOD MOONHWA HOSPITAL)"
                width={366}
                height={65}
                priority
                className="h-10 w-auto shrink-0"
              />
              <div className="hidden sm:flex flex-col min-w-0 border-l border-[#e8eaed] pl-3">
                <h1 className="text-[13px] font-bold text-[#202124] leading-tight truncate">
                  인총쌤의 뉴스 에이전트
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

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>

        <footer className="border-t border-[#e8eaed] mt-20 py-8 bg-[#fafafa]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs text-[#5f6368]">
              © 2026 좋은문화 인총쌤의 뉴스 에이전트 · AI 한국어 3줄 요약
            </p>
          </div>
        </footer>

      </body>
    </html>
  )
}
