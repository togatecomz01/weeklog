import 'dotenv/config'
import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import sql from './db.js'
import authRouter from './routes/auth.js'
import entriesRouter from './routes/entries.js'
import switRouter from './routes/swit.js'
import draftsRouter from './routes/drafts.js'
import kakaoRouter from './routes/kakao.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, '../../dist')

const app = express()
const PORT = Number(process.env.PORT) || 3000
const isDev = process.env.NODE_ENV !== 'production'

if (isDev) {
  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))
}
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/entries', entriesRouter)
app.use('/api/swit', switRouter)
app.use('/api/drafts', draftsRouter)
app.use('/api/kakao', kakaoRouter)

app.get('/api/health', async (_req, res) => {
  try {
    await sql`SELECT 1`
    res.json({ status: 'ok', db: 'connected' })
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' })
  }
})

if (!isDev) {
  app.use(express.static(DIST_DIR))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

// 라우트 핸들러에서 처리되지 않은 에러를 여기서 잡아 요청 하나만 500으로 응답하고, 서버 프로세스는 죽지 않게 한다
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[unhandled]', err)
  if (res.headersSent) return
  res.status(500).json({ message: '서버 오류가 발생했습니다.' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
