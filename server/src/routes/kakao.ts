import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize'
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token'
const KAKAO_SEND_URL = 'https://kapi.kakao.com/v2/api/talk/memo/default/send'

// OAuth 인가 URL로 리다이렉트
router.get('/connect', (_req, res) => {
  const clientId = process.env.KAKAO_REST_API_KEY
  const redirectUri = process.env.KAKAO_REDIRECT_URI
  if (!clientId || !redirectUri) {
    res.status(503).send('KAKAO_REST_API_KEY 또는 KAKAO_REDIRECT_URI가 .env에 없습니다.')
    return
  }
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'talk_message',
  })
  res.redirect(`${KAKAO_AUTH_URL}?${params}`)
})

// OAuth 콜백 — code를 access_token으로 교환
router.get('/callback', async (req, res) => {
  const { code } = req.query
  if (!code) {
    res.status(400).send('code가 없습니다.')
    return
  }

  const tokenParams: Record<string, string> = {
    grant_type: 'authorization_code',
    client_id: process.env.KAKAO_REST_API_KEY!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    code: String(code),
  }
  if (process.env.KAKAO_CLIENT_SECRET) {
    tokenParams.client_secret = process.env.KAKAO_CLIENT_SECRET
  }

  const resp = await fetch(KAKAO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(tokenParams),
  })

  const data = await resp.json()
  if (!resp.ok) {
    res.status(500).json({ message: '토큰 교환 실패', detail: data })
    return
  }

  console.log('\n=== KAKAO ACCESS TOKEN ===')
  console.log(data.access_token)
  console.log('========================\n')
  console.log('위 토큰을 .env의 KAKAO_ACCESS_TOKEN에 저장하세요.')

  res.send('<p>카카오 토큰 발급 완료. 서버 콘솔에서 토큰을 복사해 .env에 저장하세요.</p>')
})

// 나에게 보내기 테스트 (수동 확인용)
router.post('/test', requireAuth, async (_req, res) => {
  const result = await sendKakaoUrgentMessage('테스트 메시지입니다.')
  if (result.ok) {
    res.json({ message: '전송 완료' })
  } else {
    res.status(500).json({ message: result.error })
  }
})

export async function sendKakaoUrgentMessage(text: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.KAKAO_ACCESS_TOKEN
  if (!token) return { ok: false, error: 'KAKAO_ACCESS_TOKEN이 설정되지 않았습니다.' }

  const templateObject = JSON.stringify({
    object_type: 'text',
    text,
    link: { web_url: '', mobile_web_url: '' },
  })

  const resp = await fetch(KAKAO_SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ template_object: templateObject }),
  })

  const data = await resp.json()
  if (!resp.ok || (data.result_code !== undefined && data.result_code !== 0)) {
    console.error('[kakao] 전송 실패:', data)
    return { ok: false, error: data.msg ?? '카카오 메시지 전송 실패' }
  }

  console.log('[kakao] 나에게 보내기 성공')
  return { ok: true }
}

export default router
