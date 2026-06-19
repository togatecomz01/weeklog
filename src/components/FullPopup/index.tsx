import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import DetailHeader from '@/components/DetailHeader'
import './FullPopup.scss'
import { useEffect } from 'react'

type FullPopupHeaderType = 'back' | 'close'

interface FullPopupProps {
  open: boolean
  title: string
  headerType?: FullPopupHeaderType
  cancelText?: string
  confirmText?: string
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
  className = '',
  children,
  onClose,
  onCancel,
  onConfirm,
}: FullPopupProps) {

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const classes = ['full-pop', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <DetailHeader title={title} type={headerType} className="full-pop-head" onClick={onClose} />
      <div className="full-pop-body">{children}</div>
      <div className="full-pop-foot">
        <ButtonContainer>
          <Button variant="secondary" fullWidth onClick={onCancel}>{cancelText}</Button>
          <Button fullWidth onClick={onConfirm}>{confirmText}</Button>
        </ButtonContainer>
      </div>
    </div>
  )
}

export default FullPopup
