import '../Components.scss'

import ButtonContainer from '@/components/ButtonContainer'
import Badge from '@/components/Badge'

function BadgeGuide() {
    return (
        <div className="guide-content">
            <h1 className="guide-title">Badge</h1>
            <div className="guide-section">
                <div className="guide-example">
                <ButtonContainer>
                    <Badge type="normal" />
                    <Badge type="important" />
                    <Badge type="urgent" />
                </ButtonContainer>
                </div>
            </div>
        </div>
    )
}

export default BadgeGuide