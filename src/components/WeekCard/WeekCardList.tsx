import './WeekCardList.scss'

interface WeekCardListProps {
  children: React.ReactNode
  className?: string
}

function WeekCardList({ children, className = '' }: WeekCardListProps) {
  return (
    <div className={`week-card-list ${className}`.trim()}>
      {children}
    </div>
  )
}

export default WeekCardList
