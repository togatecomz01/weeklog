import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import sql from '../db.js'

const router = Router()

const SWIT_API = 'https://openapi.swit.io/v1/api'
const SWIT_TOKEN_URL = 'https://openapi.swit.io/oauth/token'

// OAuth 인가 URL로 리다이렉트
router.get('/connect', (_req, res) => {
  if (!process.env.SWIT_CLIENT_ID || !process.env.SWIT_REDIRECT_URI) {
    res.status(503).send('SWIT_CLIENT_ID 또는 SWIT_REDIRECT_URI가 .env에 없습니다.')
    return
  }
  const params = new URLSearchParams({
    client_id: process.env.SWIT_CLIENT_ID,
    redirect_uri: process.env.SWIT_REDIRECT_URI,
    response_type: 'code',
    scope: 'task:write',
  })
  res.redirect(`https://openapi.swit.io/oauth/authorize?${params}`)
})

// OAuth 콜백 — code를 access_token으로 교환
router.get('/callback', async (req, res) => {
  const { code } = req.query
  if (!code) {
    res.status(400).json({ message: 'code가 없습니다.' })
    return
  }

  const resp = await fetch(SWIT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: String(code),
      client_id: process.env.SWIT_CLIENT_ID!,
      client_secret: process.env.SWIT_CLIENT_SECRET!,
      redirect_uri: process.env.SWIT_REDIRECT_URI!,
    }),
  })

  const data = await resp.json()
  if (!resp.ok) {
    res.status(500).json({ message: 'token 교환 실패', detail: data })
    return
  }

  // 발급된 access_token을 콘솔에 출력 — .env에 SWIT_ACCESS_TOKEN으로 저장할 것
  console.log('\n=== SWIT ACCESS TOKEN ===')
  console.log(data.access_token)
  console.log('========================\n')

  res.send('<p>토큰 발급 완료. 서버 콘솔에서 토큰을 복사해 .env에 저장하세요.</p>')
})

// 스윗 태스크 전송
router.post('/send', requireAuth, async (req, res) => {
  const { title, items, status, entry_id } = req.body

  if (!items?.length) {
    res.status(400).json({ message: '보낼 항목이 없습니다.' })
    return
  }

  const token = process.env.SWIT_ACCESS_TOKEN
  const channelId = process.env.SWIT_CHANNEL_ID ?? process.env.SWIT_PROJECT_ID

  if (!token || !channelId) {
    res.status(503).json({ message: 'Swit 연동이 설정되지 않았습니다.' })
    return
  }

  const statusLabel: Record<string, string> = {
    done: '금주 완료 업무',
    doing: '진행 업무',
    todo: '차주 예정 업무',
  }

  const results = await Promise.allSettled(
    (items as string[]).map((item) =>
      fetch(`${SWIT_API}/task.create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: channelId,
          title: item,
          content: `[${statusLabel[status] ?? title ?? status}] ${item}`,
        }),
      }).then(async (r) => {
        const data = await r.json()
        if (data.code && data.code !== 200) throw new Error(data.message)
        return data
      })
    )
  )

  const failed = results.filter((r) => r.status === 'rejected')
  if (failed.length > 0) {
    const reason = (failed[0] as PromiseRejectedResult).reason?.message
    res.status(500).json({ message: reason ?? `${failed.length}개 항목 전송 실패` })
    return
  }

  // DB에 전송 상태 업데이트
  if (entry_id && ['done', 'doing', 'todo'].includes(status)) {
    const col = `sent_${status}` as 'sent_done' | 'sent_doing' | 'sent_todo'
    await sql`UPDATE entries SET ${sql(col)} = TRUE WHERE id = ${entry_id} AND user_id = ${req.user!.id}`
  }

  res.json({ message: '전송 완료', count: items.length })
})

export default router
