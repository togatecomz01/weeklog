import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sql from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = path.resolve(__dirname, '../migrations')

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      id          SERIAL PRIMARY KEY,
      filename    VARCHAR(255) UNIQUE NOT NULL,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  const applied = await sql<{ filename: string }[]>`SELECT filename FROM _migrations`
  const appliedSet = new Set(applied.map((r) => r.filename))

  const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort()

  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`skip  ${file}`)
      continue
    }

    const content = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8')

    await sql.begin(async (tx) => {
      await tx.unsafe(content)
      await tx`INSERT INTO _migrations (filename) VALUES (${file})`
    })

    console.log(`done  ${file}`)
  }

  console.log('migrations complete.')
  await sql.end()
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
