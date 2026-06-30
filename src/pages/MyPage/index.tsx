import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import Input from '@/components/Input'
import DetailHeader from '@/components/DetailHeader'
import BottomNav from '@/components/BottomNav'
import AlertPopup from '@/components/AlertPopup'
import ScrollTop from '@/components/ScrollTop'
import { useAuth } from '@/contexts/AuthContext'
import './MyPage.scss'

function MyPage() {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const { user, token, logout, apiFetch } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const [errorAlertOpen, setErrorAlertOpen] = useState(false)
  const [samePwAlertOpen, setSamePwAlertOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [switConnected, setSwitConnected] = useState<boolean | null>(null)
  const [switConnectedAlert, setSwitConnectedAlert] = useState(false)
  const [switDisconnectAlert, setSwitDisconnectAlert] = useState(false)

  useEffect(() => {
    apiFetch('/api/swit/status')
      .then((r) => r.json())
      .then((d) => setSwitConnected(d.connected))
      .catch(() => setSwitConnected(false))
  }, [apiFetch])

  useEffect(() => {
    if (searchParams.get('swit') === 'connected') {
      setSwitConnected(true)
      setSwitConnectedAlert(true)
      const next = new URLSearchParams(searchParams)
      next.delete('swit')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  async function handleSwitDisconnect() {
    await apiFetch('/api/swit/disconnect', { method: 'DELETE' })
    setSwitConnected(false)
    setSwitDisconnectAlert(true)
  }

  function handleSwitConnect() {
    window.location.href = `/api/swit/connect?token=${token}`
  }

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  const isValid = Boolean(form.newPassword.trim() && form.confirmPassword.trim())

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
    <div className="mypage">
      <DetailHeader title="마이" scrollTargetRef={contentRef} onClick={() => navigate(-1)} />

      <div ref={contentRef} className="mypage-content">
        <div className="user-info-section">
          <div className="user-info">
            <div>
              <span className="username">{user?.name ?? ''}</span>
              <span className="user-position">{user?.position ?? ''}</span>
            </div>
            <Button variant="primary" logout onClick={() => { logout(); navigate('/login') }}>
              로그아웃
            </Button>
          </div>
          <p className="user-desc">계정 및 보안 정보를 관리 할 수 있습니다.</p>
        </div>
        <div className="mypage-section">
          <h2 className="mypage-section-title">Swit 연동</h2>
          <div className="swit-connect-box">
            {switConnected === null && <p className="swit-status">확인 중...</p>}
            {switConnected === false && (
              <>
                <p className="swit-status">연결되지 않음</p>
                <Button variant="primary" onClick={handleSwitConnect}>Swit 연결하기</Button>
              </>
            )}
            {switConnected === true && (
              <>
                <p className="swit-status connected">연결됨</p>
                <Button onClick={handleSwitDisconnect}>연결 해제</Button>
              </>
            )}
          </div>
        </div>
        <div className="mypage-section">
          <h2 className="mypage-section-title">초기 비밀번호 설정</h2>
          <div className="mypage-form">
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
      <AlertPopup
        open={switConnectedAlert}
        message="Swit 계정이 연결되었습니다."
        onCancel={() => setSwitConnectedAlert(false)}
        cancelText="닫기"
      />
      <AlertPopup
        open={switDisconnectAlert}
        message="Swit 연결이 해제되었습니다."
        onCancel={() => setSwitDisconnectAlert(false)}
        cancelText="닫기"
      />
      <ScrollTop scrollTargetRef={contentRef} hasBottomButton />
      <BottomNav active="my" />
    </div>
  )
}

export default MyPage
