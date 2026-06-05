import axios from 'axios'
import type { TopicCategory } from '@/types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function summarizeToKorean(
  title: string,
  content: string,
  language: 'en' | 'ko' = 'en'
): Promise<string> {
  const sourceDesc = language === 'ko' ? '한국어' : '영어'
  const prompt = `다음 ${sourceDesc} 의료/건강 뉴스를 한국어로 3줄로 요약하세요. 각 줄은 핵심 내용, 의학적 의미, 실생활 영향을 담아야 합니다.

제목: ${title}
내용: ${content.slice(0, 3000)}

3줄 요약 (각 줄을 • 로 시작):
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
        'X-Title': 'Medical News Agent',
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  )

  const text = response.data.choices[0]?.message?.content?.trim() ?? ''
  // Ensure bullet prefix
  return text.startsWith('•') ? text : `• ${text}`
}

export function classifyTopic(title: string, content: string): TopicCategory {
  const text = (title + ' ' + content).toLowerCase()

  if (
    /artificial intelligence|machine learning|deep learning|\bai\b|llm|gpt|neural network|algorithm|clinical decision/.test(text) ||
    /의료\s*ai|인공지능|딥러닝|머신러닝/.test(text)
  ) return 'medical_ai'

  if (
    /korea|korean|seoul|부산|서울|한국|병원|의원|복지부|질병관리/.test(text)
  ) return 'korea_hospital'

  if (
    /disease|virus|outbreak|infection|pandemic|epidemic|cancer|vaccine|pathogen|syndrome|bacteria|fungal|mortality|morbidity/.test(text) ||
    /질병|바이러스|감염|팬데믹|암|백신|발병/.test(text)
  ) return 'disease'

  return 'general'
}
