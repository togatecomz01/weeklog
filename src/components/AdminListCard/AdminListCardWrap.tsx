import './AdminListCard.scss'

interface AdminListCardWrapProps {
    children: React.ReactNode
    className?: string
}

function AdminListCardWrap({ children, className = '' }: AdminListCardWrapProps) {
  return (
    <div className={`admin-card-list ${className}`.trim()}>
      {children}
    </div>
  )
}

export default AdminListCardWrap
