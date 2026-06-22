import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import Input from '@/components/Input'
import AuthLayout from '@/components/AuthLayout'
import AlertPopup from '@/components/AlertPopup'

function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)

  return (
    <AuthLayout title="비밀번호 초기화" footer={<Button fullWidth onClick={() => setAlertOpen(true)}>비밀번호 초기화</Button>}>
      <div className="auth-inputs">
        <Input
          label="이메일 주소"
          id="email"
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="auth-options">
        <button type="button" className="auth-link" onClick={() => navigate('/login')}>
          로그인 페이지로 이동
        </button>
      </div>

      <AlertPopup
        open={alertOpen}
        message="비밀번호가 초기화되었습니다."
        onCancel={() => setAlertOpen(false)}
        cancelText="닫기"
        description='초기화된 비밀번호: togate123!'
      />
    </AuthLayout>
  )
}

export default ResetPassword
