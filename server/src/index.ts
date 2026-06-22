import 'dotenv/config'
import express from 'express'
import sql from './db.js'

const app = express()
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await sql`SELECT 1`
    res.json({ status: 'ok', db: 'connected' })
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' })
  }
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
