import AppHeader from '@/components/AppHeader'
import './Admin.scss'
import logo from '@/assets/images/logo.png'
import BottomNav from '@/components/BottomNav'
import Button from '@/components/Button'

function formatDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  return `${year}.${month}.${day} ${days[now.getDay()]}`
}

function Admin() {

  return (
    <div className="admin">
      <AppHeader left={<img src={logo} alt="weeklog" />} />
      <div className="main-content">
        <div className="main-banner">
          <p className="main-banner-date">{formatDate()}</p>
          <p className="main-banner-text">
            업무일지를 작성하고<br />진행 현황을 확인하세요.
          </p>
          <button className="main-banner-btn" type="button">
            등록하러 가기
          </button>
        </div>

        <div className="main-section">
          <div className="main-section-header">
            <h2 className="main-section-title">내 업무일지</h2>

          </div>

          <Button variant="secondary" fullWidth>
            더보기
          </Button>
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  )
}

export default Admin
