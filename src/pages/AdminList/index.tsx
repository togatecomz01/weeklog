import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminListCardWrap from '@/components/AdminListCard/AdminListCardWrap'
import AdminListCard from '@/components/AdminListCard'
import Select from '@/components/Select'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import BottomNav from '@/components/BottomNav'
import AppHeader from '@/components/AppHeader'
import ScrollTop from '@/components/ScrollTop'
import './AdminList.scss'
import logo from '@/assets/images/logo.png'

type BadgeType = 'normal' | 'important' | 'urgent'

const FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'normal', label: '보통' },
  { value: 'important', label: '중요' },
  { value: 'urgent', label: '긴급' },
]

const SAMPLE_CARDS: { id: number; tit: string; subTit: string; priority: BadgeType; content: string; }[] = [
  {
    id: 1,
    tit: '홍길동',
    subTit: '디자인',
    priority: 'important',
    content: '1. 업무보고 시스템 개발 완료\n2. ERP 연동 설계 진행중\n3. 모바일 앱 검토 예정',
  },
  {
    id: 2,
    tit: '강길동',
    subTit: '기획',
    priority: 'normal',
    content: '1. 업무보고 시스템 개발 완료\n2. ERP 연동 설계 진행중',
  },
  {
    id: 3,
    tit: '남길동',
    subTit: '퍼블',
    priority: 'urgent',
    content: '1. 업무보고 시스템 개발 완료\n2. ERP 연동 설계 진행중\n3. 모바일 앱 검토 예정',
  },
  {
    id: 4,
    tit: '구길동',
    subTit: '퍼블',
    priority: 'normal',
    content: '1. 업무보고 시스템 개발 완료 \n 2. ERP 연동 설계 진행중 _마무리 단계',
  },
]

function AdminList() {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [filter, setFilter] = useState('all')

  const filteredCards =
    filter === 'all' ? SAMPLE_CARDS : SAMPLE_CARDS.filter((c) => c.priority === filter)

  return (
    <div className="admin">
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

          <AdminListCardWrap>
            {filteredCards.map((card) => (
              <AdminListCard
                key={card.id}
                tit={card.tit}
                subTit={card.subTit}
                priority={card.priority}
                content={card.content}
                onClick={() => navigate(`/admin-entry-view?id=${card.id}`)}
              />
            ))}
          </AdminListCardWrap>

          <ButtonContainer>
            <Button variant="more" fullWidth>
              더보기
            </Button>
          </ButtonContainer>
        </div>
      </div>

      <ScrollTop scrollTargetRef={contentRef} hasBottomButton />
      <BottomNav active="home" />
    </div>
  )
}

export default AdminList
