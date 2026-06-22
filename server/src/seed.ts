import 'dotenv/config'
import bcrypt from 'bcrypt'
import sql from './db.js'

const SEED_USERS = [
  { email: 'admin@weeklog.com', password: 'admin1234', name: '관리자', role: 'admin' },
  { email: 'user@weeklog.com',  password: 'user1234',  name: '홍길동', role: 'user' },
]

async function seed() {
  for (const u of SEED_USERS) {
    const existing = await sql`SELECT id FROM users WHERE email = ${u.email}`
    if (existing.length > 0) {
      console.log(`skip  ${u.email} (already exists)`)
      continue
    }

    const hash = await bcrypt.hash(u.password, 10)
    await sql`
      INSERT INTO users (email, name, role, password_hash)
      VALUES (${u.email}, ${u.name}, ${u.role}, ${hash})
    `
    console.log(`done  ${u.email}`)
  }

  console.log('seed complete.')
  await sql.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
