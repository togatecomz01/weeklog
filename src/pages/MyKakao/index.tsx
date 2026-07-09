import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '@/components/Button'
import DetailHeader from '@/components/DetailHeader'
import AlertPopup from '@/components/AlertPopup'
import { useAuth } from '@/contexts/AuthContext'
import icoInfo from '@/assets/svg/ico_info.svg'
import './MyKakao.scss'

function MyKakaoPage() {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const { token, apiFetch } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [kakaoConnected, setKakaoConnected] = useState<boolean | null>(null)
  const [kakaoConnectedAlert, setKakaoConnectedAlert] = useState(false)
  const [kakaoDisconnectAlert, setKakaoDisconnectAlert] = useState(false)
  const [kakaoConnectErrorAlert, setKakaoConnectErrorAlert] = useState(false)

  useEffect(() => {
    apiFetch('/api/kakao/status')
      .then((r) => r.json())
      .then((d) => setKakaoConnected(d.connected))
      .catch(() => setKakaoConnected(false))
  }, [apiFetch])

  useEffect(() => {
    if (searchParams.get('kakao') === 'connected') {
      setKakaoConnected(true)
      setKakaoConnectedAlert(true)
      const next = new URLSearchParams(searchParams)
      next.delete('kakao')
      setSearchParams(next, { replace: true })
    }
    if (searchParams.get('kakao') === 'error') {
      setKakaoConnectErrorAlert(true)
      const next = new URLSearchParams(searchParams)
      next.delete('kakao')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  async function handleKakaoDisconnect() {
    await apiFetch('/api/kakao/disconnect', { method: 'DELETE' })
    setKakaoConnected(false)
    setKakaoDisconnectAlert(true)
  }

  function handleKakaoConnect() {
    window.location.href = `/api/kakao/connect?token=${token}`
  }

  return (
    <div className="my-kakao">
      <DetailHeader title="카카오톡 연결 확인" scrollTargetRef={contentRef} onClick={() => navigate('/my')} />
      <div ref={contentRef} className="my-kakao-content">
        <div className="my-kakao-section">
          <h2 className="my-kakao-section-title">카카오톡 연동</h2>
          <div className="kakao-card">
            <div className="kakao-card-status">
              <span className="kakao-card-status-label">연결 상태</span>
              {kakaoConnected === null && (
                <span className="kakao-card-status-value">확인 중...</span>
              )}
              {kakaoConnected === false && (
                <span className="kakao-card-status-value is-disconnected">연결되지 않음</span>
              )}
              {kakaoConnected === true && (
                <span className="kakao-card-status-value is-connected">연결됨</span>
              )}
            </div>
            {kakaoConnected === false && (
              <Button variant="primary" onClick={handleKakaoConnect}>카카오톡 계정 연결하기</Button>
            )}
            {kakaoConnected === true && (
              <Button onClick={handleKakaoDisconnect}>카카오톡 계정 연결 해제</Button>
            )}
          </div>
          <div className="kakao-info-box">
            <img src={icoInfo} alt="" className="kakao-info-icon" />
            <p className="kakao-info-text">카카오톡 계정을 연결하면 중요도가 ‘매우 높음’인 업무 알림을 카카오톡으로 받을 수 있습니다.</p>
          </div>
        </div>
      </div>

      <AlertPopup
        open={kakaoConnectedAlert}
        message="카카오톡 계정이 연결되었습니다."
        onCancel={() => setKakaoConnectedAlert(false)}
        cancelText="닫기"
      />
      <AlertPopup
        open={kakaoDisconnectAlert}
        message="카카오톡 계정 연결이 해제되었습니다."
        description={`중요도가 ‘매우 높음'인 업무 알림을 받으려면\n카카오톡 계정을 다시 연결해 주세요.`}
        onCancel={() => setKakaoDisconnectAlert(false)}
        cancelText="닫기"
      />
      <AlertPopup
        open={kakaoConnectErrorAlert}
        message="카카오톡 계정 연결에 실패했습니다."
        description={`다시 시도해 주세요.`}
        onCancel={() => setKakaoConnectErrorAlert(false)}
        cancelText="닫기"
      />
    </div>
  )
}

export default MyKakaoPage
