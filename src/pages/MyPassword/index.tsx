import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import Input from '@/components/Input'
import DetailHeader from '@/components/DetailHeader'
import AlertPopup from '@/components/AlertPopup'
import ScrollTop from '@/components/ScrollTop'
import { useAuth } from '@/contexts/AuthContext'
import './MyPassword.scss'

function MyPasswordPage() {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const { user, apiFetch } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const [errorAlertOpen, setErrorAlertOpen] = useState(false)
  const [samePwAlertOpen, setSamePwAlertOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  const isValid = Boolean(form.currentPassword.trim() && form.newPassword.trim() && form.confirmPassword.trim())

  async function handleSubmit() {
    if (!isValid || !form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setErrorAlertOpen(true)
      return
    }
    if (form.newPassword !== form.confirmPassword) return

    if (form.currentPassword.trim() === form.newPassword.trim()) {
      setSamePwAlertOpen(true)
      return
    }

    setSubmitting(true)
    try {
      const res = await apiFetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      })
      if (!res.ok) {
        setErrorAlertOpen(true)
        return
      }
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setAlertOpen(true)
    } catch {
      setErrorAlertOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="my-password">
      <DetailHeader title="비밀번호 변경" scrollTargetRef={contentRef} onClick={() => navigate(-1)} />
      <div ref={contentRef} className="my-password-content">
        <div className="my-password-section">
          <p className="my-password-title">비밀번호 설정</p>
          <div className="acc-info-box">
            <p className="info-id"><span>아이디 : </span>{user?.email ?? ''}</p>
          </div>
          <Input
            id="current-password"
            label="현재 비밀번호"
            type="password"
            placeholder=""
            value={form.currentPassword}
            onChange={handleChange('currentPassword')}
          />
          <Input
            id="new-password"
            label="새 비밀번호"
            type="password"
            placeholder=""
            hint="영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자"
            value={form.newPassword}
            onChange={handleChange('newPassword')}
          />
          <Input
            id="confirm-password"
            label="새 비밀번호 확인"
            type="password"
            placeholder=""
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={passwordMismatch}
            errorMessage="비밀번호를 다시 입력해 주세요."
          />
        </div>
      </div>
      <ButtonContainer>
        <Button onClick={handleSubmit} disabled={!isValid || submitting || passwordMismatch}>
          {submitting ? '변경 중...' : '비밀번호 변경하기'}
        </Button>
      </ButtonContainer>

      <AlertPopup
        open={alertOpen}
        message="비밀번호가 변경되었습니다."
        onCancel={() => setAlertOpen(false)}
        cancelText="닫기"
      />
      <AlertPopup
        open={errorAlertOpen}
        message="현재 비밀번호가 일치하지 않습니다."
        onCancel={() => setErrorAlertOpen(false)}
        cancelText="닫기"
      />
      <AlertPopup
        open={samePwAlertOpen}
        message="현재 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다."
        onCancel={() => setSamePwAlertOpen(false)}
        cancelText="닫기"
      />
      <ScrollTop scrollTargetRef={contentRef} hasBottomButton />
    </div>
  )
}

export default MyPasswordPage
