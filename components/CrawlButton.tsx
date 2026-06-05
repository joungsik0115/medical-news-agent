'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

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
      setMessage(`완료: ${crawlData.totalInserted}개 수집, ${sumData.summarized}개 요약`)
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
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={run} disabled={loading}>
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {loading ? '처리 중...' : '지금 수집'}
      </Button>
      {message && (
        <span className={`text-xs ${status === 'error' ? 'text-destructive' : status === 'done' ? 'text-green-600' : 'text-muted-foreground'}`}>
          {message}
        </span>
      )}
    </div>
  )
}
