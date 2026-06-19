import { useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import BottomNav from '@/components/BottomNav'
import LogoutIcon from '@/components/icons/LogoutIcon'
import './MyPage.scss'

function MyPage() {
  const [form, setForm] = useState({
    id: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  return (
    <div className="mypage">
      <header className="mypage-header">
        <div className="mypage-user-info">
          <span className="mypage-username">홍길동</span>
          <span className="mypage-position">과장</span>
        </div>
        <Button variant="secondary" logout startIcon={<LogoutIcon />}>
          로그아웃
        </Button>
      </header>

      <div className="mypage-content">
        <div className="mypage-section">
          <h2 className="mypage-section-title">업무내용</h2>
          <div className="mypage-form">
            <Input
              id="user-id"
              label="아이디"
              placeholder="아이디를 입력하세요"
              value={form.id}
              onChange={handleChange('id')}
            />
            <Input
              id="current-password"
              label="현재 비밀번호"
              type="password"
              placeholder="이번 주에 완료한 업무를 줄바꿈으로 구분하여 입력하세요."
              value={form.currentPassword}
              onChange={handleChange('currentPassword')}
            />
            <Input
              id="new-password"
              label="새 비밀번호"
              type="password"
              placeholder=""
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
            />
          </div>
          <Button>비밀번호 등록하기</Button>
        </div>
      </div>

      <BottomNav active="my" />
    </div>
  )
}

export default MyPage
