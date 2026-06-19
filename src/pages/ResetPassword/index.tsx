import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import Input from '@/components/Input'
import AuthLayout from '@/components/AuthLayout'

function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  return (
    <AuthLayout title="비밀번호 초기화" footer={<Button fullWidth>비밀번호 초기화</Button>}>
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
        <button type="button" className="auth-link" onClick={() => navigate('/weeklog/login')}>
          로그인 페이지로 이동
        </button>
      </div>
    </AuthLayout>
  )
}

export default ResetPassword
