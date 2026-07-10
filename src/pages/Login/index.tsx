import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Checkbox from '@/components/Checkbox'
import AuthLayout from '@/components/AuthLayout'
import AlertPopup from '@/components/AlertPopup'
import { useAuth } from '@/contexts/AuthContext'

type LoginField = 'email' | 'password'
type LoginErrors = Partial<Record<LoginField, string>>

const LOGIN_FAILED_MESSAGE = `로그인에 실패했습니다.\n잠시 후 다시 시도해 주세요.`

function Login() {
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [autoLogin, setAutoLogin] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<LoginErrors>({})
  const [loginFailedOpen, setLoginFailedOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/main'} replace />
  }

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setFieldErrors((prev) => {
        if (!prev[field]) return prev

        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function validateForm() {
    const nextErrors: LoginErrors = {}

    if (!form.email.trim()) {
      nextErrors.email = '이메일을 입력해주세요.'
    }

    if (!form.password) {
      nextErrors.password = '비밀번호를 입력해주세요.'
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleLogin(e?: React.BaseSyntheticEvent) {
    e?.preventDefault()
    setFieldErrors({})

    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.field === 'email' || data.field === 'password') {
          setFieldErrors({ [data.field]: data.message ?? LOGIN_FAILED_MESSAGE })
        } else {
          setLoginFailedOpen(true)
        }
        return
      }

      login(data.user, data.token, autoLogin)

      if (data.user.role === 'admin') navigate('/admin')
      else navigate('/main')
    } catch {
      setLoginFailedOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <form onSubmit={handleLogin}>
    <AuthLayout
      title="로그인 정보를 입력해주세요."
      subTitle="기존 회사계정으로 로그인이 가능해요"
      footer={<Button type="submit" fullWidth disabled={loading || !form.email.trim() || !form.password}>{loading ? '로그인 중...' : '로그인'}</Button>}
    >
      <div className="auth-inputs">
        <Input
          label="이메일 주소"
          id="email"
          type="email"
          placeholder="예) Id_123@togate.kr"
          value={form.email}
          onChange={handleChange('email')}
          error={!!fieldErrors.email}
          errorMessage={fieldErrors.email}
        />
        <Input
          label="비밀번호"
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={form.password}
          onChange={handleChange('password')}
          error={!!fieldErrors.password}
          errorMessage={fieldErrors.password}
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
    </form>
    <AlertPopup
      open={loginFailedOpen}
      message={LOGIN_FAILED_MESSAGE}
      cancelText="확인"
      onCancel={() => setLoginFailedOpen(false)}
    />
    </>
  )
}

export default Login
