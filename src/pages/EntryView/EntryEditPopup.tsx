import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import FullPopup from '@/components/FullPopup'
import Input from '@/components/Input'
import Radio from '@/components/Radio'
import RadioGroup from '@/components/Radio/RadioGroup'
import Select from '@/components/Select'
import Textarea from '@/components/Textarea'
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
  onClose: () => void
  onConfirm: (form: EntryEditForm) => void
}

const DEPARTMENT_OPTIONS = [
  { value: 'planning', label: '기획팀' },
  { value: 'development', label: '개발팀' },
  { value: 'operation', label: '운영팀' },
  { value: 'design', label: '디자인' },
]

const PRIORITY_OPTIONS = [
  { value: 'normal', label: '일반' },
  { value: 'important', label: '중요' },
  { value: 'high', label: '높음' },
]

function EntryEditPopup({ open, initialData, onClose, onConfirm }: EntryEditPopupProps) {
  const [form, setForm] = useState<EntryEditForm>(initialData)

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

  function handleSelectChange(field: keyof EntryEditForm) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  function handleClose() {
    setForm(initialData)
    onClose()
  }

  const isValid = Boolean(form.title.trim())

  return (
    <FullPopup
      open={open}
      title="업무일지 수정"
      headerType="close"
      cancelText="취소"
      confirmText="저장"
      confirmDisabled={!isValid}
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={() => isValid && onConfirm(form)}
    >
      <section className="entry-section">
        <div className="entry-form">
          <Input
            id="edit-write-date"
            type="date"
            label="작성일자"
            value={form.writeDate}
            onChange={handleChange('writeDate')}
            disabled
            required
          />
          <Input
            id="edit-writer"
            label="작성자"
            value={form.writer}
            onChange={handleChange('writer')}
            disabled
            required
          />
          <Select
            className="entry-select"
            label="부서"
            options={DEPARTMENT_OPTIONS}
            value={form.department}
            onChange={handleSelectChange('department')}
            disabled
            required
          />
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
          />
          <Textarea
            id="edit-progress-work"
            label="진행 업무"
            placeholder="현재 진행 중인 업무를 줄바꿈으로 구분하여 입력하세요."
            value={form.progressWork}
            onChange={handleChange('progressWork')}
          />
          <Textarea
            id="edit-next-work"
            label="차주 예정 업무"
            placeholder="다음 주 예정 업무를 줄바꿈으로 구분하여 입력하세요."
            value={form.nextWork}
            onChange={handleChange('nextWork')}
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
  )
}

export default EntryEditPopup
