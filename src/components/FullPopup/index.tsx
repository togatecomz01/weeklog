import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import DetailHeader from '@/components/DetailHeader'
import ScrollTop from '@/components/ScrollTop'
import './FullPopup.scss'
import { useEffect, useRef } from 'react'

type FullPopupHeaderType = 'back' | 'close'

interface FullPopupProps {
  open: boolean
  title: string
  headerType?: FullPopupHeaderType
  cancelText?: string
  confirmText?: string
  confirmDisabled?: boolean
  className?: string
  children?: React.ReactNode
  onClose?: () => void
  onCancel?: () => void
  onConfirm?: () => void
}

function FullPopup({
  open,
  title,
  headerType = 'close',
  cancelText = '취소',
  confirmText = '확인',
  confirmDisabled = false,
  className = '',
  children,
  onClose,
  onCancel,
  onConfirm,
}: FullPopupProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
    }
  }, [open])

  if (!open) return null

  const classes = ['full-pop', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <DetailHeader title={title} type={headerType} scrollTargetRef={bodyRef} className="full-pop-head" onClick={onClose} />
      <div ref={bodyRef} className="full-pop-body">{children}</div>
      <div className="full-pop-foot">
        <ButtonContainer>
          <Button variant="secondary" onClick={onCancel}>{cancelText}</Button>
          <Button onClick={onConfirm} disabled={confirmDisabled}>{confirmText}</Button>
        </ButtonContainer>
      </div>
      <ScrollTop scrollTargetRef={bodyRef} />
    </div>
  )
}

export default FullPopup
