import './AlertPopup.scss'

interface AlertPopupProps {
  open: boolean
  message?: string
  cancelText?: string
  confirmText?: string
  className?: string
  onCancel?: () => void
  onConfirm?: () => void
}

function AlertPopup({
  open,
  message = '임시저장 하시겠습니까?',
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
        <div className="alert-pop-btns">
          <button type="button" className="alert-pop-btn alert-pop-cancel" onClick={onCancel}>{cancelText}</button>
          <button type="button" className="alert-pop-btn alert-pop-confirm" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}

export default AlertPopup
