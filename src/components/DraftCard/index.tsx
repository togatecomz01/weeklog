import './DraftCard.scss'

interface DraftCardProps {
    savedAt: string
}

function DraftCard({ savedAt }: DraftCardProps) {
  return (
    <div className="draft-card">
        <p className="draft-card-date">{savedAt} 저장한 글이 있어요.</p>
    </div>
  )
}

export default DraftCard