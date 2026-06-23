import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import Input from '@/components/Input'
import BottomNav from '@/components/BottomNav'
import AlertPopup from '@/components/AlertPopup'
import LogoutIcon from '@/components/icons/LogoutIcon'
import ScrollTop from '@/components/ScrollTop'
import { useAuth } from '@/contexts/AuthContext'
import './MyPage.scss'

function MyPage() {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const [errorAlertOpen, setErrorAlertOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleSubmit() {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setErrorAlertOpen(true)
      return
    }
    if (form.newPassword !== form.confirmPassword) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
    <div className="mypage">
      <header className="mypage-header">
        <div className="mypage-user-info">
          <span className="mypage-username">{user?.name ?? ''}</span>
          <span className="mypage-position">{user?.department ?? ''}</span>
        </div>
        <Button variant="secondary" logout startIcon={<LogoutIcon />} onClick={() => { logout(); navigate('/login') }}>
          로그아웃
        </Button>
      </header>

      <div ref={contentRef} className="mypage-content">
        <div className="mypage-section">
          <h2 className="mypage-section-title">업무내용</h2>
          <div className="mypage-form">
            <Input
              id="user-id"
              label="아이디"
              value={user?.email ?? ''}
              disabled
            />
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
          <Button onClick={handleSubmit} disabled={submitting || passwordMismatch}>
            {submitting ? '변경 중...' : '비밀번호 변경하기'}
          </Button>
        </div>
      </div>

      <AlertPopup
        open={alertOpen}
        message="비밀번호가 변경되었습니다."
        onCancel={() => setAlertOpen(false)}
        cancelText="닫기"
      />
      <AlertPopup
        open={errorAlertOpen}
        message="현재 비밀번호가 올바르지 않습니다."
        onCancel={() => setErrorAlertOpen(false)}
        cancelText="닫기"
      />
      <ScrollTop scrollTargetRef={contentRef} />
      <BottomNav active="my" />
    </div>
  )
}

export default MyPage
