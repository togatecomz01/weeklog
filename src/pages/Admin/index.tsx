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
        rate: w.total_users > 0 ? Math.round((w.confirmed_count / w.total_users) * 100) : 0,
        status: w.total_users > 0 && w.confirmed_count >= w.total_users ? 'confirmed' : 'unconfirmed',
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10.0643 15.8333C8.43596 15.8333 7.05651 15.2686 5.92596 14.1392C4.79596 13.0092 4.23096 11.6303 4.23096 10.0025C4.23096 8.37473 4.79596 6.99528 5.92596 5.86417C7.05596 4.73306 8.4354 4.16723 10.0643 4.16667C11.0548 4.16667 11.9823 4.40195 12.8468 4.8725C13.7107 5.34306 14.4071 6 14.936 6.84334V4.58334C14.936 4.465 14.976 4.36611 15.056 4.28667C15.136 4.20723 15.2351 4.16723 15.3535 4.16667C15.4718 4.16611 15.5707 4.20611 15.6501 4.28667C15.7296 4.36723 15.7693 4.46611 15.7693 4.58334V7.8525C15.7693 8.04306 15.7048 8.20306 15.576 8.3325C15.4471 8.46195 15.2871 8.52639 15.096 8.52584H11.8268C11.709 8.52584 11.6101 8.48584 11.5301 8.40584C11.4501 8.32584 11.4101 8.22667 11.4101 8.10834C11.4101 7.99 11.4501 7.89111 11.5301 7.81167C11.6101 7.73223 11.709 7.6925 11.8268 7.6925H14.4935C14.0601 6.86139 13.4498 6.20473 12.6626 5.7225C11.8765 5.24084 11.0104 5 10.0643 5C8.6754 5 7.49485 5.48611 6.52262 6.45834C5.5504 7.43056 5.06429 8.61111 5.06429 10C5.06429 11.3889 5.5504 12.5694 6.52262 13.5417C7.49485 14.5139 8.6754 15 10.0643 15C11.0571 15 11.9657 14.7311 12.7901 14.1933C13.6151 13.655 14.2268 12.9403 14.6251 12.0492C14.6723 11.9403 14.7485 11.8639 14.8535 11.82C14.959 11.7756 15.0668 11.7719 15.1768 11.8092C15.294 11.8464 15.3718 11.9228 15.4101 12.0383C15.4485 12.1539 15.4443 12.2661 15.3976 12.375C14.9348 13.4222 14.2237 14.2603 13.2643 14.8892C12.3048 15.5181 11.2382 15.8328 10.0643 15.8333Z" fill="#757575" />
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
