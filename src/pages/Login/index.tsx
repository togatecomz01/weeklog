import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Checkbox from '@/components/Checkbox'
import AuthLayout from '@/components/AuthLayout'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [autoLogin, setAutoLogin] = useState(false)

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  return (
    <AuthLayout title="로그인" footer={<Button fullWidth>로그인</Button>}>
      <div className="auth-inputs">
        <Input
          label="이메일 주소"
          id="email"
          type="email"
          placeholder="이메일 주소"
          value={form.email}
          onChange={handleChange('email')}
        />
        <Input
          label="비밀번호"
          id="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange('password')}
        />
      </div>

      <div className="auth-options">
        <Checkbox
          label="자동 로그인"
          checked={autoLogin}
          onChange={(e) => setAutoLogin(e.target.checked)}
        />
        <button type="button" className="auth-link" onClick={() => navigate('/weeklog/reset-password')}>
          새 비밀번호 설정
        </button>
      </div>
    </AuthLayout>
  )
}

export default Login
