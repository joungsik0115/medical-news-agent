import axios from 'axios'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function summarizeToKorean(
  title: string,
  content: string
): Promise<string> {
  const prompt = `다음 의료/병원/AI 뉴스를 핵심만 3줄로 한국어 요약하세요.
각 줄은 • 으로 시작하고, 1) 핵심 사실 2) 시사점 3) 시장/병원 영향 순으로 작성하세요.
간결하고 명확하게, 군더더기 없이 작성하세요.

제목: ${title}
내용: ${content.slice(0, 3000)}

3줄 요약:
•`

  const response = await axios.post(
    OPENROUTER_API_URL,
    {
      model: 'openrouter/auto',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://medical-news-agent.vercel.app',
        'X-Title': '좋은문화 인총쌤의 뉴스 에이전트',
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  )

  const text = response.data.choices[0]?.message?.content?.trim() ?? ''
  return text.startsWith('•') ? text : `• ${text}`
}
