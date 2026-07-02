import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import FullPopup from '@/components/FullPopup'
import Input from '@/components/Input'
import Radio from '@/components/Radio'
import RadioGroup from '@/components/Radio/RadioGroup'
import Textarea from '@/components/Textarea'
import AccInfoBox from '@/components/AccInfoBox'
import AlertPopup from '@/components/AlertPopup'
import '../Entry/Entry.scss'

export interface EntryEditForm {
  writeDate: string
  writer: string
  department: string
  title: string
  priority: string
  completedWork: string
  progressWork: string
  nextWork: string
  note: string
}

interface EntryEditPopupProps {
  open: boolean
  initialData: EntryEditForm
  sentStatuses?: Set<string>
  onClose: () => void
  onConfirm: (form: EntryEditForm) => void
}

const PRIORITY_OPTIONS = [
  { value: 'normal', label: '보통' },
  { value: 'important', label: '중요' },
  { value: 'high', label: '긴급' },
]

function EntryEditPopup({ open, initialData, sentStatuses = new Set(), onClose, onConfirm }: EntryEditPopupProps) {
  const [form, setForm] = useState<EntryEditForm>(initialData)
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false)
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(initialData)
    }
  }, [open, initialData])

  function handleChange(field: keyof EntryEditForm) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function handleCloseConfirmed() {
    setCloseConfirmOpen(false)
    setForm(initialData)
    onClose()
  }

  function handleSaveConfirmed() {
    setSaveConfirmOpen(false)
    onConfirm(form)
  }

  const isValid = Boolean(form.title.trim())

  return (
    <>
    <FullPopup
      open={open}
      title="업무일지 수정"
      headerType="close"
      cancelText="취소"
      confirmText="저장"
      confirmDisabled={!isValid}
      onClose={() => setCloseConfirmOpen(true)}
      onCancel={() => setCloseConfirmOpen(true)}
      onConfirm={() => isValid && setSaveConfirmOpen(true)}
    >
      <section className="entry-section">
      <h2 className="entry-title">작성정보</h2>
        <div className="entry-form">
          <div className="acc-info-box">
          <AccInfoBox
            type="user"
            tit={form.writer}
            subTit={form.department}
          />
            <AccInfoBox
              type="date"
              tit="작성일자"
              subTit={form.writeDate}
            />
          </div>
          <Input
            id="edit-title"
            label="제목"
            value={form.title}
            onChange={handleChange('title')}
            required
          />
          <RadioGroup label="중요도" required className="entry-priority">
            {PRIORITY_OPTIONS.map((option) => (
              <Radio
                key={option.value}
                className="entry-radio"
                name="edit-priority"
                label={option.label}
                value={option.value}
                checked={form.priority === option.value}
                onChange={() => setForm((prev) => ({ ...prev, priority: option.value }))}
              />
            ))}
          </RadioGroup>
        </div>
      </section>

      <section className="entry-section">
        <h2 className="entry-title">업무내용</h2>
        <div className="entry-form">
          <Textarea
            id="edit-completed-work"
            label="금주 완료 업무"
            placeholder="이번 주에 완료한 업무를 줄바꿈으로 구분하여 입력하세요."
            value={form.completedWork}
            onChange={handleChange('completedWork')}
            readOnly={sentStatuses.has('done')}
          />
          <Textarea
            id="edit-progress-work"
            label="진행 업무"
            placeholder="현재 진행 중인 업무를 줄바꿈으로 구분하여 입력하세요."
            value={form.progressWork}
            onChange={handleChange('progressWork')}
            readOnly={sentStatuses.has('doing')}
          />
          <Textarea
            id="edit-next-work"
            label="차주 예정 업무"
            placeholder="다음 주 예정 업무를 줄바꿈으로 구분하여 입력하세요."
            value={form.nextWork}
            onChange={handleChange('nextWork')}
            readOnly={sentStatuses.has('todo')}
          />
          <Textarea
            id="edit-note"
            label="특이사항"
            placeholder="공유가 필요한 이슈나 참고사항을 입력하세요."
            value={form.note}
            onChange={handleChange('note')}
          />
        </div>
      </section>
    </FullPopup>
    <AlertPopup
      open={closeConfirmOpen}
      message="수정하신 내용이 저장되지 않습니다."
      confirmText="확인"
      cancelText="취소"
      onConfirm={handleCloseConfirmed}
      onCancel={() => setCloseConfirmOpen(false)}
    />
    <AlertPopup
      open={saveConfirmOpen}
      message="수정하신 내용을 저장하시겠습니까?"
      confirmText="확인"
      cancelText="취소"
      onConfirm={handleSaveConfirmed}
      onCancel={() => setSaveConfirmOpen(false)}
    />
    </>
  )
}

export default EntryEditPopup
