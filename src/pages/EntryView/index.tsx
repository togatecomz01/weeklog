import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import CompletedTaskCard from '@/components/CompletedTaskCard'
import CompletedTaskCardList from '@/components/CompletedTaskCard/CompletedTaskCardList'
import DetailHeader from '@/components/DetailHeader'
import ScrollTop from '@/components/ScrollTop'
import Select from '@/components/Select'
import AlertPopup from '@/components/AlertPopup'
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
  sent_done: boolean
  sent_doing: boolean
  sent_todo: boolean
  confirmed_at: string | null
  write_date: string
  created_at: string
  user_name?: string
}

const PRIORITY_MAP: Record<string, BadgeType> = {
  '보통': 'normal',
  '높음': 'important',
  '매우 높음': 'urgent',
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
  const { apiFetch } = useAuth()
  const [entry, setEntry] = useState<ApiEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [sentStatuses, setSentStatuses] = useState<Set<string>>(new Set())
  const [projectOpen, setProjectOpen] = useState(false)
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [pendingSend, setPendingSend] = useState<{ status: string; items: string[] } | null>(null)
  const [confirmed, setConfirmed] = useState<boolean>(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [switAlertOpen, setSwitAlertOpen] = useState(false)
  const [switAlertMessage, setSwitAlertMessage] = useState('Swit 계정이 연결되어 있지 않습니다.')
  const [switAlertDescription, setSwitAlertDescription] = useState('프로젝트를 선택하려면 먼저\nSwit 계정을 연동해 주세요.')
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false)
  const [pendingConfirm, setPendingConfirm] = useState<{ status: string; items: string[]; project_id: string } | null>(null)
  const [allSentAlertOpen, setAllSentAlertOpen] = useState(false)

  const isEditMode = searchParams.get('mode') === 'edit'
  const isAdmin = variant === 'admin'
  const id = searchParams.get('id')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    apiFetch(`/api/entries/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('불러오기 실패')
        return res.json()
      })
      .then(setEntry)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, apiFetch])

  useEffect(() => {
    if (!entry) return
    const initial = new Set<string>()
    if (entry.sent_done) initial.add('done')
    if (entry.sent_doing) initial.add('doing')
    if (entry.sent_todo) initial.add('todo')
    setSentStatuses(initial)
    setConfirmed(Boolean(entry.confirmed_at))
  }, [entry])

  useEffect(() => {
    if (!isAdmin && isEditMode) setEditOpen(true)
  }, [isAdmin, isEditMode])

  async function openProjectPicker(status: string, items: string[]) {
    setPendingSend({ status, items })
    setLoadingProjects(true)
    setProjectOpen(true)
    try {
      const res = await apiFetch('/api/swit/projects')
      if (res.status === 403) {
        const data = await res.json().catch(() => null)
        const expired = data?.reason === 'expired'
        setSwitAlertMessage(data?.message ?? (expired ? 'Swit 연결이 만료되었습니다. 다시 연결해 주세요.' : 'Swit 계정이 연결되어 있지 않습니다.'))
        setSwitAlertDescription(expired ? '' : `프로젝트를 선택하려면 먼저\nSwit 계정을 연동해 주세요.`)
        setSwitAlertOpen(true)
        setProjectOpen(false)
        setPendingSend(null)
        return
      }
      if (!res.ok) throw new Error('프로젝트 목록을 가져올 수 없습니다.')
      const data: { id: string; name: string }[] = await res.json()
      setProjects(data)
      setSelectedProject('')
    } catch (err: any) {
      alert(err.message)
      setProjectOpen(false)
      setPendingSend(null)
    } finally {
      setLoadingProjects(false)
    }
  }

  function handleSend(status: string, items: string[]) {
    openProjectPicker(status, items)
  }

  function handleProjectConfirm() {
    if (!pendingSend || !selectedProject) return
    setProjectOpen(false)
    setPendingConfirm({ ...pendingSend, project_id: selectedProject })
    setPendingSend(null)
    setSendConfirmOpen(true)
  }

  async function handleSendConfirm() {
    setSendConfirmOpen(false)
    if (!pendingConfirm) return
    const { status, items, project_id } = pendingConfirm
    setPendingConfirm(null)
    try {
      const res = await apiFetch('/api/swit/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, items, entry_id: entry!.id, project_id }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.message ?? '전송 실패')
        return
      }
      setSentStatuses((prev) => new Set(prev).add(status))
    } catch {
      alert('서버에 연결할 수 없습니다.')
    }
  }

  function handleEditClose() {
    setEditOpen(false)
    if (isEditMode) {
      const next = new URLSearchParams(searchParams)
      next.delete('mode')
      setSearchParams(next, { replace: true })
    }
  }

  const PRIORITY_TO_KO: Record<string, string> = {
    normal: '보통',
    important: '높음',
    high: '매우 높음',
  }

  async function handleConfirm(form: EntryEditForm) {
    if (!id) return
    try {
      const res = await apiFetch(`/api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          priority: PRIORITY_TO_KO[form.priority] ?? form.priority,
          completed_work: form.completedWork,
          ongoing_work: form.progressWork,
          next_week_plan: form.nextWork,
          notes: form.note,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.message ?? '수정 실패')
        return
      }
      const updated = await apiFetch(`/api/entries/${id}`)
      if (updated.ok) setEntry(await updated.json())
      handleEditClose()
    } catch {
      alert('서버에 연결할 수 없습니다.')
    }
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
  const createdDate = entry.write_date.slice(0, 10).replace(/-/g, '.')

  const detailInfo = [
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
    writeDate: entry.write_date.slice(0, 10),
    writer: entry.user_name ?? '',
    department: entry.department,
    title: entry.title,
    priority: priority === 'urgent' ? 'high' : priority,
    completedWork: entry.completed_work,
    progressWork: entry.ongoing_work,
    nextWork: entry.next_week_plan,
    note: entry.notes,
  }

  async function handleDelete() {
    if (!id) return
    try {
      const res = await apiFetch(`/api/entries/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        alert(data.message ?? '삭제 실패')
        return
      }
      navigate(-1)
    } catch {
      alert('서버에 연결할 수 없습니다.')
    }
  }

  async function handleAdminConfirm() {
    if (confirmed || !id) return
    try {
      const res = await apiFetch(`/api/entries/${id}/confirm`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        alert(data.message ?? '확인 처리에 실패했습니다.')
        return
      }
      setConfirmed(true)
    } catch {
      alert('확인 처리에 실패했습니다.')
    }
  }

  return (
    <div className={`entry-view ${isAdmin ? 'entry-view-admin' : ''}`.trim()}>
      <DetailHeader title="업무일지 상세" scrollTargetRef={contentRef} onClick={() => navigate(-1)} />

      <main ref={contentRef} className="entry-content">
        <section className="entry-view-section">
          <h2 className="entry-title">작성정보</h2>
          <div className="view-info">
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
          </div>
        </section>

        <section className="entry-view-section-work">
          <h2 className="entry-title">업무내용</h2>
          <CompletedTaskCardList>
            {workBlocks.map(({ title, status, items }, index) => (
              <CompletedTaskCard
                key={`${status ?? title ?? index}`}
                title={title}
                status={status}
                sent={status ? sentStatuses.has(status) : false}
                items={items}
                onSend={!isAdmin && status && items.length > 0 && !sentStatuses.has(status)
                  ? () => handleSend(status, items)
                  : undefined}
              />
            ))}
          </CompletedTaskCardList>
        </section>
      </main>

      <div className="entry-view-foot">
        <ButtonContainer>
          {isAdmin ? (
            <Button
              onClick={handleAdminConfirm}
              disabled={confirmed}
            >
              {confirmed ? '확인완료' : '확인'}
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setDeleteOpen(true)}>삭제</Button>
              <Button onClick={() => {
                if (sentStatuses.has('done') && sentStatuses.has('doing') && sentStatuses.has('todo')) {
                  setAllSentAlertOpen(true)
                } else {
                  setEditOpen(true)
                }
              }}>수정</Button>
            </>
          )}
        </ButtonContainer>
      </div>

      <ScrollTop scrollTargetRef={contentRef} />

      {!isAdmin && (
        <EntryEditPopup
          open={editOpen}
          initialData={initialEditData}
          sentStatuses={sentStatuses}
          onClose={handleEditClose}
          onConfirm={handleConfirm}
        />
      )}

      <AlertPopup
        open={sendConfirmOpen}
        message={`스윗 전송 이후에는 수정할 수 없습니다.\n전송하시겠습니까?`}
        confirmText="확인"
        cancelText="취소"
        onConfirm={handleSendConfirm}
        onCancel={() => { setSendConfirmOpen(false); setPendingConfirm(null) }}
      />

      <AlertPopup
        open={switAlertOpen}
        message={switAlertMessage}
        description={switAlertDescription}
        cancelText="닫기"
        onCancel={() => setSwitAlertOpen(false)}
      />

      <AlertPopup
        open={allSentAlertOpen}
        message="수정할 수 없습니다."
        cancelText="닫기"
        onCancel={() => setAllSentAlertOpen(false)}
      />

      <AlertPopup
        open={deleteOpen}
        message="업무일지를 삭제하시겠습니까?"
        description="삭제된 업무일지는 복구할 수 없습니다."
        descriptionSize="sm"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      <AlertPopup
        open={projectOpen}
        message="프로젝트를 선택해주세요."
        description={
          loadingProjects
            ? '불러오는 중...'
            : (
              <Select
                className="entry-select"
                label="프로젝트명"
                placeholder="선택해 주세요."
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
                value={selectedProject}
                onChange={setSelectedProject}
              />
            )
        }
        confirmText="확인"
        cancelText="취소"
        onConfirm={handleProjectConfirm}
        onCancel={() => { setProjectOpen(false); setPendingSend(null) }}
      />
    </div>
  )
}

export default EntryView
