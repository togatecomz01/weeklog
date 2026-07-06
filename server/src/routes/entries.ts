import { Router } from 'express'
import sql from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { sendKakaoUrgentMessage } from './kakao.js'

const router = Router()

// 내 업무일지 목록 조회 (user)
router.get('/me', requireAuth, requireRole('user'), async (req, res) => {
  const limit    = Math.min(Number(req.query.limit) || 3, 50)
  const offset   = Number(req.query.offset) || 0
  const priority = typeof req.query.priority === 'string' && req.query.priority ? req.query.priority : null

  const priorityFilter = priority ? sql`AND priority = ${priority}` : sql``

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count FROM entries WHERE user_id = ${req.user!.id} ${priorityFilter}
  `
  const entries = await sql`
    SELECT id, week_year, week_month, week_number, priority,
           department, title, completed_work, ongoing_work,
           next_week_plan, notes, sent_done, sent_doing, sent_todo,
           write_date, created_at, updated_at
    FROM entries
    WHERE user_id = ${req.user!.id} ${priorityFilter}
    ORDER BY week_year DESC, week_month DESC, week_number DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  res.json({ entries, total: count })
})

// 주차별 제출/확인 현황 요약 (admin)
router.get('/admin/weeks', requireAuth, requireRole('admin'), async (_req, res) => {
  const rows = await sql`
    SELECT
      e.week_year,
      e.week_month,
      e.week_number,
      COUNT(DISTINCT e.user_id)::int                                             AS entry_count,
      COUNT(DISTINCT CASE WHEN e.confirmed_at IS NOT NULL THEN e.id END)::int   AS confirmed_count,
      (SELECT COUNT(*)::int FROM users WHERE role = 'user')                      AS total_users
    FROM entries e
    GROUP BY e.week_year, e.week_month, e.week_number
    ORDER BY e.week_year DESC, e.week_month DESC, e.week_number DESC
  `
  res.json(rows)
})

// 전체 업무일지 목록 조회 (admin) — 주차 필터 선택적
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { week_year, week_month, week_number } = req.query

  if (week_year && week_month && week_number) {
    const entries = await sql`
      SELECT e.id, e.week_year, e.week_month, e.week_number, e.priority,
             e.department, e.title, e.completed_work, e.ongoing_work,
             e.next_week_plan, e.notes, e.write_date, e.created_at, e.updated_at,
             u.id AS user_id, u.name AS user_name, u.email AS user_email
      FROM entries e
      JOIN users u ON u.id = e.user_id
      WHERE e.week_year  = ${Number(week_year)}
        AND e.week_month  = ${Number(week_month)}
        AND e.week_number = ${Number(week_number)}
      ORDER BY u.name
    `
    res.json(entries)
  } else {
    const entries = await sql`
      SELECT e.id, e.week_year, e.week_month, e.week_number, e.priority,
             e.next_week_plan, e.notes, e.write_date, e.created_at, e.updated_at,
             u.id AS user_id, u.name AS user_name, u.email AS user_email
      FROM entries e
      JOIN users u ON u.id = e.user_id
      ORDER BY e.week_year DESC, e.week_month DESC, e.week_number DESC, u.name
    `
    res.json(entries)
  }
})

// 특정 업무일지 조회
router.get('/:id', requireAuth, async (req, res) => {
  const [entry] = await sql`
    SELECT e.id, e.week_year, e.week_month, e.week_number, e.priority,
           e.department, e.title, e.completed_work, e.ongoing_work,
           e.next_week_plan, e.notes, e.sent_done, e.sent_doing, e.sent_todo,
           e.confirmed_at, e.confirmed_by,
           e.write_date, e.created_at, e.updated_at,
           u.id AS user_id, u.name AS user_name
    FROM entries e
    JOIN users u ON u.id = e.user_id
    WHERE e.id = ${req.params.id}
  `

  if (!entry) {
    res.status(404).json({ message: '업무일지를 찾을 수 없습니다.' })
    return
  }

  // user는 본인 것만, admin은 전체 열람 가능
  if (req.user!.role === 'user' && entry.user_id !== req.user!.id) {
    res.status(403).json({ message: '권한이 없습니다.' })
    return
  }

  res.json(entry)
})

// 업무일지 확인 (admin only)
router.post('/:id/confirm', requireAuth, requireRole('admin'), async (req, res) => {
  const [entry] = await sql`SELECT id, confirmed_at FROM entries WHERE id = ${req.params.id}`
  if (!entry) {
    res.status(404).json({ message: '업무일지를 찾을 수 없습니다.' })
    return
  }
  if (entry.confirmed_at) {
    res.status(409).json({ message: '이미 확인된 업무일지입니다.' })
    return
  }
  await sql`
    UPDATE entries
    SET confirmed_at = NOW(), confirmed_by = ${req.user!.id}
    WHERE id = ${req.params.id}
  `
  res.json({ message: '확인 완료' })
})

// 업무일지 작성 (user only)
router.post('/', requireAuth, requireRole('user'), async (req, res) => {
  const { week_year, week_month, week_number, priority, department, title,
          completed_work, ongoing_work, next_week_plan, notes, write_date } = req.body

  if (!week_year || !week_month || !week_number || !priority || !department || !title || !write_date) {
    res.status(400).json({ message: '필수 항목을 모두 입력해주세요.' })
    return
  }

  try {
    const [entry] = await sql`
      INSERT INTO entries
        (user_id, week_year, week_month, week_number, priority, department, title,
         completed_work, ongoing_work, next_week_plan, notes, write_date)
      VALUES
        (${req.user!.id}, ${week_year}, ${week_month}, ${week_number}, ${priority},
         ${department}, ${title}, ${completed_work ?? ''}, ${ongoing_work ?? ''},
         ${next_week_plan ?? ''}, ${notes ?? ''}, ${write_date})
      RETURNING id
    `

    if (priority === '긴급') {
      const userName = req.user!.name ?? '직원'
      sendKakaoUrgentMessage(
        `[긴급] ${userName}님이 긴급 업무일지를 등록했습니다.\n제목: ${title}`
      ).catch((err) => console.error('[kakao] 긴급 알림 전송 오류:', err))
    }

    res.status(201).json({ id: entry.id })
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ message: '해당 주차 업무일지가 이미 존재합니다.' })
      return
    }
    throw err
  }
})

// 업무일지 수정 (본인 것만)
router.put('/:id', requireAuth, requireRole('user'), async (req, res) => {
  const [entry] = await sql`SELECT user_id FROM entries WHERE id = ${req.params.id}`

  if (!entry) {
    res.status(404).json({ message: '업무일지를 찾을 수 없습니다.' })
    return
  }
  if (entry.user_id !== req.user!.id) {
    res.status(403).json({ message: '권한이 없습니다.' })
    return
  }

  const { priority, department, title, completed_work, ongoing_work, next_week_plan, notes } = req.body

  await sql`
    UPDATE entries SET
      priority       = COALESCE(${priority ?? null}, priority),
      department     = COALESCE(${department ?? null}, department),
      title          = COALESCE(${title ?? null}, title),
      completed_work = COALESCE(${completed_work ?? null}, completed_work),
      ongoing_work   = COALESCE(${ongoing_work ?? null}, ongoing_work),
      next_week_plan = COALESCE(${next_week_plan ?? null}, next_week_plan),
      notes          = COALESCE(${notes ?? null}, notes),
      updated_at     = NOW()
    WHERE id = ${req.params.id}
  `
  res.json({ message: '수정되었습니다.' })
})

// 업무일지 삭제 (본인 것만)
router.delete('/:id', requireAuth, requireRole('user'), async (req, res) => {
  const [entry] = await sql`SELECT user_id FROM entries WHERE id = ${req.params.id}`

  if (!entry) {
    res.status(404).json({ message: '업무일지를 찾을 수 없습니다.' })
    return
  }
  if (entry.user_id !== req.user!.id) {
    res.status(403).json({ message: '권한이 없습니다.' })
    return
  }

  // Swit 태스크 삭제 (실패해도 업무일지 삭제는 진행)
  try {
    const tasks = await sql<{ task_id: string }[]>`
      SELECT task_id FROM swit_tasks WHERE entry_id = ${req.params.id}
    `
    if (tasks.length > 0) {
      const [tokenRow] = await sql<{ access_token: string }[]>`
        SELECT access_token FROM swit_tokens WHERE user_id = ${req.user!.id}
      `
      if (tokenRow) {
        for (const t of tasks) {
          const r = await fetch(`https://openapi.swit.io/v1/api/task.remove`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokenRow.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: t.task_id }),
          })
          if (r.status === 429) {
            await new Promise((resolve) => setTimeout(resolve, 500))
            await fetch(`https://openapi.swit.io/v1/api/task.remove`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${tokenRow.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: t.task_id }),
            })
          }
        }
      }
    }
  } catch (e) {
    console.error('[entries/delete] Swit 태스크 삭제 실패:', e)
  }

  await sql`DELETE FROM entries WHERE id = ${req.params.id}`
  res.json({ message: '삭제되었습니다.' })
})

export default router
