import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  id: number
  email: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ message: '인증이 필요합니다.' })
    return
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
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
