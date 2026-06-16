import './CompletedTaskCardList.scss'

interface CompletedTaskCardListProps {
  children: React.ReactNode
  className?: string
}

function CompletedTaskCardList({ children, className = '' }: CompletedTaskCardListProps) {
  return (
    <div className={`completed-task-card-list ${className}`.trim()}>
      {children}
    </div>
  )
}

export default CompletedTaskCardList
