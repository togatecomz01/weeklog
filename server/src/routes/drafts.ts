import { Router } from 'express'
import sql from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// 내 임시저장 조회
router.get('/', requireAuth, requireRole('user'), async (req, res) => {
  const [draft] = await sql`
    SELECT id, write_date, title, priority, completed_work, ongoing_work,
           next_week_plan, notes, saved_at
    FROM drafts
    WHERE user_id = ${req.user!.id}
  `
  res.json(draft ?? null)
})

// 임시저장 (upsert)
router.post('/', requireAuth, requireRole('user'), async (req, res) => {
  const { write_date, title, priority, completed_work, ongoing_work, next_week_plan, notes } = req.body

  const [draft] = await sql`
    INSERT INTO drafts (user_id, write_date, title, priority, completed_work, ongoing_work, next_week_plan, notes, saved_at)
    VALUES (
      ${req.user!.id},
      ${write_date ?? null},
      ${title ?? ''},
      ${priority ?? '보통'},
      ${completed_work ?? ''},
      ${ongoing_work ?? ''},
      ${next_week_plan ?? ''},
      ${notes ?? ''},
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      write_date     = EXCLUDED.write_date,
      title          = EXCLUDED.title,
      priority       = EXCLUDED.priority,
      completed_work = EXCLUDED.completed_work,
      ongoing_work   = EXCLUDED.ongoing_work,
      next_week_plan = EXCLUDED.next_week_plan,
      notes          = EXCLUDED.notes,
      saved_at       = NOW()
    RETURNING id, saved_at
  `
  res.json(draft)
})

// 임시저장 삭제 (등록 완료 후 호출)
router.delete('/', requireAuth, requireRole('user'), async (req, res) => {
  await sql`DELETE FROM drafts WHERE user_id = ${req.user!.id}`
  res.json({ message: '임시저장이 삭제되었습니다.' })
})

export default router
