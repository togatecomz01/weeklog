import './DraftCard.scss'
import ArrowIcon from '@/components/icons/ArrowIcon'

interface DraftCardProps {
    savedAt: string
    onClick: () => void
}
  
function DraftCard({ savedAt, onClick }: DraftCardProps) {
  return (
    <div className="draft-card">
        <button type="button" className="draft-card-btn" onClick={onClick}>
            임시저장 글 이어쓰기{<ArrowIcon />}
        </button>
        <p className="draft-card-date">{savedAt} 저장한 글이 있어요.</p>
    </div>
  )
}

export default DraftCard