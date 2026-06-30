import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import Badge from '@/components/Badge'
import ScrollTop from '@/components/ScrollTop'
import './Admin.scss'
import logo from '@/assets/images/logo.png'
import confirmedIcon from '@/assets/images/confirmed.png'
import unconfirmedIcon from '@/assets/images/unconfirmed.png'

type TabType = 'all' | 'confirmed' | 'unconfirmed'
type StatusType = 'confirmed' | 'unconfirmed'

interface WeekSummary {
  week_year: number
  week_month: number
  week_number: number
  entry_count: number
  total_users: number
  rate: number
  status: StatusType
  label: string
}

const TABS: { value: TabType; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'confirmed', label: '확인완료' },
  { value: 'unconfirmed', label: '미확인' },
]

const STATUS_ICON: Record<StatusType, string> = {
  confirmed: confirmedIcon,
  unconfirmed: unconfirmedIcon,
}

function formatUpdateTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day} ${hours}:${minutes}`
}

function Admin() {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const { apiFetch } = useAuth()
  const [updateTime, setUpdateTime] = useState(formatUpdateTime)
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [weeks, setWeeks] = useState<WeekSummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWeeks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/entries/admin/weeks')
      if (!res.ok) throw new Error()
      const raw: { week_year: number; week_month: number; week_number: number; entry_count: number; confirmed_count: number; total_users: number }[] = await res.json()
      setWeeks(raw.map((w) => ({
        ...w,
        rate: w.entry_count > 0 ? Math.round((w.confirmed_count / w.entry_count) * 100) : 0,
        status: w.entry_count > 0 && w.confirmed_count >= w.entry_count ? 'confirmed' : 'unconfirmed',
        label: `${w.week_month}월 ${w.week_number}주차`,
      })))
    } finally {
      setLoading(false)
    }
  }, [apiFetch])

  useEffect(() => { fetchWeeks() }, [fetchWeeks])

  function handleRefresh() {
    setUpdateTime(formatUpdateTime())
    fetchWeeks()
  }

  const filteredWeeks =
    activeTab === 'all' ? weeks : weeks.filter((w) => w.status === activeTab)

  const confirmedCount = weeks.filter((w) => w.status === 'confirmed').length
  const unconfirmedCount = weeks.filter((w) => w.status === 'unconfirmed').length

  return (
    <div className="admin">
      <AppHeader left={<img src={logo} alt="weeklog" />} variant="basics" />
      <div ref={contentRef} className="admin-content">
        <section className="admin-top">
          <div className="admin-update">
            <span className="admin-update-text">최근 업데이트 : {updateTime}</span>
            <button type="button" className="admin-update-refresh" onClick={handleRefresh}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
          </div>

          <div className="admin-banner">
            <p className="admin-banner-text">주간 확인 현황</p>
            <p className="admin-banner-desc">전체 주차의 확인 상태를 한눈에 확인하세요.</p>
          </div>

          <div className="admin-stats">
            <div className="admin-stats-item">
              <p className="admin-stats-label">확인 완료</p>
              <p className="admin-stats-count"><span className="completed">{confirmedCount}</span> 건</p>
            </div>
            <div className="admin-stats-item">
              <p className="admin-stats-label">미확인</p>
              <p className="admin-stats-count"><span>{unconfirmedCount}</span> 건</p>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`admin-tabs-item${activeTab === tab.value ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="admin-list">
            {loading && <p style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>불러오는 중...</p>}
            {!loading && filteredWeeks.length === 0 && (
              <p style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>데이터가 없습니다.</p>
            )}
            {filteredWeeks.map((w) => (
              <div
                key={`${w.week_year}-${w.week_month}-${w.week_number}`}
                className="admin-card"
                onClick={() => navigate(`/adminlist?year=${w.week_year}&month=${w.week_month}&week=${w.week_number}`)}
              >
                <div className="card-header">
                  <div className="card-title">
                    <img src={STATUS_ICON[w.status]} alt="" className="card-icon" aria-hidden="true" />
                    <span className="card-week">{w.label}</span>
                  </div>
                  <Badge type={w.status} />
                </div>
                <div className="card-summary">
                  <div className="card-rate-info">
                    <strong className="card-rate-value">{w.rate}%</strong>
                    <span className="card-label">확인율</span>
                  </div>
                  <div className="card-rate-bar" aria-hidden="true">
                    <div className="card-rate-fill" style={{ width: `${w.rate}%` }} />
                  </div>
                  <div className="card-confirmer">
                    <strong className="card-confirmer-value">
                      {w.entry_count}<span> / {w.total_users}명</span>
                    </strong>
                    <span className="card-label">확인자 수</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <ScrollTop scrollTargetRef={contentRef} hasBottomButton />
      <BottomNav active="home" />
    </div>
  )
}

export default Admin
