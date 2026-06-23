import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sql from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' })
    return
  }

  const [user] = await sql`
    SELECT id, email, name, role, department, password_hash
    FROM users
    WHERE email = ${email}
  `

  if (!user) {
    res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    return
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    return
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
  })
})

router.post('/reset-password', async (req, res) => {
  const { email } = req.body
  if (!email) {
    res.status(400).json({ message: '이메일을 입력해주세요.' })
    return
  }

  const [user] = await sql`SELECT id FROM users WHERE email = ${email}`
  if (!user) {
    res.status(404).json({ message: '존재하지 않는 아이디입니다.' })
    return
  }

  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
  const newPassword = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')

  const hash = await bcrypt.hash(newPassword, 10)
  await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${user.id}`

  res.json({ password: newPassword })
})

router.put('/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: '현재 비밀번호와 새 비밀번호를 입력해주세요.' })
    return
  }

  const [user] = await sql`SELECT password_hash FROM users WHERE id = ${req.user!.id}`

  const valid = await bcrypt.compare(currentPassword, user.password_hash)
  if (!valid) {
    res.status(401).json({ message: '현재 비밀번호가 올바르지 않습니다.' })
    return
  }

  const hash = await bcrypt.hash(newPassword, 10)
  await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${req.user!.id}`

  res.json({ message: '비밀번호가 변경되었습니다.' })
})

export default router
