import { useRef, useState } from 'react'
import { useEntries } from '@/hooks/useEntries'
import { useNavigate } from 'react-router-dom'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import Badge from '@/components/Badge'
import ScrollTop from '@/components/ScrollTop'
import './Admin.scss'
import logo from '@/assets/images/logo.png'
import confirmedIcon from '@/assets/images/confirmed.png'
import unconfirmedIcon from '@/assets/images/unconfirmed.png'

type TabType = 'all' | 'confirmed' | 'unconfirmed'
type StatusType = 'confirmed' | 'unconfirmed'

const TABS: { value: TabType; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'confirmed', label: '확인완료' },
  { value: 'unconfirmed', label: '미확인' },
]

const STATUS_ICON: Record<StatusType, string> = {
  confirmed: confirmedIcon,
  unconfirmed: unconfirmedIcon,
}

const SAMPLE_CARDS = [
  { id: 1, week: '6월 2주차', status: 'unconfirmed' as StatusType, rate: 65, confirmed: 10, total: 15 },
  { id: 2, week: '6월 1주차', status: 'confirmed' as StatusType, rate: 100, confirmed: 15, total: 15 },
  { id: 3, week: '5월 4주차', status: 'unconfirmed' as StatusType, rate: 40, confirmed: 6, total: 15 },
]

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
  const [updateTime, setUpdateTime] = useState(formatUpdateTime)
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const { loadingMore, loadMore } = useEntries()

  function handleRefresh() {
    setUpdateTime(formatUpdateTime())
  }

  const filteredCards =
    activeTab === 'all' ? SAMPLE_CARDS : SAMPLE_CARDS.filter((c) => c.status === activeTab)

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
              <p className="admin-stats-count"><span className="completed">10</span> 건</p>
            </div>
            <div className="admin-stats-item">
              <p className="admin-stats-label">미확인</p>
              <p className="admin-stats-count"><span>3</span> 건</p>
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
            {filteredCards.map((card) => (
              <div key={card.id} className="admin-card" onClick={() => navigate('/adminlist')}>
                <div className="card-header">
                  <div className="card-title">
                    <img
                        src={STATUS_ICON[card.status]}
                        alt=""
                        className="card-icon"
                        aria-hidden="true"
                    />
                    <span className="card-week">{card.week}</span>
                  </div>
                  <Badge type={card.status} />
                </div>
                <div className="card-summary">
                  <div className="card-rate-info">
                    <strong className="card-rate-value">{card.rate}%</strong>
                    <span className="card-label">확인율</span>
                  </div>

                  <div className="card-rate-bar" aria-hidden="true">
                    <div className="card-rate-fill" style={{ width: `${card.rate}%` }} />
                  </div>

                  <div className="card-confirmer">
                    <strong className="card-confirmer-value">
                      {card.confirmed}<span> / {card.total}명</span>
                    </strong>
                    <span className="card-label">확인자 수</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ButtonContainer>
            <Button variant="more" fullWidth onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? '불러오는 중...' : '더보기'}
            </Button>
          </ButtonContainer>
        </section>
      </div>
      <ScrollTop scrollTargetRef={contentRef} hasBottomButton />
      <BottomNav active="home" />
    </div>
  )
}

export default Admin
