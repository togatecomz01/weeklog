import Button from '@/components/Button'
import SendIcon from '@/components/icons/SendIcon'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon'
import './CompletedTaskCard.scss'

type TaskStatus = 'todo' | 'doing' | 'done'

const STATUS_CONFIG: Record<TaskStatus, { title: string; label: string }> = {
  todo: { title: '차주 예정 업무', label: '→ todo' },
  doing: { title: '진행 업무', label: '→ doing' },
  done: { title: '금주 완료 업무', label: '→ done' },
}

interface CompletedTaskCardProps {
  title?: string
  status?: TaskStatus
  sent?: boolean
  items: string[]
  onSend?: () => void
  className?: string
}

function CompletedTaskCard({ title, status, sent = false, items, onSend, className = '' }: CompletedTaskCardProps) {
  const statusConfig = status ? STATUS_CONFIG[status] : null
  const cardTitle = title || statusConfig?.title
  const classes = ['completed-task-card', status ? `completed-task-card-${status}` : '', className].filter(Boolean).join(' ')
  const hasFooter = sent || Boolean(onSend)

  return (
    <div className={classes}>
      <div className="completed-task-card-header">
        <span className="completed-task-card-title">{cardTitle}</span>
        {statusConfig && <span className="completed-task-card-status">{statusConfig.label}</span>}
      </div>
      <ol className="completed-task-card-items">
        {items.map((item, index) => (
          <li key={index}>{index + 1}. {item}</li>
        ))}
      </ol>
      {hasFooter && (
        <div className="completed-task-card-footer">
          {sent ? (
            <Button variant="inbox" fullWidth startIcon={<CheckCircleIcon />} disabled>
              전송 완료
            </Button>
          ) : (
            <Button variant="inbox" fullWidth startIcon={<SendIcon />} onClick={onSend}>
              스윗으로 보내기
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default CompletedTaskCard
