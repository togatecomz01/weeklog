import { Router } from 'express'
import sql from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, requireRole('admin'), async (_req, res) => {
  const users = await sql`
    SELECT id, name, email, department, position, role, is_active, created_at
    FROM users
    ORDER BY name ASC, id ASC
  `

  res.json(users)
})

router.get('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const userId = Number(req.params.id)
  if (!Number.isInteger(userId) || userId < 1) {
    res.status(400).json({ message: '사용자 ID가 올바르지 않습니다.' })
    return
  }

  const [user] = await sql`
    SELECT id, name, email, department, position, role, is_active, created_at
    FROM users
    WHERE id = ${userId}
  `

  if (!user) {
    res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    return
  }

  res.json(user)
})

router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const role = req.body.role
  const department = typeof req.body.department === 'string' ? req.body.department.trim() : null
  const isActive = req.body.is_active

  if (!['user', 'admin'].includes(role) || department === null || typeof isActive !== 'boolean') {
    res.status(400).json({ message: '사용자 정보가 올바르지 않습니다.' })
    return
  }

  const userId = Number(req.params.id)
  if (!Number.isInteger(userId) || userId < 1) {
    res.status(400).json({ message: '사용자 ID가 올바르지 않습니다.' })
    return
  }

  if (userId === req.user!.id && (role !== 'admin' || !isActive)) {
    res.status(400).json({ message: '현재 로그인한 관리자 계정의 권한이나 상태는 변경할 수 없습니다.' })
    return
  }

  const [user] = await sql`
    UPDATE users
    SET department = ${department},
        role = ${role},
        is_active = ${isActive}
    WHERE id = ${userId}
    RETURNING id, name, email, department, position, role, is_active, created_at
  `

  if (!user) {
    res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    return
  }

  res.json(user)
})

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const userId = Number(req.params.id)
  if (!Number.isInteger(userId) || userId < 1) {
    res.status(400).json({ message: '사용자 ID가 올바르지 않습니다.' })
    return
  }

  if (userId === req.user!.id) {
    res.status(400).json({ message: '현재 로그인한 관리자 계정은 삭제할 수 없습니다.' })
    return
  }

  const deleted = await sql.begin(async (tx) => {
    await tx`UPDATE entries SET confirmed_by = NULL WHERE confirmed_by = ${userId}`
    const [user] = await tx`
      DELETE FROM users
      WHERE id = ${userId}
      RETURNING id
    `
    return user
  })

  if (!deleted) {
    res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    return
  }

  res.json({ message: '계정이 삭제되었습니다.' })
})

export default router
