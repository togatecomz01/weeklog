import { Router, type Response } from 'express'
import jwt from 'jsonwebtoken'
import { requireAuth } from '../middleware/auth.js'
import sql from '../db.js'

const router = Router()

const SWIT_API = 'https://openapi.swit.io/v1/api'
const SWIT_TOKEN_URL = 'https://openapi.swit.io/oauth/token'

// 만료 이 시간 전부터는 미리 갱신한다
const REFRESH_MARGIN_MS = 5 * 60 * 1000

// 동시 요청이 동시에 갱신을 시도하지 않도록 유저별 진행 중인 갱신을 공유
const refreshInFlight = new Map<number, Promise<string>>()

async function saveToken(
  userId: number,
  accessToken: string,
  refreshToken: string | null,
  expiresInSec: number | null,
  switUserId: string | null = null,
) {
  const expiresAt = expiresInSec ? new Date(Date.now() + expiresInSec * 1000) : null
  await sql`
    INSERT INTO swit_tokens (user_id, access_token, refresh_token, expires_at, swit_user_id)
    VALUES (${userId}, ${accessToken}, ${refreshToken}, ${expiresAt}, ${switUserId})
    ON CONFLICT (user_id) DO UPDATE
      SET access_token = EXCLUDED.access_token,
          refresh_token = EXCLUDED.refresh_token,
          expires_at = EXCLUDED.expires_at,
          swit_user_id = COALESCE(EXCLUDED.swit_user_id, swit_tokens.swit_user_id),
          connected_at = NOW()
  `
}

async function refreshAccessToken(userId: number, refreshToken: string): Promise<string> {
  const resp = await fetch(SWIT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.SWIT_CLIENT_ID!,
      client_secret: process.env.SWIT_CLIENT_SECRET!,
    }),
  })

  const data = await resp.json()
  if (!resp.ok) {
    throw new Error(data.message ?? 'Swit 토큰 갱신 실패')
  }

  // Swit이 refresh_token을 새로 안 내려주면 기존 것을 계속 사용
  await saveToken(userId, data.access_token, data.refresh_token ?? refreshToken, data.expires_in ?? null)
  return data.access_token
}

// OAuth 인가 URL로 리다이렉트 — JWT를 query param으로 받아 user_id를 state에 담음
router.get('/connect', (req, res) => {
  const { token } = req.query
  if (!token) {
    res.status(401).send('token 파라미터가 필요합니다.')
    return
  }

  let userId: number
  try {
    const payload = jwt.verify(String(token), process.env.JWT_SECRET!) as { id: number }
    userId = payload.id
  } catch {
    res.status(401).send('유효하지 않은 토큰입니다.')
    return
  }

  if (!process.env.SWIT_CLIENT_ID || !process.env.SWIT_REDIRECT_URI) {
    res.status(503).send('SWIT_CLIENT_ID 또는 SWIT_REDIRECT_URI가 .env에 없습니다.')
    return
  }

  const params = new URLSearchParams({
    client_id: process.env.SWIT_CLIENT_ID,
    redirect_uri: process.env.SWIT_REDIRECT_URI,
    response_type: 'code',
    scope: 'task:write task:read project:read user:read',
    state: String(userId),
  })
  res.redirect(`https://openapi.swit.io/oauth/authorize?${params}`)
})

// OAuth 콜백 — code를 access_token으로 교환 후 DB에 유저별로 저장
router.get('/callback', async (req, res) => {
  const { code, state } = req.query

  if (!code || !state) {
    res.status(400).send('code 또는 state가 없습니다.')
    return
  }

  const userId = Number(state)
  if (!userId) {
    res.status(400).send('state에 유효한 user_id가 없습니다.')
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
    res.status(500).send(`토큰 교환 실패: ${data.message ?? resp.status}`)
    return
  }

  const userResp = await fetch(`${SWIT_API}/user.info`, {
    headers: { Authorization: `Bearer ${data.access_token}` },
  })
  const userData = await userResp.json()
  const switUserId: string | null = userData?.data?.user?.id ?? null

  await saveToken(userId, data.access_token, data.refresh_token ?? null, data.expires_in ?? null, switUserId)

  const clientBase = process.env.CLIENT_ORIGIN ?? ''
  res.redirect(`${clientBase}/my/swit?swit=connected`)
})

// 현재 유저의 Swit 연결 상태 확인
router.get('/status', requireAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT 1 FROM swit_tokens WHERE user_id = ${req.user!.id}`
    res.json({ connected: rows.length > 0 })
  } catch {
    res.json({ connected: false })
  }
})

// 연결 해제
router.delete('/disconnect', requireAuth, async (req, res) => {
  await sql`DELETE FROM swit_tokens WHERE user_id = ${req.user!.id}`
  res.json({ message: '연결이 해제되었습니다.' })
})

type SwitTokenResult =
  | { ok: true; accessToken: string; switUserId: string | null }
  | { ok: false; reason: 'not_connected' | 'expired' }

const SWIT_AUTH_MESSAGE: Record<'not_connected' | 'expired', string> = {
  not_connected: 'Swit 계정이 연결되어 있지 않습니다.',
  expired: 'Swit 연결이 만료되었습니다. 다시 연결해 주세요.',
}

function sendSwitAuthError(res: Response, reason: 'not_connected' | 'expired') {
  res.status(403).json({ message: SWIT_AUTH_MESSAGE[reason], reason })
}

// 현재 유저의 swit_token을 DB에서 가져오는 헬퍼 — 만료가 임박했으면 미리 갱신한다
async function getUserToken(userId: number): Promise<SwitTokenResult> {
  const rows = await sql<{ access_token: string; refresh_token: string | null; expires_at: Date | null; swit_user_id: string | null }[]>`
    SELECT access_token, refresh_token, expires_at, swit_user_id FROM swit_tokens WHERE user_id = ${userId}
  `
  const row = rows[0]
  if (!row) return { ok: false, reason: 'not_connected' }

  const expiresSoon = row.expires_at ? row.expires_at.getTime() - Date.now() < REFRESH_MARGIN_MS : false
  if (!expiresSoon || !row.refresh_token) {
    return { ok: true, accessToken: row.access_token, switUserId: row.swit_user_id }
  }

  let pending = refreshInFlight.get(userId)
  if (!pending) {
    pending = refreshAccessToken(userId, row.refresh_token).finally(() => {
      refreshInFlight.delete(userId)
    })
    refreshInFlight.set(userId, pending)
  }
  try {
    const accessToken = await pending
    return { ok: true, accessToken, switUserId: row.swit_user_id }
  } catch (err) {
    console.error('[swit] 토큰 갱신 실패:', err)
    return { ok: false, reason: 'expired' }
  }
}

// 프로젝트 내 태스크에서 status_id 목록 추출
router.get('/status-ids', requireAuth, async (req, res) => {
  const token = await getUserToken(req.user!.id)
  const projectId = String(req.query.project_id ?? '')
  if (!token.ok) {
    sendSwitAuthError(res, token.reason)
    return
  }
  if (!projectId) {
    res.status(400).json({ message: 'project_id가 없습니다.' })
    return
  }

  const resp = await fetch(`${SWIT_API}/task.list?project_id=${projectId}&limit=100`, {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  })
  const text = await resp.text()
  console.log('[swit/status-ids] task.list:', text.slice(0, 800))
  try {
    const data = JSON.parse(text)
    const tasks = data?.data?.tasks ?? data?.data?.task ?? []
    const seen = new Map<string, object>()
    for (const t of tasks) {
      const sc = t.status_custom
      if (sc?.status_id && !seen.has(sc.status_id)) seen.set(sc.status_id, sc)
    }
    res.json([...seen.values()])
  } catch {
    res.status(502).json({ message: 'task.list 파싱 실패', raw: text.slice(0, 200) })
  }
})

// 스윗 프로젝트 목록 조회
router.get('/projects', requireAuth, async (req, res) => {
  const token = await getUserToken(req.user!.id)
  if (!token.ok) {
    sendSwitAuthError(res, token.reason)
    return
  }

  const workspaceId = process.env.SWIT_WORKSPACE_ID
  if (!workspaceId) {
    res.status(503).json({ message: 'SWIT_WORKSPACE_ID가 .env에 없습니다.' })
    return
  }

  const resp = await fetch(`${SWIT_API}/project.list?workspace_id=${workspaceId}&limit=100`, {
    headers: { Authorization: `Bearer ${token.accessToken}` },
  })
  const text = await resp.text()
  console.log('[swit/projects] project.list:', text.slice(0, 500))

  if (!resp.ok) {
    res.status(502).json({ message: `프로젝트 목록 오류 (${resp.status})` })
    return
  }

  const data = JSON.parse(text)
  if (data.code && data.code !== 200) {
    res.status(502).json({ message: data.message ?? '프로젝트 목록을 가져올 수 없습니다.' })
    return
  }

  const projects = (data.data?.projects ?? data.data?.project ?? [])
    .map((p: any) => ({ id: p.id, name: p.name }))

  res.json(projects)
})

// 스윗 태스크 전송
router.post('/send', requireAuth, async (req, res) => {
  const { title, items, status, entry_id, project_id } = req.body

  if (!items?.length) {
    res.status(400).json({ message: '보낼 항목이 없습니다.' })
    return
  }

  const token = await getUserToken(req.user!.id)
  if (!token.ok) {
    sendSwitAuthError(res, token.reason)
    return
  }

  const defaultChannelId = process.env.SWIT_CHANNEL_ID ?? process.env.SWIT_PROJECT_ID
  const channelId = project_id ?? defaultChannelId
  if (!channelId) {
    res.status(503).json({ message: 'Swit 연동이 설정되지 않았습니다.' })
    return
  }

  const statusLabel: Record<string, string> = {
    done: '금주 완료 업무',
    doing: '진행 업무',
    todo: '차주 예정 업무',
  }

  const switStatus: Record<string, string> = {
    done: 'Done',
    doing: 'Doing',
    todo: 'ToDo',
  }

  const switPriority: Record<string, string> = {
    '보통': 'Normal',
    '높음': 'High',
    '매우 높음': 'Highest',
  }

  const eid = Number(entry_id)
  let priority: string | undefined
  if (eid) {
    const [row] = await sql<{ priority: string }[]>`
      SELECT priority FROM entries WHERE id = ${eid} AND user_id = ${req.user!.id}
    `
    priority = row ? switPriority[row.priority] : undefined
  }

  const { accessToken, switUserId } = token
  const assignFollow = switUserId
    ? { assign: switUserId, follow: switUserId }
    : {}

  const results = await Promise.allSettled(
    (items as string[]).map((item) =>
      fetch(`${SWIT_API}/task.create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: channelId,
          title: item,
          content: `[${statusLabel[status] ?? title ?? status}] ${item}`,
          step: switStatus[status] ?? null,
          ...(priority ? { priority } : {}),
          ...assignFollow,
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

  if (eid) {
    const taskIds = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<any>).value?.data?.task?.id)
      .filter(Boolean) as string[]

    if (taskIds.length > 0) {
      await Promise.all(
        taskIds.map((taskId) => sql`INSERT INTO swit_tasks (entry_id, task_id) VALUES (${eid}, ${taskId})`)
      )
    }
  }

  if (eid) {
    let result
    if (status === 'done') {
      result = await sql`UPDATE entries SET sent_done = TRUE WHERE id = ${eid} AND user_id = ${req.user!.id}`
    } else if (status === 'doing') {
      result = await sql`UPDATE entries SET sent_doing = TRUE WHERE id = ${eid} AND user_id = ${req.user!.id}`
    } else if (status === 'todo') {
      result = await sql`UPDATE entries SET sent_todo = TRUE WHERE id = ${eid} AND user_id = ${req.user!.id}`
    }
    console.log(`[swit/send] eid=${eid} uid=${req.user!.id}(${typeof req.user!.id}) status=${status} affected=${result?.count}`)
  }

  res.json({ message: '전송 완료', count: items.length })
})

export default router
