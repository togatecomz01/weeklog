import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '@/components/Button'
import DetailHeader from '@/components/DetailHeader'
import AlertPopup from '@/components/AlertPopup'
import { useAuth } from '@/contexts/AuthContext'
import icoInfo from '@/assets/svg/ico_info.svg'
import './MySwit.scss'

function MySwitPage() {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const { token, apiFetch } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [switConnected, setSwitConnected] = useState<boolean | null>(null)
  const [switConnectedAlert, setSwitConnectedAlert] = useState(false)
  const [switDisconnectAlert, setSwitDisconnectAlert] = useState(false)

  useEffect(() => {
    apiFetch('/api/swit/status')
      .then((r) => r.json())
      .then((d) => setSwitConnected(d.connected))
      .catch(() => setSwitConnected(false))
  }, [apiFetch])

  useEffect(() => {
    if (searchParams.get('swit') === 'connected') {
      setSwitConnected(true)
      setSwitConnectedAlert(true)
      const next = new URLSearchParams(searchParams)
      next.delete('swit')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  async function handleSwitDisconnect() {
    await apiFetch('/api/swit/disconnect', { method: 'DELETE' })
    setSwitConnected(false)
    setSwitDisconnectAlert(true)
  }

  function handleSwitConnect() {
    window.location.href = `/api/swit/connect?token=${token}`
  }

  return (
    <div className="my-swit">
      <DetailHeader title="Swit 연결 확인" scrollTargetRef={contentRef} onClick={() => navigate(-1)} />
      <div ref={contentRef} className="my-swit-content">
        <div className="my-swit-section">
          <h2 className="my-swit-section-title">Swit 연동</h2>
          <div className="swit-card">
            <div className="swit-card-status">
              <span className="swit-card-status-label">연결 상태</span>
              {switConnected === null && (
                <span className="swit-card-status-value">확인 중...</span>
              )}
              {switConnected === false && (
                <span className="swit-card-status-value is-disconnected">연결되지 않음</span>
              )}
              {switConnected === true && (
                <span className="swit-card-status-value is-connected">연결됨</span>
              )}
            </div>
            {switConnected === false && (
              <Button variant="primary" onClick={handleSwitConnect}>Swit 계정 연결하기</Button>
            )}
            {switConnected === true && (
              <Button onClick={handleSwitDisconnect}>연결 해제</Button>
            )}
          </div>
          <div className="swit-info-box">
            <img src={icoInfo} alt="" className="swit-info-icon" />
            <p className="swit-info-text">Swit 계정 연결 시 업무일지 전송이 가능합니다.</p>
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
        open={switDisconnectAlert}
        message="Swit 연결이 해제되었습니다."
        onCancel={() => setSwitDisconnectAlert(false)}
        cancelText="닫기"
      />
    </div>
  )
}

export default MySwitPage
