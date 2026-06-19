import Badge from '@/components/Badge'
import './WeekCard.scss'

type BadgeType = 'normal' | 'important' | 'urgent'
type SendStatus = 'unsent' | 'partial' | 'sent'

interface WeekCardProps {
  week: string
  priority: BadgeType
  content: string
  status?: SendStatus
  className?: string
}

const STATUS_LABEL: Record<SendStatus, string> = {
  unsent: '미전송',
  partial: '일부 전송',
  sent: '전송완료',
}

function WeekCard({ week, priority, content, status = 'unsent', className = '' }: WeekCardProps) {
  return (
    <div className={`week-card week-card-${status} ${className}`.trim()}>
      <div className="week-card-header">
        <span className="week-card-title">week: {week}</span>
        <Badge type={priority} />
        <div className="week-card-status">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17 17" fill="none">
            <path d="M15.7501 0.75L7.41675 9.0833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.75 0.75L10.75 15.75L7.41667 9.0833L0.75 5.75L15.75 0.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="week-card-status-label">{STATUS_LABEL[status]}</span>
        </div>
      </div>
      <div className="week-card-content">
        <p>
          {content.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}

export default WeekCard
