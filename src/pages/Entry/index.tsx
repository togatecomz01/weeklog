import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import DetailHeader from '@/components/DetailHeader'
import Input from '@/components/Input'
import Radio from '@/components/Radio'
import RadioGroup from '@/components/Radio/RadioGroup'
import ScrollTop from '@/components/ScrollTop'
import Textarea from '@/components/Textarea'
import AccInfoBox from '@/components/AccInfoBox'
import { useAuth } from '@/contexts/AuthContext'
import './Entry.scss'

type Priority = '보통' | '중요' | '긴급'

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: '보통', label: '보통' },
  { value: '중요', label: '중요' },
  { value: '긴급', label: '긴급' },
]

function getWeekInfo(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  const weekStart = new Date(date)
  const dow = weekStart.getDay()
  weekStart.setDate(weekStart.getDate() + (dow === 0 ? -6 : 1 - dow))

  const firstDay = new Date(weekStart.getFullYear(), weekStart.getMonth(), 1)
  const firstMonday = new Date(firstDay)
  const firstDow = firstMonday.getDay()
  firstMonday.setDate(firstMonday.getDate() + (firstDow === 0 ? -6 : 1 - firstDow))
  if (firstMonday.getMonth() !== weekStart.getMonth()) {
    firstMonday.setDate(firstMonday.getDate() + 7)
  }

  const weekNumber = Math.floor((weekStart.getTime() - firstMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1

  return {
    week_year: weekStart.getFullYear(),
    week_month: weekStart.getMonth() + 1,
    week_number: Math.max(1, weekNumber),
  }
}

function Entry() {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLElement | null>(null)
  const { user, token } = useAuth()
  const [form, setForm] = useState({
    writeDate: new Date().toISOString().slice(0, 10),
    title: '',
    priority: '보통' as Priority,
    completedWork: '',
    progressWork: '',
    nextWork: '',
    note: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  const isValid = Boolean(form.writeDate.trim() && form.title.trim())

  async function handleSubmit() {
    if (!isValid) return
    setError('')
    setLoading(true)
    try {
      const { week_year, week_month, week_number } = getWeekInfo(form.writeDate)
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          week_year,
          week_month,
          week_number,
          priority: form.priority,
          department: user?.department ?? '',
          title: form.title,
          completed_work: form.completedWork,
          ongoing_work: form.progressWork,
          next_week_plan: form.nextWork,
          notes: form.note,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? '등록에 실패했습니다.')
        return
      }

      navigate('/main', { replace: true })
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="entry">
      <DetailHeader title="업무일지 등록" scrollTargetRef={contentRef} onClick={() => navigate(-1)} />
      <main ref={contentRef} className="entry-content">
        <section className="entry-section">
        <h2 className="entry-title">작성정보</h2>
          <div className="entry-form">
            <div className="acc-info-box">
              <AccInfoBox
                type="user"
                tit={user?.name ?? ''}
                subTit={user?.department ?? ''}
              />
            </div>
            <Input
              id="entry-write-date"
              type="date"
              label="작성일자"
              value={form.writeDate}
              onChange={handleChange('writeDate')}
              required
            />
            <Input
              id="entry-title"
              label="제목"
              value={form.title}
              onChange={handleChange('title')}
              error={!!error}
              errorMessage={error}
              required
            />
            <RadioGroup label="중요도" required className="entry-priority">
              {PRIORITY_OPTIONS.map((option) => (
                <Radio
                  key={option.value}
                  className="entry-radio"
                  name="entry-priority"
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
              id="entry-completed-work"
              label="금주 완료 업무"
              placeholder="이번 주에 완료한 업무를 줄바꿈으로 구분하여 입력하세요."
              value={form.completedWork}
              onChange={handleChange('completedWork')}
            />
            <Textarea
              id="entry-progress-work"
              label="진행 업무"
              placeholder="현재 진행 중인 업무를 줄바꿈으로 구분하여 입력하세요."
              value={form.progressWork}
              onChange={handleChange('progressWork')}
            />
            <Textarea
              id="entry-next-work"
              label="차주 예정 업무"
              placeholder="다음 주 예정 업무를 줄바꿈으로 구분하여 입력하세요."
              value={form.nextWork}
              onChange={handleChange('nextWork')}
            />
            <Textarea
              id="entry-note"
              label="특이사항"
              placeholder="공유가 필요한 이슈나 참고사항을 입력하세요."
              value={form.note}
              onChange={handleChange('note')}
            />
          </div>
        </section>

      </main>
      <ButtonContainer>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          임시저장
        </Button>
        <Button type="button" disabled={!isValid || loading} onClick={handleSubmit}>
          {loading ? '등록 중...' : '등록'}
        </Button>
      </ButtonContainer>
      <ScrollTop scrollTargetRef={contentRef} />
      <BottomNav active="register" />
    </div>
  )
}

export default Entry
