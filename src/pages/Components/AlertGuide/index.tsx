import { useState } from 'react'
import '../Components.scss'

import AlertPopup from '@/components/AlertPopup'
import FullPopup from '@/components/FullPopup'
import Button from '@/components/Button'
import Select from '@/components/Select'

function AlertGuide() {
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [isAlertOpen2, setIsAlertOpen2] = useState(false)
    const [isAlertOpen3, setIsAlertOpen3] = useState(false)
    const [isFullOpen, setIsFullOpen] = useState(false)

    const DEPARTMENT_OPTIONS = [
        { value: 'data1', label: '투게이트컴즈 본사 내부 프로젝트' },
        { value: 'data2', label: 'AI 농업인 제안서' },
        { value: 'data3', label: 'MG캐피탈 홈페이지 리뉴얼' },
        { value: 'data4', label: '오릭스캐피탈 전자약정' },
        { value: 'data5', label: '안다미로 고도화 작업' },
    ]

    const [form, setForm] = useState({
        department: '',
    })

    const handleSelectChange = (name: string) => (value: string) => {
        setForm(prev => ({
          ...prev,
          [name]: value,
        }))
      }

    return (
        <div className="guide-content">
            <h1 className="guide-title">Popup</h1>
            <div className="guide-section">
                <h2 className="guide-section-title">알럿(버튼2)</h2>
                <div className="guide-example">
                    <Button fullWidth onClick={() => setIsAlertOpen(true)}>알럿 열기</Button>
                </div>
            </div>

            <div className="guide-section">
                <h2 className="guide-section-title">알럿(버튼1)</h2>
                <div className="guide-example">
                    <Button onClick={() => setIsAlertOpen2(true)}>알럿 열기</Button>
                </div>
            </div>

            <div className="guide-section">
                <h2 className="guide-section-title">알럿(select 포함)</h2>
                <div className="guide-example">
                    <Button onClick={() => setIsAlertOpen3(true)}>알럿 열기</Button>
                </div>
            </div>

            <div className="guide-section">
                <h2 className="guide-section-title">풀팝업</h2>
                <div className="guide-example">
                    <Button fullWidth onClick={() => setIsFullOpen(true)}>풀팝업 열기</Button>
                </div>
            </div>

            <AlertPopup
                open={isAlertOpen}
                onCancel={() => setIsAlertOpen(false)}
                onConfirm={() => setIsAlertOpen(false)}
            />

            <AlertPopup
                message="존재하지 않는 아이디입니다."
                open={isAlertOpen2}
                description="다시"
                onCancel={() => setIsAlertOpen2(false)}
                cancelText="닫기"
            />

            <AlertPopup
                message="프로젝트를 선택해주세요."
                open={isAlertOpen3}
                description={
                    <Select
                        className="entry-select"
                        label="프로젝트명"
                        options={DEPARTMENT_OPTIONS}
                        value={form.department}
                        required
                        onChange={handleSelectChange('department')}
                />
                }
                onConfirm={() => setIsAlertOpen3(false)}
            />

            <FullPopup
                open={isFullOpen}
                title="풀팝업"
                onClose={() => setIsFullOpen(false)}
                onCancel={() => setIsFullOpen(false)}
                onConfirm={() => setIsFullOpen(false)}
            />
        </div>
    )
}

export default AlertGuide
