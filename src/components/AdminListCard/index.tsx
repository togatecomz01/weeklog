import Badge from '@/components/Badge'
import './AdminListCard.scss'

type BadgeType = 'normal' | 'important' | 'urgent'

interface AdminListCardProps {
    tit: string
    subTit: string
    priority: BadgeType
    content: string
    className?: string
    onClick?: () => void
}

function AdminListCard({ tit, subTit, content, priority = 'normal', className = '', onClick }: AdminListCardProps) {
    const cardContent = (
        <>
            <div className="admin-card-top">
                <div className="acc-info user">
                    <strong className="tit">{tit}</strong>
                    <span className="sub-tit">{subTit}</span>
                </div>
                <Badge type={priority} />
            </div>
            <div className="admin-card-content">
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
            className={`admin-week-card ${className}`.trim()}
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

export default AdminListCard
