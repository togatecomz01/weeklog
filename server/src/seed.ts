import 'dotenv/config'
import bcrypt from 'bcrypt'
import sql from './db.js'

const SEED_USERS = [
  { email: 'admin@weeklog.com', password: 'admin1234', name: '관리자', role: 'admin', department: '', position: '' },
  { email: 'user@weeklog.com', password: 'user1234', name: '홍길동', role: 'user', department: '개발팀', position: '대리' },
  { email: 'leesoli0122@gmail.com', password: 'user1234', name: '이솔', role: 'user', department: '퍼블팀', position: '대리' },
  { email: 'togatecomz.mj@gmail.com', password: 'user1234', name: '강민정', role: 'user', department: '퍼블팀', position: '주임' },
  { email: "2gate.no1@gmail.com", password: "admin1234", name: "장권", role: "admin", department: "경영진", position: "대표" }
]

async function seed() {
  for (const u of SEED_USERS) {
    const existing = await sql`SELECT id FROM users WHERE email = ${u.email}`
    if (existing.length > 0) {
      console.log(`skip  ${u.email} (already exists)`)
      continue
    }
    const hash = await bcrypt.hash(u.password, 10)
    await sql`INSERT INTO users (email, name, role, department, position, password_hash) VALUES (${u.email}, ${u.name}, ${u.role}, ${u.department}, ${u.position}, ${hash})`
    console.log(`done  ${u.email}`)
  }

  const seedEmails = SEED_USERS.map((u) => u.email)
  const removed = await sql`DELETE FROM users WHERE email NOT IN ${sql(seedEmails)} RETURNING email`
  for (const r of removed) {
    console.log(`removed  ${r.email} (not in SEED_USERS)`)
  }

  console.log('seed complete.')
  await sql.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
