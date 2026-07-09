import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '@/components/Button'
import DetailHeader from '@/components/DetailHeader'
import BottomNav from '@/components/BottomNav'
import AlertPopup from '@/components/AlertPopup'
import ScrollTop from '@/components/ScrollTop'
import { useAuth } from '@/contexts/AuthContext'
import icoRArr from '@/assets/svg/ico_h_arr.svg'
import './MyPage.scss'

function MyPage() {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const { user, logout, apiFetch } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isAdmin = user?.role === 'admin'
  const [switConnected, setSwitConnected] = useState<boolean | null>(null)
  const [switConnectedAlert, setSwitConnectedAlert] = useState(false)
  const [kakaoConnected, setKakaoConnected] = useState<boolean | null>(null)
  const [kakaoConnectedAlert, setKakaoConnectedAlert] = useState(false)

  useEffect(() => {
    apiFetch('/api/swit/status')
      .then((r) => r.json())
      .then((d) => setSwitConnected(d.connected))
      .catch(() => setSwitConnected(false))
  }, [apiFetch])

  useEffect(() => {
    if (!isAdmin) return
    apiFetch('/api/kakao/status')
      .then((r) => r.json())
      .then((d) => setKakaoConnected(d.connected))
      .catch(() => setKakaoConnected(false))
  }, [apiFetch, isAdmin])

  useEffect(() => {
    if (searchParams.get('swit') === 'connected') {
      setSwitConnected(true)
      setSwitConnectedAlert(true)
      const next = new URLSearchParams(searchParams)
      next.delete('swit')
      setSearchParams(next, { replace: true })
    }
    if (searchParams.get('kakao') === 'connected') {
      setKakaoConnected(true)
      setKakaoConnectedAlert(true)
      const next = new URLSearchParams(searchParams)
      next.delete('kakao')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  return (
    <div className={`mypage${user?.role === 'admin' ? ' is-admin' : ''}`}>
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
          <h2 className="mypage-section-title">계정 설정</h2>
          <div className="mypage-menu-list">
            <button type="button" className="mypage-menu-item" onClick={() => navigate('/my/password')}>
              <div className="mypage-menu-item-info">
                <span className="mypage-menu-item-title">비밀번호 변경</span>
                <span className="mypage-menu-item-desc">계정 비밀번호를 변경할 수 있습니다.</span>
              </div>
              <img src={icoRArr} alt="" className="mypage-menu-item-arrow" />
            </button>
            <button type="button" className="mypage-menu-item" onClick={() => navigate('/my/swit')}>
              <div className="mypage-menu-item-info">
                <div className="mypage-menu-item-title-row">
                  <span className="mypage-menu-item-title">Swit 연결 확인</span>
                  {switConnected === false && (
                    <span className="mypage-menu-item-tag">미등록</span>
                  )}
                  {switConnected === true && (
                    <span className="mypage-menu-item-tag is-registered">등록</span>
                  )}
                </div>
                <span className="mypage-menu-item-desc">Swit 에 연동된 계정을 관리 할 수 있습니다.</span>
              </div>
              <img src={icoRArr} alt="" className="mypage-menu-item-arrow" />
            </button>
            {isAdmin && (
              <button type="button" className="mypage-menu-item" onClick={() => navigate('/my/kakao')}>
                <div className="mypage-menu-item-info">
                  <div className="mypage-menu-item-title-row">
                    <span className="mypage-menu-item-title">카카오톡 연결 확인</span>
                    {kakaoConnected === false && (
                      <span className="mypage-menu-item-tag">미등록</span>
                    )}
                    {kakaoConnected === true && (
                      <span className="mypage-menu-item-tag is-registered">등록</span>
                    )}
                  </div>
                  <span className="mypage-menu-item-desc">카카오톡 에 연동된 계정을 관리할 수 있습니다.</span>
                </div>
                <img src={icoRArr} alt="" className="mypage-menu-item-arrow" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AlertPopup
        open={switConnectedAlert}
        message="Swit 계정이 연결되었습니다."
        onCancel={() => setSwitConnectedAlert(false)}
        cancelText="닫기"
      />
      <AlertPopup
        open={kakaoConnectedAlert}
        message="카카오톡 계정이 연결되었습니다."
        onCancel={() => setKakaoConnectedAlert(false)}
        cancelText="닫기"
      />
      <ScrollTop scrollTargetRef={contentRef} />
      <BottomNav active="my" />
    </div>
  )
}

export default MyPage
