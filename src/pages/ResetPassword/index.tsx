import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import Input from '@/components/Input'
import AuthLayout from '@/components/AuthLayout'
import AlertPopup from '@/components/AlertPopup'
import ArrowIcon from '@/components/icons/ArrowIcon'

function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [errorAlertOpen, setErrorAlertOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset() {
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMessage(data.message ?? '초기화에 실패했습니다.')
        setErrorAlertOpen(true)
        return
      }
      setNewPassword(data.password)
      setAlertOpen(true)
    } catch {
      setErrorMessage('서버에 연결할 수 없습니다.')
      setErrorAlertOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="비밀번호 초기화를 진행할게요."
      subTitle="비밀번호 재설정을 위해 이메일을 입력하세요"
      footer={
        <Button fullWidth onClick={handleReset} disabled={loading || !email}>
          {loading ? '초기화 중...' : '비밀번호 초기화'}
        </Button>
      }
    >
      <div className="auth-inputs">
        <Input
          label="이메일 주소"
          id="email"
          type="email"
          placeholder="예) Id_123@togate.kr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="info-box">
        <p className="info-txt">비밀번호 초기화 후 로그인 페이지로 이동하여 발급 된 새로운 비밀번호로 로그인해주세요.</p>
      </div>

      <div className="auth-options">
        <button type="button" className="auth-link arr" onClick={() => navigate('/login')}>
          로그인 페이지로 이동{<ArrowIcon />}
        </button>
      </div>

      <AlertPopup
        open={alertOpen}
        message="비밀번호가 초기화되었습니다."
        description={
          <>
            초기화된 비밀번호:{' '}
            <span className="r-pwd">{newPassword}</span>
          </>
        }
        onCancel={() => { setAlertOpen(false); navigate('/login') }}
        cancelText="로그인하기"
      />
      <AlertPopup
        open={errorAlertOpen}
        message={errorMessage}
        onCancel={() => setErrorAlertOpen(false)}
        cancelText="닫기"
      />
    </AuthLayout>
  )
}

export default ResetPassword
