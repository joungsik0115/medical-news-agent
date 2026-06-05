'use client'

import { useState } from 'react'

type Status = 'idle' | 'crawling' | 'summarizing' | 'done' | 'error'

export default function CrawlButton() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const run = async () => {
    try {
      setStatus('crawling')
      setMessage('27개 소스 수집 중...')

      const crawlRes = await fetch('/api/crawl')
      const crawlData = await crawlRes.json()
      if (!crawlRes.ok) throw new Error(crawlData.error)

      setStatus('summarizing')
      setMessage(`${crawlData.totalInserted}개 수집 완료. AI 요약 중...`)

      const sumRes = await fetch('/api/summarize')
      const sumData = await sumRes.json()
      if (!sumRes.ok) throw new Error(sumData.error)

      setStatus('done')
      setMessage(`${crawlData.totalInserted}개 수집 · ${sumData.summarized}개 요약`)
      setTimeout(() => { setStatus('idle'); setMessage('') }, 6000)
      window.location.reload()
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : '오류 발생')
      setTimeout(() => { setStatus('idle'); setMessage('') }, 6000)
    }
  }

  const loading = status === 'crawling' || status === 'summarizing'

  return (
    <div className="flex items-center gap-3 shrink-0">
      <button
        onClick={run}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
          loading
            ? 'bg-[#f1f3f4] text-[#9aa0a6] cursor-not-allowed'
            : 'bg-[#1a73e8] text-white hover:bg-[#1557b0] active:bg-[#0d47a1] shadow-sm hover:shadow-md'
        }`}
        style={loading ? {} : { boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)' }}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
          </svg>
        )}
        {loading ? '처리 중...' : '지금 수집'}
      </button>

      {message && (
        <span className={`text-xs font-medium ${
          status === 'error' ? 'text-red-500' :
          status === 'done'  ? 'text-green-600' :
          'text-[#5f6368]'
        }`}>
          {message}
        </span>
      )}
    </div>
  )
}
