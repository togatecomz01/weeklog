import SendIcon from '@/components/icons/SendIcon'
import CheckCircleSolidIcon from '@/components/icons/CheckCircleSolidIcon'
import './CompletedTaskCard.scss'
import Button from '../Button'

type TaskStatus = 'todo' | 'doing' | 'done'

const STATUS_TITLE: Record<TaskStatus, string> = {
  todo: '차주 예정 업무',
  doing: '진행 업무',
  done: '금주 완료 업무',
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
  const cardTitle = title || (status ? STATUS_TITLE[status] : '')
  const classes = ['completed-task-card', className].filter(Boolean).join(' ')
  const hasAction = sent || Boolean(onSend)

  return (
    <div className={classes}>
      <div className="completed-task-card-header">
        <span className="completed-task-card-title">{cardTitle}</span>
        {hasAction && (
          sent ? (
            <span className="completed-task-card-sent-icon">
              <CheckCircleSolidIcon />
              전송 완료
            </span>
          ) : (
            <Button variant="send" onClick={onSend}><SendIcon />보내기</Button>
          )
        )}
      </div>
      <ol className="completed-task-card-items">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </div>
  )
}

export default CompletedTaskCard
