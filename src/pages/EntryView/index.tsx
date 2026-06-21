import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import CompletedTaskCard from '@/components/CompletedTaskCard'
import CompletedTaskCardList from '@/components/CompletedTaskCard/CompletedTaskCardList'
import DetailHeader from '@/components/DetailHeader'
import ScrollTop from '@/components/ScrollTop'
import EntryEditPopup, { type EntryEditForm } from './EntryEditPopup'
import './EntryView.scss'
import '../Entry/Entry.scss'

type WorkStatus = 'done' | 'doing' | 'todo'

interface WorkBlock {
  title?: string
  status?: WorkStatus
  sent?: boolean
  items: string[]
}

const DETAIL_INFO = [
  { label: '작성일자', value: '2026.06.12' },
  { label: '작성자', value: '홍길동' },
  { label: '부서', value: '디자인' },
  { label: '제목', value: '[홍길동]업무보고서_2026.06.08~2026.06.12' },
]

const WORK_BLOCKS: WorkBlock[] = [
  {
    status: 'done',
    sent: true,
    items: ['등록페이지 화면 설계 정리 완료', '업무 내용 항목명 확정'],
  },
  {
    status: 'doing',
    sent: false,
    items: ['메인 화면 상세 플로우 정리 중', '스윗 전송 항목 구분 방식 확인 중', '스윗 전송 항목 구분 방식 확인 중'],
  },
  {
    status: 'todo',
    sent: false,
    items: ['차주 메인 화면 상세 플로우 정리', '스윗 전송 항목 구분 방식 확정'],
  },
  {
    title: '특이사항',
    items: ['스윗 연동 방식은 추후 확정 필요', '테스트 단계에서는 앱 저장을 우선 처리'],
  },
]

const INITIAL_EDIT_DATA: EntryEditForm = {
  writeDate: '2026.06.12',
  writer: '홍길동',
  department: 'design',
  title: '[홍길동]업무보고서_2026.06.08~2026.06.12',
  priority: 'important',
  completedWork: '등록페이지 화면 설계 정리 완료\n업무 내용 항목명 확정',
  progressWork: '메인 화면 상세 플로우 정리 중\n스윗 전송 항목 구분 방식 확인 중',
  nextWork: '차주 메인 화면 상세 플로우 정리\n스윗 전송 항목 구분 방식 확정',
  note: '스윗 연동 방식은 추후 확정 필요\n테스트 단계에서는 앱 저장을 우선 처리',
}


function EntryView() {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLElement | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  function handleConfirm(form: EntryEditForm) {
    console.log('저장:', form)
    setEditOpen(false)
  }

  return (
    <div className="entry-view">
      <DetailHeader title="업무일지 상세" scrollTargetRef={contentRef} onClick={() => navigate(-1)} />

      <main ref={contentRef} className="entry-content">
        <section className="entry-section view-info">
          {DETAIL_INFO.map(({ label, value }) => (
            <div className="view-row" key={label}>
              <strong className="view-label">{label}</strong>
              <span className="view-value">{value}</span>
            </div>
          ))}
          <div className="view-row">
            <strong className="view-label">중요도</strong>
            <span className="view-value">
              <Badge type="important" />
            </span>
          </div>
        </section>

        <section className="entry-view-work">
          <h2 className="entry-title">업무내용</h2>
          <CompletedTaskCardList>
            {WORK_BLOCKS.map(({ title, status, sent, items }, index) => (
              <CompletedTaskCard
                key={`${status || title || 'work'}-${index}`}
                title={title}
                status={status}
                sent={sent}
                items={items}
                onSend={status && !sent ? () => console.log('전송') : undefined}
              />
            ))}
          </CompletedTaskCardList>
        </section>

        <ButtonContainer>
          <Button variant="secondary">
            삭제
          </Button>
          <Button onClick={() => setEditOpen(true)}>
            수정
          </Button>
        </ButtonContainer>
      </main>

      <ScrollTop scrollTargetRef={contentRef} />

      <EntryEditPopup
        open={editOpen}
        initialData={INITIAL_EDIT_DATA}
        onClose={() => setEditOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default EntryView
