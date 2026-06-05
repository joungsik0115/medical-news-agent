'use client'

import { useState } from 'react'

type Status = 'idle' | 'crawling' | 'summarizing' | 'done' | 'error'

export default function CrawlButton() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const run = async () => {
    try {
      setStatus('crawling')
      setMessage('수집 중...')

      const crawlRes = await fetch('/api/crawl')
      const crawlData = await crawlRes.json()
      if (!crawlRes.ok) throw new Error(crawlData.error)

      setStatus('summarizing')
      setMessage(`${crawlData.totalInserted}개 수집. 요약 중...`)

      const sumRes = await fetch('/api/summarize')
      const sumData = await sumRes.json()
      if (!sumRes.ok) throw new Error(sumData.error)

      setStatus('done')
      setMessage(`수집 ${crawlData.totalInserted} · 요약 ${sumData.summarized}`)
      setTimeout(() => { setStatus('idle'); setMessage('') }, 5000)
      window.location.reload()
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : '오류')
      setTimeout(() => { setStatus('idle'); setMessage('') }, 5000)
    }
  }

  const loading = status === 'crawling' || status === 'summarizing'

  return (
    <div className="flex items-center gap-2 shrink-0">
      {message && (
        <span className={`text-[11px] font-medium ${
          status === 'error' ? 'text-red-500' :
          status === 'done'  ? 'text-green-600' :
          'text-[#5f6368]'
        }`}>
          {message}
        </span>
      )}
      <button
        onClick={run}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border ${
          loading
            ? 'bg-[#f1f3f4] text-[#9aa0a6] border-transparent cursor-not-allowed'
            : 'bg-white text-[#1a73e8] border-[#dadce0] hover:bg-[#f0f6ff] hover:border-[#1a73e8]/40'
        }`}
      >
        {loading ? (
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
          </svg>
        )}
        {loading ? '처리 중' : '지금 수집'}
      </button>
    </div>
  )
}
