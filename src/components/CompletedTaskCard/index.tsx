import Button from '@/components/Button'
import SendIcon from '@/components/icons/SendIcon'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon'
import './CompletedTaskCard.scss'

type TaskStatus = 'todo' | 'doing' | 'done'

const STATUS_CONFIG: Record<TaskStatus, { title: string; label: string }> = {
  todo: { title: '금주 할 업무', label: '→ todo' },
  doing: { title: '진행중 업무', label: '→ doing' },
  done: { title: '금주 완료 업무', label: '→ done' },
}

interface CompletedTaskCardProps {
  status?: TaskStatus
  sent?: boolean
  items: string[]
  onSend?: () => void
  className?: string
}

function CompletedTaskCard({ status = 'done', sent = false, items, onSend, className = '' }: CompletedTaskCardProps) {
  const { title, label } = STATUS_CONFIG[status]

  return (
    <div className={`completed-task-card completed-task-card-${status} ${className}`.trim()}>
      <div className="completed-task-card-header">
        <span className="completed-task-card-title">{title}</span>
        <span className="completed-task-card-status">{label}</span>
      </div>
      <ol className="completed-task-card-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
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
    </div>
  )
}

export default CompletedTaskCard
