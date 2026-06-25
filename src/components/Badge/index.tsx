import './Badge.scss'

type PriorityBadgeType = 'normal' | 'important' | 'urgent'
type StatusBadgeType = 'unsent' | 'partial' | 'sent'

export type BadgeType = PriorityBadgeType | StatusBadgeType

const BADGE_LABEL: Record<BadgeType, string> = {
  normal: '보통',
  important: '중요',
  urgent: '긴급',
  unsent: '미전송',
  partial: '일부 전송',
  sent: '전송완료',
}

interface BadgeProps {
  type: BadgeType
  className?: string
}

function Badge({ type, className = '' }: BadgeProps) {
  const classes = ['badge', `badge-${type}`, className].filter(Boolean).join(' ')

  return <span className={classes}>{BADGE_LABEL[type]}</span>
}

export default Badge
