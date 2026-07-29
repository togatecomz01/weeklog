import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import sql from '../db.js'

interface JwtPayload {
  id: number
  email: string
  role: string
  name?: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ message: '인증이 필요합니다.' })
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    const [user] = await sql`
      SELECT id, email, role, name, is_active
      FROM users
      WHERE id = ${payload.id}
    `

    if (!user || !user.is_active) {
      res.status(401).json({ message: '비활성화되었거나 존재하지 않는 계정입니다.' })
      return
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }
    next()
  } catch {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: '권한이 없습니다.' })
      return
    }
    next()
  }
}
