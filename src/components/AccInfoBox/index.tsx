import './AccInfoBox.scss'

type AccInfoBoxType = 'user' | 'date'

interface AccInfoBoxProps {
    type: AccInfoBoxType
    tit: string
    subTit: string
}

function AccInfoBox({ type, tit, subTit }: AccInfoBoxProps) {
    return (
        <div className={`acc-info ${type}`}>
            <strong className="tit">{tit}</strong>
            <span className="sub-tit">{subTit}</span>
        </div>
    )
}

export default AccInfoBox