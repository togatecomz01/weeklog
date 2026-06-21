import { useRef, useState } from 'react'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import ScrollTop from '@/components/ScrollTop'
import './Admin.scss'
import logo from '@/assets/images/logo.png'

type TabType = 'all' | 'confirmed' | 'unconfirmed'
type StatusType = 'confirmed' | 'unconfirmed'

const TABS: { value: TabType; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'confirmed', label: '확인완료' },
  { value: 'unconfirmed', label: '미확인' },
]

const SAMPLE_CARDS = [
  { id: 1, week: '6월 2주차', status: 'unconfirmed' as StatusType, rate: 65, confirmed: 10, total: 15 },
  { id: 2, week: '6월 1주차', status: 'confirmed' as StatusType, rate: 100, confirmed: 15, total: 15 },
  { id: 3, week: '5월 4주차', status: 'unconfirmed' as StatusType, rate: 40, confirmed: 6, total: 15 },
]

const STATUS_LABEL: Record<StatusType, string> = {
  confirmed: '확인완료',
  unconfirmed: '미확인',
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
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [updateTime, setUpdateTime] = useState(formatUpdateTime)
  const [activeTab, setActiveTab] = useState<TabType>('all')

  function handleRefresh() {
    setUpdateTime(formatUpdateTime())
  }

  const filteredCards =
    activeTab === 'all' ? SAMPLE_CARDS : SAMPLE_CARDS.filter((c) => c.status === activeTab)

  return (
    <div className="admin">
      <AppHeader left={<img src={logo} alt="weeklog" />} />
      <div ref={contentRef} className="admin-content">
        <div className="admin-update">
          <span className="admin-update-text">최근 업데이트: {updateTime}</span>
          <button type="button" className="admin-update-refresh" onClick={handleRefresh}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            <p className="admin-stats-count">10건</p>
          </div>
          <div className="admin-stats-item">
            <p className="admin-stats-label">미확인</p>
            <p className="admin-stats-count">3건</p>
          </div>
        </div>

        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`admin-tabs-item${activeTab === tab.value ? ' admin-tabs-item--active' : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-list">
          {filteredCards.map((card) => (
            <div key={card.id} className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-week">{card.week}</span>
                <span className={`admin-card-badge admin-card-badge--${card.status}`}>
                  {STATUS_LABEL[card.status]}
                </span>
              </div>
              <div className="admin-card-rate">
                <div className="admin-card-rate-header">
                  <span className="admin-card-rate-label">확인율</span>
                  <span className="admin-card-rate-value">{card.rate}%</span>
                </div>
                <div className="admin-card-rate-bar">
                  <div className="admin-card-rate-fill" style={{ width: `${card.rate}%` }} />
                </div>
              </div>
              <div className="admin-card-confirmer">
                <span className="admin-card-confirmer-label">확인자 수</span>
                <span className="admin-card-confirmer-value">{card.confirmed}명 / {card.total}명</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ScrollTop scrollTargetRef={contentRef} />
      <BottomNav active="home" />
    </div>
  )
}

export default Admin
