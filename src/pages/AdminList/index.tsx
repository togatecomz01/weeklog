import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import AdminListCardWrap from '@/components/AdminListCard/AdminListCardWrap'
import AdminListCard from '@/components/AdminListCard'
import Select from '@/components/Select'
import BottomNav from '@/components/BottomNav'
import AppHeader from '@/components/AppHeader'
import ScrollTop from '@/components/ScrollTop'
import './AdminList.scss'
import logo from '@/assets/images/logo.png'

type BadgeType = 'normal' | 'important' | 'urgent'

interface AdminEntry {
  id: number
  week_year: number
  week_month: number
  week_number: number
  priority: string
  department: string
  title: string
  completed_work: string
  ongoing_work: string
  user_name: string
}

const FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '보통', label: '보통' },
  { value: '중요', label: '중요' },
  { value: '긴급', label: '긴급' },
]

const PRIORITY_MAP: Record<string, BadgeType> = {
  '보통': 'normal',
  '중요': 'important',
  '긴급': 'urgent',
}

function toPreview(completed_work: string, ongoing_work: string) {
  const source = completed_work || ongoing_work
  if (!source) return '등록된 업무 내용이 없습니다.'
  return source.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 3).join('\n')
}

function AdminList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { apiFetch } = useAuth()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [filter, setFilter] = useState('all')
  const [entries, setEntries] = useState<AdminEntry[]>([])
  const [loading, setLoading] = useState(true)

  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const week = searchParams.get('week')
  const weekLabel = month && week ? `${month}월 ${week}주` : '전체'

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (year) params.set('week_year', year)
      if (month) params.set('week_month', month)
      if (week) params.set('week_number', week)
      const res = await apiFetch(`/api/entries?${params}`)
      if (!res.ok) throw new Error()
      setEntries(await res.json())
    } finally {
      setLoading(false)
    }
  }, [apiFetch, year, month, week])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const filteredEntries =
    filter === 'all' ? entries : entries.filter((e) => e.priority === filter)

  return (
    <div className="admin">
      <AppHeader left={<img src={logo} alt="weeklog" />} />

      <div ref={contentRef} className="main-content">
        <div className="main-section">
          <div className="main-section-header">
            <h2 className="main-section-title">week: {weekLabel}</h2>
            <Select
              options={FILTER_OPTIONS}
              value={filter}
              onChange={setFilter}
              className="main-filter"
            />
          </div>

          {loading && <p style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>불러오는 중...</p>}
          {!loading && filteredEntries.length === 0 && (
            <p style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>등록된 업무일지가 없습니다.</p>
          )}
          {!loading && filteredEntries.length > 0 && (
            <AdminListCardWrap>
              {filteredEntries.map((entry) => (
                <AdminListCard
                  key={entry.id}
                  tit={entry.user_name}
                  subTit={entry.department}
                  priority={PRIORITY_MAP[entry.priority] ?? 'normal'}
                  content={toPreview(entry.completed_work, entry.ongoing_work)}
                  onClick={() => navigate(`/admin-entry-view?id=${entry.id}`)}
                />
              ))}
            </AdminListCardWrap>
          )}
        </div>
      </div>

      <ScrollTop scrollTargetRef={contentRef} hasBottomButton />
      <BottomNav active="home" />
    </div>
  )
}

export default AdminList
