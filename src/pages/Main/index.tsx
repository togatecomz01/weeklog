import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WeekCard from '@/components/WeekCard'
import WeekCardList from '@/components/WeekCard/WeekCardList'
import Select from '@/components/Select'
import Button from '@/components/Button'
import BottomNav from '@/components/BottomNav'
import AppHeader from '@/components/AppHeader'
import ScrollTop from '@/components/ScrollTop'
import { useEntries } from '@/hooks/useEntries'
import './Main.scss'
import logo from '@/assets/images/logo.png'

const FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'normal', label: '보통' },
  { value: 'important', label: '중요' },
  { value: 'urgent', label: '긴급' },
]

function formatDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  return `${year}.${month}.${day} ${days[now.getDay()]}`
}

function Main() {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [filter, setFilter] = useState('all')
  const { entries, loading, loadingMore, error, hasMore, loadMore } = useEntries()

  const filteredEntries =
    filter === 'all' ? entries : entries.filter((e) => e.priority === filter)

  return (
    <div className="main">
      <AppHeader left={<img src={logo} alt="weeklog" />} />

      <div ref={contentRef} className="main-content">
        <div className="main-banner">
          <p className="main-banner-date">{formatDate()}</p>
          <p className="main-banner-text">
            업무일지를 작성하고<br />진행 현황을 확인하세요.
          </p>
          <button className="main-banner-btn" type="button" onClick={() => navigate('/entry')}>
            등록하러 가기
          </button>
        </div>

        <div className="main-section">
          <div className="main-section-header">
            <h2 className="main-section-title">내 업무일지</h2>
            <Select
              options={FILTER_OPTIONS}
              value={filter}
              onChange={setFilter}
              className="main-filter"
            />
          </div>

          {loading && <p className="main-empty">불러오는 중...</p>}
          {error && <p className="main-empty">{error}</p>}

          {!loading && !error && (
            <>
              <WeekCardList>
                {filteredEntries.map((entry) => (
                  <WeekCard
                    key={entry.id}
                    week={entry.week}
                    priority={entry.priority}
                    content={entry.content}
                    onClick={() => navigate(`/entry-view?id=${entry.id}`)}
                  />
                ))}
              </WeekCardList>

              {filteredEntries.length === 0 && (
                <p className="main-empty">업무일지가 없습니다.</p>
              )}

              {hasMore && (
                <Button variant="secondary" fullWidth onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? '불러오는 중...' : '더보기'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <ScrollTop scrollTargetRef={contentRef} />
      <BottomNav active="home" />
    </div>
  )
}

export default Main
