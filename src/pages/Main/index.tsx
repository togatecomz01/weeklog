import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useEntries } from '@/hooks/useEntries'
import WeekCard from '@/components/WeekCard'
import WeekCardList from '@/components/WeekCard/WeekCardList'
import Select from '@/components/Select'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import BottomNav from '@/components/BottomNav'
import AppHeader from '@/components/AppHeader'
import ScrollTop from '@/components/ScrollTop'
import DraftCard from '@/components/DraftCard'
import './Main.scss'
import logo from '@/assets/images/logo.png'

const FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'normal', label: '보통' },
  { value: 'important', label: '중요' },
  { value: 'urgent', label: '긴급' },
]

// function formatDate() {
//   const now = new Date()
//   const year = now.getFullYear()
//   const month = String(now.getMonth() + 1).padStart(2, '0')
//   const day = String(now.getDate()).padStart(2, '0')
//   const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
//   return `${year}.${month}.${day} ${days[now.getDay()]}`
// }

function Main() {
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [filter, setFilter] = useState('all')
  const { entries, loading, loadingMore, error, hasMore, loadMore } = useEntries()
  const [draft, setDraft] = useState<{ id: number; savedAt: string } | null>(null)

  useEffect(() => {
    if (!token) return
    fetch('/api/drafts', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data) return
        const saved = new Date(data.saved_at)
        const pad = (n: number) => String(n).padStart(2, '0')
        const savedAt = `${saved.getFullYear()}.${pad(saved.getMonth() + 1)}.${pad(saved.getDate())} ${pad(saved.getHours())}:${pad(saved.getMinutes())}`
        setDraft({ id: data.id, savedAt })
      })
  }, [token])

  const filteredEntries =
    filter === 'all' ? entries : entries.filter((e) => e.priority === filter)

  return (
    <div className="main">
      <AppHeader left={<img src={logo} alt="weeklog" />} />

      <div ref={contentRef} className="main-content">
        <div className="intro-section">
          <div className="banner">
            <p className="banner-date">안녕하세요! {user?.name ?? '사용자'}님.</p>
            <p className="banner-text">업무일지를 작성하고 진행 현황을 확인하세요.</p>
            <Button className="banner-btn" fullWidth type="button" onClick={() => navigate('/entry')}>업무일지 쓰러가기</Button>
          </div>

          {draft && (
            <DraftCard
              savedAt={draft.savedAt}
              onClick={() => navigate(`/entry?draftId=${draft.id}`)}
            />
          )}
        </div>

        <div className="main-section">
          <div className="main-section-header">
            <h2 className="main-section-title">MY 업무일지</h2>
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
                    status={entry.status}
                    content={entry.content}
                    onClick={() => navigate(`/entry-view?id=${entry.id}`)}
                  />
                ))}
              </WeekCardList>

              {filteredEntries.length === 0 && (
                <p className="main-empty">업무일지가 없습니다.</p>
              )}

              <ButtonContainer>
                {hasMore && (
                  <Button variant="more" fullWidth onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? '불러오는 중...' : '더보기'}
                  </Button>
                )}
              </ButtonContainer>
            </>
          )}
        </div>
      </div>

      <ScrollTop scrollTargetRef={contentRef} hasBottomButton />
      <BottomNav active="home" />
    </div>
  )
}

export default Main
