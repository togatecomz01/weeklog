import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WeekCard from '@/components/WeekCard'
import WeekCardList from '@/components/WeekCard/WeekCardList'
import Select from '@/components/Select'
import Button from '@/components/Button'
import BottomNav from '@/components/BottomNav'
import AppHeader from '@/components/AppHeader'
import ScrollTop from '@/components/ScrollTop'
import './AdminList.scss'
import logo from '@/assets/images/logo.png'

type BadgeType = 'normal' | 'important' | 'urgent'
type SendStatus = 'unsent' | 'partial' | 'sent'

const FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'normal', label: '보통' },
  { value: 'important', label: '중요' },
  { value: 'urgent', label: '긴급' },
]

const SAMPLE_CARDS: { id: number; week: string; priority: BadgeType; content: string; status: SendStatus }[] = [
  {
    id: 1,
    week: '6월 2주',
    priority: 'important',
    content: '1. 업무보고 시스템 개발 완료\n2. ERP 연동 설계 진행중\n3. 모바일 앱 검토 예정',
    status: 'unsent',
  },
  {
    id: 2,
    week: '6월 1주',
    priority: 'normal',
    content: '1. 업무보고 시스템 개발 완료\n2. ERP 연동 설계 진행중',
    status: 'partial',
  },
  {
    id: 3,
    week: '5월 4주',
    priority: 'urgent',
    content: '1. 업무보고 시스템 개발 완료\n2. ERP 연동 설계 진행중\n3. 모바일 앱 검토 예정',
    status: 'sent',
  },
  {
    id: 4,
    week: '5월 3주',
    priority: 'normal',
    content: '1. 업무보고 시스템 개발 완료',
    status: 'unsent',
  },
]

function AdminList() {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [filter, setFilter] = useState('all')

  const filteredCards =
    filter === 'all' ? SAMPLE_CARDS : SAMPLE_CARDS.filter((c) => c.priority === filter)

  return (
    <div className="main">
      <AppHeader left={<img src={logo} alt="weeklog" />} />

      <div ref={contentRef} className="main-content">
        <div className="main-section">
          <div className="main-section-header">
            <h2 className="main-section-title">week: 6월 2주</h2>
            <Select
              options={FILTER_OPTIONS}
              value={filter}
              onChange={setFilter}
              className="main-filter"
            />
          </div>

          <WeekCardList>
            {filteredCards.map((card) => (
              <WeekCard
                key={card.id}
                week={card.week}
                priority={card.priority}
                content={card.content}
                status={card.status}
                onClick={() => navigate('/admin-entry-view')}
              />
            ))}
          </WeekCardList>

          <Button variant="secondary" fullWidth>
            더보기
          </Button>
        </div>
      </div>

      <ScrollTop scrollTargetRef={contentRef} />
      <BottomNav active="home" />
    </div>
  )
}

export default AdminList
