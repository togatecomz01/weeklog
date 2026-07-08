import 'dotenv/config'
import bcrypt from 'bcrypt'
import sql from './db.js'

const SEED_USERS = [
  { email: 'admin@weeklog.com', password: 'admin1234', name: '관리자', role: 'admin', department: '', position: '' },
  { email: 'user@weeklog.com', password: 'user1234', name: '홍길동', role: 'user', department: '개발팀', position: '대리' },
  { email: 'leesoli0122@gmail.com', password: 'user1234', name: '이솔', role: 'user', department: '퍼블팀', position: '대리' },
  { email: 'togatecomz.mj@gmail.com', password: 'user1234', name: '강민정', role: 'user', department: '퍼블팀', position: '주임' },
  { email: 'goun2gate@gmail.com', password: 'user1234', name: '박고운', role: 'user', department: '디자인팀', position: '주임' },
  { email: 'gksqls2979@gmail.com', password: 'user1234', name: '김한빈', role: 'user', department: '운영팀', position: '주임' },
]

const SEED_ENTRIES = [
  { week_year: 2026, week_month: 6, week_number: 2, priority: '높음', department: '개발팀', title: '[홍길동] 업무보고_2026.06.08~06.12', completed_work: '업무보고 시스템 개발 완료\n등록페이지 화면 설계 정리', ongoing_work: 'ERP 연동 설계 진행중\n메인 화면 플로우 정리 중', next_week_plan: '모바일 앱 검토 예정\n차주 메인 화면 상세 플로우 정리', notes: '스윗 연동 방식 추후 확정 필요' },
  { week_year: 2026, week_month: 6, week_number: 1, priority: '보통', department: '개발팀', title: '[홍길동] 업무보고_2026.06.01~06.05', completed_work: '공통 컴포넌트 버튼 상태 정리\n업무보고 시스템 개발 완료', ongoing_work: 'ERP 연동 설계 진행중\n관리자 확인 현황 화면 구조 검토', next_week_plan: '업무일지 상세 수정 플로우 보완', notes: '' },
  { week_year: 2026, week_month: 5, week_number: 4, priority: '매우 높음', department: '개발팀', title: '[홍길동] 업무보고_2026.05.25~05.29', completed_work: '배포 전 체크리스트 정리\n테스트 계정 권한 확인', ongoing_work: '운영 반영 일정 협의', next_week_plan: '잔여 UI QA 진행', notes: '긴급 항목 스윗 전송 완료 상태로 확인' },
  { week_year: 2026, week_month: 5, week_number: 3, priority: '보통', department: '개발팀', title: '[홍길동] 업무보고_2026.05.18~05.22', completed_work: '화면별 입력 항목 검토', ongoing_work: '주간 업무 데이터 구조 초안 작성', next_week_plan: '공통 리스트 컴포넌트 상태별 케이스 정리', notes: '기획 검토 후 우선순위 문구 조정 예정' },
  { week_year: 2026, week_month: 5, week_number: 2, priority: '높음', department: '개발팀', title: '[홍길동] 업무보고_2026.05.11~05.15', completed_work: 'API 명세 작성 완료\n로그인 기능 구현', ongoing_work: '토큰 갱신 로직 검토', next_week_plan: '권한별 라우팅 구현', notes: '' },
  { week_year: 2026, week_month: 5, week_number: 1, priority: '보통', department: '개발팀', title: '[홍길동] 업무보고_2026.05.04~05.08', completed_work: '프로젝트 초기 세팅\nDB 스키마 설계', ongoing_work: '공통 컴포넌트 개발', next_week_plan: 'API 명세 작성', notes: '' },
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

  const [user] = await sql`SELECT id FROM users WHERE email = 'user@weeklog.com'`

  for (const e of SEED_ENTRIES) {
    const existing = await sql`
      SELECT id FROM entries
      WHERE user_id = ${user.id} AND week_year = ${e.week_year}
        AND week_month = ${e.week_month} AND week_number = ${e.week_number}
    `
    if (existing.length > 0) {
      console.log(`skip  entry ${e.week_year}-${e.week_month}-${e.week_number} (already exists)`)
      continue
    }
    await sql`
      INSERT INTO entries (user_id, week_year, week_month, week_number, priority, department, title, completed_work, ongoing_work, next_week_plan, notes)
      VALUES (${user.id}, ${e.week_year}, ${e.week_month}, ${e.week_number}, ${e.priority}, ${e.department}, ${e.title}, ${e.completed_work}, ${e.ongoing_work}, ${e.next_week_plan}, ${e.notes})
    `
    console.log(`done  entry ${e.week_year}-${e.week_month}-${e.week_number}`)
  }

  console.log('seed complete.')
  await sql.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
