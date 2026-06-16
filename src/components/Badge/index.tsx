import './Badge.scss'

type BadgeType = 'normal' | 'important' | 'urgent'

const BADGE_LABEL: Record<BadgeType, string> = {
  normal: '보통',
  important: '중요',
  urgent: '긴급',
}

interface BadgeProps {
  type: BadgeType
  className?: string
}

function Badge({ type, className = '' }: BadgeProps) {
  const classes = ['badge', `badge--${type}`, className].filter(Boolean).join(' ')

  return <span className={classes}>{BADGE_LABEL[type]}</span>
}

export default Badge
