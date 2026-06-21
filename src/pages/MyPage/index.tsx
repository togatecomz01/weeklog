import { useRef, useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import BottomNav from '@/components/BottomNav'
import AlertPopup from '@/components/AlertPopup'
import LogoutIcon from '@/components/icons/LogoutIcon'
import ScrollTop from '@/components/ScrollTop'
import './MyPage.scss'

function MyPage() {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [form, setForm] = useState({
    id: 'Id_123@togate.kr',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [alertOpen, setAlertOpen] = useState(false)

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword

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

      <div ref={contentRef} className="mypage-content">
        <div className="mypage-section">
          <h2 className="mypage-section-title">업무내용</h2>
          <div className="mypage-form">
            <Input
              id="user-id"
              label="아이디"
              placeholder="아이디를 입력하세요"
              value={form.id}
              disabled
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
          <Button onClick={() => setAlertOpen(true)}>비밀번호 변경하기</Button>
        </div>
      </div>

      <AlertPopup
        open={alertOpen}
        message="비밀번호가 변경되었습니다."
        onCancel={() => setAlertOpen(false)}
        cancelText="닫기"
      />
      <ScrollTop scrollTargetRef={contentRef} />
      <BottomNav active="my" />
    </div>
  )
}

export default MyPage
