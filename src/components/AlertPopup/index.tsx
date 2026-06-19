import Button from '@/components/Button'
import './AlertPopup.scss'

interface AlertPopupProps {
  open: boolean
  message?: string
  description?: string
  cancelText?: string
  confirmText?: string
  className?: string
  onCancel?: () => void
  onConfirm?: () => void
}

function AlertPopup({
  open,
  message = '임시저장 하시겠습니까?',
  description,
  cancelText = '취소',
  confirmText = '확인',
  className = '',
  onCancel,
  onConfirm,
}: AlertPopupProps) {
  if (!open) return null

  const classes = ['alert-pop', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div className="alert-pop-box">
        <p className="alert-pop-msg">{message}</p>
        {description && <p className="alert-pop-desc">{description}</p>}
        <div className="alert-pop-btns">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button variant="primary" fullWidth onClick={onConfirm}>
              {confirmText}
            </Button>)
          }
        </div>
      </div>
    </div>
  )
}

export default AlertPopup
