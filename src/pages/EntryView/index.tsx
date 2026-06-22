import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import CompletedTaskCard from '@/components/CompletedTaskCard'
import CompletedTaskCardList from '@/components/CompletedTaskCard/CompletedTaskCardList'
import DetailHeader from '@/components/DetailHeader'
import ScrollTop from '@/components/ScrollTop'
import { useAuth } from '@/contexts/AuthContext'
import EntryEditPopup, { type EntryEditForm } from './EntryEditPopup'
import './EntryView.scss'
import '../Entry/Entry.scss'

type BadgeType = 'normal' | 'important' | 'urgent'
type WorkStatus = 'done' | 'doing' | 'todo'
type EntryViewVariant = 'user' | 'admin'

interface EntryViewProps {
  variant?: EntryViewVariant
}

interface ApiEntry {
  id: number
  week_year: number
  week_month: number
  week_number: number
  priority: string
  department: string
  title: string
  completed_work: string
  ongoing_work: string
  next_week_plan: string
  notes: string
  created_at: string
  user_name?: string
}

const PRIORITY_MAP: Record<string, BadgeType> = {
  '보통': 'normal',
  '중요': 'important',
  '긴급': 'urgent',
}

function toLines(text: string) {
  return text.split('\n').map((s) => s.trim()).filter(Boolean)
}

function EntryView({ variant = 'user' }: EntryViewProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const contentRef = useRef<HTMLElement | null>(null)
  const { token } = useAuth()
  const [entry, setEntry] = useState<ApiEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editOpen, setEditOpen] = useState(false)

  const isEditMode = searchParams.get('mode') === 'edit'
  const isAdmin = variant === 'admin'
  const id = searchParams.get('id')

  useEffect(() => {
    if (!id || !token) return
    setLoading(true)
    fetch(`/api/entries/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('불러오기 실패')
        return res.json()
      })
      .then(setEntry)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, token])

  useEffect(() => {
    if (!isAdmin && isEditMode) setEditOpen(true)
  }, [isAdmin, isEditMode])

  function handleEditClose() {
    setEditOpen(false)
    if (isEditMode) {
      const next = new URLSearchParams(searchParams)
      next.delete('mode')
      setSearchParams(next, { replace: true })
    }
  }

  function handleConfirm(form: EntryEditForm) {
    console.log('저장:', form)
    handleEditClose()
  }

  if (loading) {
    return (
      <div className="entry-view">
        <DetailHeader title="업무일지 상세" scrollTargetRef={contentRef} onClick={() => navigate(-1)} />
        <main ref={contentRef} className="entry-content">
          <p className="entry-view-empty">불러오는 중...</p>
        </main>
      </div>
    )
  }

  if (error || !entry) {
    return (
      <div className="entry-view">
        <DetailHeader title="업무일지 상세" scrollTargetRef={contentRef} onClick={() => navigate(-1)} />
        <main ref={contentRef} className="entry-content">
          <p className="entry-view-empty">{error || '데이터를 찾을 수 없습니다.'}</p>
        </main>
      </div>
    )
  }

  const priority = PRIORITY_MAP[entry.priority] ?? 'normal'
  const week = `${entry.week_month}월 ${entry.week_number}주`
  const createdDate = entry.created_at.slice(0, 10).replace(/-/g, '.')

  const detailInfo = [
    { label: '주차', value: week },
    { label: '작성일자', value: createdDate },
    { label: '작성자', value: entry.user_name ?? '-' },
    { label: '부서', value: entry.department },
    { label: '제목', value: entry.title },
  ]

  const workBlocks: { title?: string; status?: WorkStatus; items: string[] }[] = [
    { status: 'done', items: toLines(entry.completed_work) },
    { status: 'doing', items: toLines(entry.ongoing_work) },
    { status: 'todo', items: toLines(entry.next_week_plan) },
    { title: '특이사항', items: toLines(entry.notes) },
  ]

  const initialEditData: EntryEditForm = {
    writeDate: entry.created_at.slice(0, 10),
    writer: entry.user_name ?? '',
    department: entry.department,
    title: entry.title,
    priority: priority === 'urgent' ? 'high' : priority,
    completedWork: entry.completed_work,
    progressWork: entry.ongoing_work,
    nextWork: entry.next_week_plan,
    note: entry.notes,
  }

  return (
    <div className={`entry-view ${isAdmin ? 'entry-view-admin' : ''}`.trim()}>
      <DetailHeader title="업무일지 상세" scrollTargetRef={contentRef} onClick={() => navigate(-1)} />

      <main ref={contentRef} className="entry-content">
        <section className="entry-section view-info">
          {detailInfo.map(({ label, value }) => (
            <div className="view-row" key={label}>
              <strong className="view-label">{label}</strong>
              <span className="view-value">{value}</span>
            </div>
          ))}
          <div className="view-row">
            <strong className="view-label">중요도</strong>
            <span className="view-value"><Badge type={priority} /></span>
          </div>
        </section>

        <section className="entry-view-work">
          <h2 className="entry-title">업무내용</h2>
          <CompletedTaskCardList>
            {workBlocks.map(({ title, status, items }, index) => (
              <CompletedTaskCard
                key={`${status ?? title ?? index}`}
                title={title}
                status={status}
                sent={false}
                items={items}
                onSend={!isAdmin && status ? () => console.log('전송') : undefined}
              />
            ))}
          </CompletedTaskCardList>
        </section>
      </main>

      <div className="entry-view-foot">
        <ButtonContainer>
          {isAdmin ? (
            <Button onClick={() => navigate(-1)}>확인</Button>
          ) : (
            <>
              <Button variant="secondary">삭제</Button>
              <Button onClick={() => setEditOpen(true)}>수정</Button>
            </>
          )}
        </ButtonContainer>
      </div>

      <ScrollTop scrollTargetRef={contentRef} />

      {!isAdmin && (
        <EntryEditPopup
          open={editOpen}
          initialData={initialEditData}
          onClose={handleEditClose}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

export default EntryView
