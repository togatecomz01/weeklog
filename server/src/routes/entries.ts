import { Router } from 'express'
import sql from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// 내 업무일지 목록 조회 (user)
router.get('/me', requireAuth, requireRole('user'), async (req, res) => {
  const limit  = Math.min(Number(req.query.limit)  || 3, 50)
  const offset = Number(req.query.offset) || 0

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count FROM entries WHERE user_id = ${req.user!.id}
  `
  const entries = await sql`
    SELECT id, week_year, week_month, week_number, priority,
           department, title, completed_work, ongoing_work,
           next_week_plan, notes, sent_done, sent_doing, sent_todo,
           created_at, updated_at
    FROM entries
    WHERE user_id = ${req.user!.id}
    ORDER BY week_year DESC, week_month DESC, week_number DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  res.json({ entries, total: count })
})

// 전체 업무일지 목록 조회 (admin)
router.get('/', requireAuth, requireRole('admin'), async (_req, res) => {
  const entries = await sql`
    SELECT e.id, e.week_year, e.week_month, e.week_number, e.priority,
    e.next_week_plan, e.notes, e.created_at, e.updated_at,
           u.id AS user_id, u.name AS user_name, u.email AS user_email
    FROM entries e
    JOIN users u ON u.id = e.user_id
    ORDER BY e.week_year DESC, e.week_month DESC, e.week_number DESC, u.name
  `
  res.json(entries)
})

// 특정 업무일지 조회
router.get('/:id', requireAuth, async (req, res) => {
  const [entry] = await sql`
    SELECT e.id, e.week_year, e.week_month, e.week_number, e.priority,
           e.department, e.title, e.completed_work, e.ongoing_work,
           e.next_week_plan, e.notes, e.sent_done, e.sent_doing, e.sent_todo,
           e.created_at, e.updated_at,
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

// 업무일지 작성 (user only)
router.post('/', requireAuth, requireRole('user'), async (req, res) => {
  const { week_year, week_month, week_number, priority, department, title,
          completed_work, ongoing_work, next_week_plan, notes } = req.body

  if (!week_year || !week_month || !week_number || !priority || !department || !title) {
    res.status(400).json({ message: '필수 항목을 모두 입력해주세요.' })
    return
  }

  try {
    const [entry] = await sql`
      INSERT INTO entries
        (user_id, week_year, week_month, week_number, priority, department, title,
         completed_work, ongoing_work, next_week_plan, notes)
      VALUES
        (${req.user!.id}, ${week_year}, ${week_month}, ${week_number}, ${priority},
         ${department}, ${title}, ${completed_work ?? ''}, ${ongoing_work ?? ''},
         ${next_week_plan ?? ''}, ${notes ?? ''})
      RETURNING id
    `
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
      priority       = COALESCE(${priority}, priority),
      department     = COALESCE(${department}, department),
      title          = COALESCE(${title}, title),
      completed_work = COALESCE(${completed_work}, completed_work),
      ongoing_work   = COALESCE(${ongoing_work}, ongoing_work),
      next_week_plan = COALESCE(${next_week_plan}, next_week_plan),
      notes          = COALESCE(${notes}, notes),
      updated_at     = NOW()
    WHERE id = ${req.params.id}
  `
  res.json({ message: '수정되었습니다.' })
})

export default router
