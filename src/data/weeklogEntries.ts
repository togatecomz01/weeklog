export type BadgeType = 'normal' | 'important' | 'urgent'
export type EntryPriority = 'normal' | 'important' | 'high'
export type SendStatus = 'unsent' | 'partial' | 'sent'

export interface WeeklogEntryForm {
  writeDate: string
  writer: string
  department: string
  title: string
  priority: EntryPriority
  completedWork: string
  progressWork: string
  nextWork: string
  note: string
}

export interface WeeklogEntry {
  id: number
  week: string
  writeDate: string
  writer: string
  department: string
  departmentLabel: string
  title: string
  priority: BadgeType
  status: SendStatus
  completedWork: string[]
  progressWork: string[]
  nextWork: string[]
  note: string[]
  sent: {
    done: boolean
    doing: boolean
    todo: boolean
  }
}

const WEEKLOG_STORAGE_KEY = 'weeklog.entries'

const DEPARTMENT_LABELS: Record<string, string> = {
  planning: '기획팀',
  design: '디자인팀',
  publisher: '퍼블팀',
  development: '개발팀',
  operation: '운영팀',
}

export const WEEKLOG_ENTRIES: WeeklogEntry[] = [
  {
    id: 1,
    week: '6월 2주',
    writeDate: '2026-06-12',
    writer: '홍길동',
    department: 'design',
    departmentLabel: '디자인',
    title: '[홍길동]업무보고서_2026.06.08~2026.06.12',
    priority: 'important',
    status: 'unsent',
    completedWork: ['업무보고 시스템 개발 완료', '등록페이지 화면 설계 정리 완료', '업무 내용 항목명 확정'],
    progressWork: ['ERP 연동 설계 진행중', '메인 화면 상세 플로우 정리 중', '스윗 전송 항목 구분 방식 확인 중'],
    nextWork: ['모바일 앱 검토 예정', '차주 메인 화면 상세 플로우 정리', '스윗 전송 항목 구분 방식 확정'],
    note: ['스윗 연동 방식은 추후 확정 필요', '테스트 단계에서는 앱 저장을 우선 처리'],
    sent: {
      done: true,
      doing: false,
      todo: false,
    },
  },
  {
    id: 2,
    week: '6월 1주',
    writeDate: '2026-06-05',
    writer: '홍길동',
    department: 'design',
    departmentLabel: '디자인',
    title: '[홍길동]업무보고서_2026.06.01~2026.06.05',
    priority: 'normal',
    status: 'partial',
    completedWork: ['업무보고 시스템 개발 완료', '공통 컴포넌트 버튼 상태 정리'],
    progressWork: ['ERP 연동 설계 진행중', '관리자 확인 현황 화면 구조 검토'],
    nextWork: ['업무일지 상세 수정 플로우 보완', '전송 상태별 버튼 정책 정리'],
    note: ['관리자 확인 목록은 상세 데이터 연동 후 다시 점검 필요'],
    sent: {
      done: true,
      doing: true,
      todo: false,
    },
  },
  {
    id: 3,
    week: '5월 4주',
    writeDate: '2026-05-29',
    writer: '홍길동',
    department: 'operation',
    departmentLabel: '운영팀',
    title: '[홍길동]업무보고서_2026.05.25~2026.05.29',
    priority: 'urgent',
    status: 'sent',
    completedWork: ['업무보고 시스템 개발 완료', 'ERP 연동 설계 진행중', '모바일 앱 검토 예정'],
    progressWork: ['배포 전 체크리스트 정리', '테스트 계정 권한 확인'],
    nextWork: ['운영 반영 일정 협의', '잔여 UI QA 진행'],
    note: ['긴급 항목은 스윗 전송 완료 상태로 확인'],
    sent: {
      done: true,
      doing: true,
      todo: true,
    },
  },
  {
    id: 4,
    week: '5월 3주',
    writeDate: '2026-05-22',
    writer: '홍길동',
    department: 'planning',
    departmentLabel: '기획팀',
    title: '[홍길동]업무보고서_2026.05.18~2026.05.22',
    priority: 'normal',
    status: 'unsent',
    completedWork: ['업무보고 시스템 개발 완료'],
    progressWork: ['화면별 입력 항목 검토', '주간 업무 데이터 구조 초안 작성'],
    nextWork: ['공통 리스트 컴포넌트 상태별 케이스 정리'],
    note: ['기획 검토 후 우선순위 문구 조정 예정'],
    sent: {
      done: false,
      doing: false,
      todo: false,
    },
  },
]

function canUseStorage() {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

function isWeeklogEntry(value: unknown): value is WeeklogEntry {
  const entry = value as WeeklogEntry

  return (
    typeof entry?.id === 'number' &&
    typeof entry.week === 'string' &&
    typeof entry.writeDate === 'string' &&
    typeof entry.writer === 'string' &&
    typeof entry.department === 'string' &&
    typeof entry.departmentLabel === 'string' &&
    typeof entry.title === 'string' &&
    ['normal', 'important', 'urgent'].includes(entry.priority) &&
    ['unsent', 'partial', 'sent'].includes(entry.status) &&
    Array.isArray(entry.completedWork) &&
    Array.isArray(entry.progressWork) &&
    Array.isArray(entry.nextWork) &&
    Array.isArray(entry.note) &&
    typeof entry.sent?.done === 'boolean' &&
    typeof entry.sent?.doing === 'boolean' &&
    typeof entry.sent?.todo === 'boolean'
  )
}

function getStoredWeeklogEntries() {
  if (!canUseStorage()) {
    return null
  }

  try {
    const stored = window.localStorage.getItem(WEEKLOG_STORAGE_KEY)

    if (!stored) {
      return null
    }

    const entries = JSON.parse(stored)

    if (!Array.isArray(entries)) {
      return null
    }

    return entries.filter(isWeeklogEntry)
  } catch {
    return null
  }
}

function saveWeeklogEntries(entries: WeeklogEntry[]) {
  if (!canUseStorage()) {
    return
  }

  try {
    window.localStorage.setItem(WEEKLOG_STORAGE_KEY, JSON.stringify(entries))
  } catch {
    return
  }
}

function getWorkItems(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getBadgePriority(priority: EntryPriority): BadgeType {
  return priority === 'high' ? 'urgent' : priority
}

function getWeekStart(date: Date) {
  const weekStart = new Date(date)
  const day = weekStart.getDay()
  const diff = day === 0 ? -6 : 1 - day

  weekStart.setDate(weekStart.getDate() + diff)
  weekStart.setHours(0, 0, 0, 0)

  return weekStart
}

function getDateValue(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return new Date()
  }

  return new Date(year, month - 1, day)
}

function getWeekLabel(writeDate: string) {
  const weekStart = getWeekStart(getDateValue(writeDate))
  const firstDayOfMonth = new Date(weekStart.getFullYear(), weekStart.getMonth(), 1)
  const firstWeekStart = getWeekStart(firstDayOfMonth)

  if (firstWeekStart.getMonth() !== weekStart.getMonth()) {
    firstWeekStart.setDate(firstWeekStart.getDate() + 7)
  }

  const weekNumber = Math.floor((weekStart.getTime() - firstWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1

  return `${weekStart.getMonth() + 1}월 ${Math.max(1, weekNumber)}주`
}

function getNextEntryId(entries: WeeklogEntry[]) {
  return Math.max(...entries.map((entry) => entry.id), 0) + 1
}

export function getWeeklogEntries() {
  const storedEntries = getStoredWeeklogEntries()

  return storedEntries?.length ? storedEntries : WEEKLOG_ENTRIES
}

export function createWeeklogEntry(form: WeeklogEntryForm) {
  const entries = getWeeklogEntries()
  const nextEntry: WeeklogEntry = {
    id: getNextEntryId(entries),
    week: getWeekLabel(form.writeDate),
    writeDate: form.writeDate,
    writer: form.writer.trim(),
    department: form.department,
    departmentLabel: DEPARTMENT_LABELS[form.department] || form.department,
    title: form.title.trim(),
    priority: getBadgePriority(form.priority),
    status: 'unsent',
    completedWork: getWorkItems(form.completedWork),
    progressWork: getWorkItems(form.progressWork),
    nextWork: getWorkItems(form.nextWork),
    note: getWorkItems(form.note),
    sent: {
      done: false,
      doing: false,
      todo: false,
    },
  }

  saveWeeklogEntries([nextEntry, ...entries])

  return nextEntry
}

export function getWeeklogEntryPreview(entry: WeeklogEntry) {
  const previewItems = entry.completedWork.length
    ? entry.completedWork
    : [entry.progressWork[0], entry.nextWork[0], entry.note[0]].filter(Boolean)

  if (!previewItems.length) {
    return '등록된 업무 내용이 없습니다.'
  }

  return previewItems.map((item, index) => `${index + 1}. ${item}`).join('\n')
}

export function getWeeklogEntryById(id: string | null): WeeklogEntry {
  const entryId = Number(id)
  const entries = getWeeklogEntries()

  if (!Number.isFinite(entryId)) {
    return entries[0]
  }

  return entries.find((entry) => entry.id === entryId) || entries[0]
}

export function formatEntryDate(date: string) {
  return date.split('-').join('.')
}
