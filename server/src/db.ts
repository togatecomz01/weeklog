import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL ?? 'postgresql://localhost/weeklog')

export default sql
