import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sql from '../db.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' })
    return
  }

  const [user] = await sql`
    SELECT id, email, name, role, password_hash
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
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
})

export default router
