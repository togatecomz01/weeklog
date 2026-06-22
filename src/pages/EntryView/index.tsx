import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import CompletedTaskCard from '@/components/CompletedTaskCard'
import CompletedTaskCardList from '@/components/CompletedTaskCard/CompletedTaskCardList'
import DetailHeader from '@/components/DetailHeader'
import ScrollTop from '@/components/ScrollTop'
import { formatEntryDate, getWeeklogEntryById } from '@/data/weeklogEntries'
import type { BadgeType, WeeklogEntry } from '@/data/weeklogEntries'
import EntryEditPopup, { type EntryEditForm } from './EntryEditPopup'
import './EntryView.scss'
import '../Entry/Entry.scss'

type WorkStatus = 'done' | 'doing' | 'todo'
type EntryViewVariant = 'user' | 'admin'

interface EntryViewProps {
  variant?: EntryViewVariant
}

interface WorkBlock {
  title?: string
  status?: WorkStatus
  sent?: boolean
  items: string[]
}

function getDetailInfo(entry: WeeklogEntry) {
  return [
    { label: '주차', value: entry.week },
    { label: '작성일자', value: formatEntryDate(entry.writeDate) },
    { label: '작성자', value: entry.writer },
    { label: '부서', value: entry.departmentLabel },
    { label: '제목', value: entry.title },
  ]
}

function getWorkBlocks(entry: WeeklogEntry): WorkBlock[] {
  return [
    {
      status: 'done',
      sent: entry.sent.done,
      items: entry.completedWork,
    },
    {
      status: 'doing',
      sent: entry.sent.doing,
      items: entry.progressWork,
    },
    {
      status: 'todo',
      sent: entry.sent.todo,
      items: entry.nextWork,
    },
    {
      title: '특이사항',
      items: entry.note,
    },
  ]
}

function getEditPriority(priority: BadgeType) {
  return priority === 'urgent' ? 'high' : priority
}

function getInitialEditData(entry: WeeklogEntry): EntryEditForm {
  return {
    writeDate: entry.writeDate,
    writer: entry.writer,
    department: entry.department,
    title: entry.title,
    priority: getEditPriority(entry.priority),
    completedWork: entry.completedWork.join('\n'),
    progressWork: entry.progressWork.join('\n'),
    nextWork: entry.nextWork.join('\n'),
    note: entry.note.join('\n'),
  }
}

function EntryView({ variant = 'user' }: EntryViewProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const contentRef = useRef<HTMLElement | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const isEditMode = searchParams.get('mode') === 'edit'
  const isAdmin = variant === 'admin'
  const entry = getWeeklogEntryById(searchParams.get('id'))
  const detailInfo = getDetailInfo(entry)
  const workBlocks = getWorkBlocks(entry)
  const initialEditData = getInitialEditData(entry)

  useEffect(() => {
    if (!isAdmin && isEditMode) {
      setEditOpen(true)
    }
  }, [isAdmin, isEditMode])

  function handleEditClose() {
    setEditOpen(false)

    if (isEditMode) {
      const nextSearchParams = new URLSearchParams(searchParams)
      nextSearchParams.delete('mode')
      setSearchParams(nextSearchParams, { replace: true })
    }
  }

  function handleConfirm(form: EntryEditForm) {
    console.log('저장:', form)
    handleEditClose()
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
            <span className="view-value">
              <Badge type={entry.priority} />
            </span>
          </div>
        </section>

        <section className="entry-view-work">
          <h2 className="entry-title">업무내용</h2>
          <CompletedTaskCardList>
            {workBlocks.map(({ title, status, sent, items }, index) => (
              <CompletedTaskCard
                key={`${status || title || 'work'}-${index}`}
                title={title}
                status={status}
                sent={isAdmin ? false : sent}
                items={items}
                onSend={!isAdmin && status && !sent ? () => console.log('전송') : undefined}
              />
            ))}
          </CompletedTaskCardList>
        </section>

      </main>

      <div className="entry-view-foot">
        <ButtonContainer>
          {isAdmin ? (
            <Button onClick={() => navigate(-1)}>
              확인
            </Button>
          ) : (
            <>
              <Button variant="secondary">
                삭제
              </Button>
              <Button onClick={() => setEditOpen(true)}>
                수정
              </Button>
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
