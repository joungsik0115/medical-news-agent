import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '의료 뉴스 에이전트',
  description: 'AI가 수집·요약하는 글로벌·국내 의료 뉴스 — 27개 소스 자동 크롤링',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={cn('font-sans', inter.variable)}>
      <body className="bg-background min-h-screen">
        <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">🏥 의료 뉴스 에이전트</h1>
              <p className="text-[11px] text-muted-foreground">
                WHO · CDC · NIH · ECDC · Lancet · NEJM · JAMA · Stanford HAI · 질병관리청 · 히트뉴스 외 27개 소스
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[11px] text-muted-foreground">매일 오전 7시(KST) 자동 수집</p>
              <p className="text-[11px] text-muted-foreground">OpenRouter AI 3줄 한국어 요약</p>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
        <footer className="border-t mt-16 py-6 text-center text-xs text-muted-foreground">
          Medical News Agent · Powered by OpenRouter · Supabase · Vercel
        </footer>
      </body>
    </html>
  )
}
