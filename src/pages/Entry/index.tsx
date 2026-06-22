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
import Select from '@/components/Select'
import ScrollTop from '@/components/ScrollTop'
import './Entry.scss'
import Textarea from '@/components/Textarea'

const DEPARTMENT_OPTIONS = [
    { value: 'planning', label: '기획팀' },
    { value: 'design', label: '디자인팀' },
    { value: 'publisher', label: '퍼블팀' },
    { value: 'development', label: '개발팀' },
    { value: 'operation', label: '운영팀' },
]

const PRIORITY_OPTIONS = [
    { value: 'normal', label: '일반' },
    { value: 'important', label: '중요' },
    { value: 'high', label: '높음' },
]

function Entry() {
    const navigate = useNavigate()
    const contentRef = useRef<HTMLElement | null>(null)
    const [form, setForm] = useState({
        writeDate: '',
        writer: '',
        department: '',
        title: '',
        priority: 'normal',
        completedWork: '',
        progressWork: '',
        nextWork: '',
        note: '',
    })
    
    function handleChange(field: keyof typeof form) {
        return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }))
        }
    }

    function handleSelectChange(field: keyof typeof form) {
        return (value: string) => {
            setForm((prev) => ({ ...prev, [field]: value }))
        }
    }

    const isValid =
    form.writeDate.trim() &&
    form.writer.trim() &&
    form.department.trim() &&
    form.title.trim()

    return (
        <div className="entry">
            <DetailHeader title="업무일지 등록" scrollTargetRef={contentRef} onClick={() => navigate(-1)} />
            <main ref={contentRef} className="entry-content">
                <section className="entry-section">
                    <div className="entry-form">
                        <Input
                            id="entry-write-date"
                            type="date"
                            label="작성일자"
                            value={form.writeDate}
                            onChange={handleChange('writeDate')}
                            required
                        />
                        <Input
                            id="entry-writer"
                            label="작성자"
                            value={form.writer}
                            onChange={handleChange('writer')}
                            required
                        />
                        <Select
                            className="entry-select"
                            label="부서"
                            placeholder="선택해주세요"
                            options={DEPARTMENT_OPTIONS}
                            value={form.department}
                            onChange={handleSelectChange('department')}
                            required
                        />
                        <Input
                            id="entry-title"
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
                <ButtonContainer>
                    <Button type="button" variant="secondary">
                        임시저장
                    </Button>
                    <Button type="button" disabled={!isValid}>
                        등록
                    </Button>
                </ButtonContainer>
            </main>
            <ScrollTop scrollTargetRef={contentRef} />
            <BottomNav active="register" />
        </div>
    )
}

export default Entry
