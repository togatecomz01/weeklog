import Badge from '@/components/Badge'
import './WeekCard.scss'
import unsentIcon from '@/assets/images/unsent.png'
import partialIcon from '@/assets/images/partial.png'
import sentIcon from '@/assets/images/sent.png'

type BadgeType = 'normal' | 'important' | 'urgent'
type SendStatus = 'unsent' | 'partial' | 'sent'

interface WeekCardProps {
  week: string
  priority: BadgeType
  content: string
  status?: SendStatus
  className?: string
  onClick?: () => void
}

const STATUS_ICON: Record<SendStatus, string> = {
  unsent: unsentIcon,
  partial: partialIcon,
  sent: sentIcon,
}

function WeekCard({ week, priority, content, status = 'unsent', className = '', onClick }: WeekCardProps) {
  const cardContent = (
    <>
      <div className="week-card-top">
        <div className="card-icon">
          <img
            src={STATUS_ICON[status]}
            alt=""
            aria-hidden="true"
          />
        </div>
        <div className="card-info">
          <span className="card-label">Week</span>

          <strong className="card-week">{week} 업무일지</strong>

          <div className="card-badge-group">
            <Badge type={status} />
            <Badge type={priority} />
          </div>
        </div>
      </div>
      <div className="week-card-content">
        <p className="tit">주요업무</p>
        <p>
          {content.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        className={`week-card ${className}`.trim()}
        onClick={onClick}
      >
        {cardContent}
      </button>
    )
  }

  return (
    <div className={`week-card ${className}`.trim()}>{cardContent}</div>
  )
}

export default WeekCard
