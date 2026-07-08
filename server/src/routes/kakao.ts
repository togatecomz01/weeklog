import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import sql from '../db.js'

const router = Router()

const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize'
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token'
const KAKAO_SEND_URL = 'https://kapi.kakao.com/v2/api/talk/memo/default/send'

// 만료 이 시간 전부터는 미리 갱신한다
const REFRESH_MARGIN_MS = 5 * 60 * 1000

// 동시 요청이 동시에 갱신을 시도하지 않도록 진행 중인 갱신을 공유
let refreshInFlight: Promise<string> | null = null

async function saveToken(accessToken: string, refreshToken: string, expiresInSec: number) {
  const expiresAt = new Date(Date.now() + expiresInSec * 1000)
  await sql`
    INSERT INTO kakao_token (id, access_token, refresh_token, expires_at, updated_at)
    VALUES (1, ${accessToken}, ${refreshToken}, ${expiresAt}, NOW())
    ON CONFLICT (id) DO UPDATE
      SET access_token = EXCLUDED.access_token,
          refresh_token = EXCLUDED.refresh_token,
          expires_at = EXCLUDED.expires_at,
          updated_at = NOW()
  `
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const params: Record<string, string> = {
    grant_type: 'refresh_token',
    client_id: process.env.KAKAO_REST_API_KEY!,
    refresh_token: refreshToken,
  }
  if (process.env.KAKAO_CLIENT_SECRET) {
    params.client_secret = process.env.KAKAO_CLIENT_SECRET
  }

  const resp = await fetch(KAKAO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  })

  const data = await resp.json()
  if (!resp.ok) {
    throw new Error(data.error_description ?? '카카오 토큰 갱신 실패')
  }

  // 카카오는 refresh_token 만료가 임박한 경우에만 새 refresh_token을 내려준다
  await saveToken(data.access_token, data.refresh_token ?? refreshToken, data.expires_in)
  return data.access_token
}

// DB에 저장된 토큰을 반환하며, 만료가 임박했으면 미리 갱신한다
async function getAccessToken(): Promise<string | null> {
  const rows = await sql<{ access_token: string; refresh_token: string; expires_at: Date }[]>`
    SELECT access_token, refresh_token, expires_at FROM kakao_token WHERE id = 1
  `
  const row = rows[0]
  if (!row) return null

  const expiresSoon = row.expires_at.getTime() - Date.now() < REFRESH_MARGIN_MS
  if (!expiresSoon) return row.access_token

  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken(row.refresh_token).finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

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

  await saveToken(data.access_token, data.refresh_token, data.expires_in)

  res.send('<p>카카오 계정 연결 완료. 이후 토큰은 자동으로 갱신됩니다.</p>')
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
  let token: string | null
  try {
    token = await getAccessToken()
  } catch (err) {
    console.error('[kakao] 토큰 갱신 실패:', err)
    return { ok: false, error: err instanceof Error ? err.message : '카카오 토큰 갱신 실패' }
  }
  if (!token) return { ok: false, error: '카카오 계정이 연결되지 않았습니다. /api/kakao/connect로 연결하세요.' }

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
