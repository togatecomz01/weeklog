import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Checkbox from '@/components/Checkbox'
import AuthLayout from '@/components/AuthLayout'
import { useAuth } from '@/contexts/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [autoLogin, setAutoLogin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleLogin() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message ?? '로그인에 실패했습니다.')
        return
      }

      login(data.user, data.token, autoLogin)

      if (data.user.role === 'admin') navigate('/admin')
      else navigate('/main')
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="로그인"
      footer={<Button fullWidth onClick={handleLogin} disabled={loading}>{loading ? '로그인 중...' : '로그인'}</Button>}
    >
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
          error={!!error}
          errorMessage={error}
        />
      </div>

      <div className="auth-options">
        <Checkbox
          label="자동 로그인"
          checked={autoLogin}
          onChange={(e) => setAutoLogin(e.target.checked)}
        />
        <button type="button" className="auth-link" onClick={() => navigate('/reset-password')}>
          새 비밀번호 설정
        </button>
      </div>
    </AuthLayout>
  )
}

export default Login
