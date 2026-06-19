import { useState } from 'react'
import '../Components.scss'

import AlertPopup from '@/components/AlertPopup'
import FullPopup from '@/components/FullPopup'
import Button from '@/components/Button'

function AlertGuide() {
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [isFullOpen, setIsFullOpen] = useState(false)

    return (
        <div className="guide-content">
            <h1 className="guide-title">Popup</h1>
            <div className="guide-section">
                <h2 className="guide-section-title">알럿</h2>
                <div className="guide-example">
                    <Button fullWidth onClick={() => setIsAlertOpen(true)}>알럿 열기</Button>
                </div>
            </div>

            <div className="guide-section">
                <h2 className="guide-section-title">풀팝업</h2>
                <div className="guide-example">
                    <Button fullWidth onClick={() => setIsFullOpen(true)}>풀팝업 열기</Button>
                </div>
            </div>

            <AlertPopup
                open={isAlertOpen}
                onCancel={() => setIsAlertOpen(false)}
                onConfirm={() => setIsAlertOpen(false)}
            />
            <FullPopup
                open={isFullOpen}
                title="풀팝업"
                onClose={() => setIsFullOpen(false)}
                onCancel={() => setIsFullOpen(false)}
                onConfirm={() => setIsFullOpen(false)}
            />
        </div>
    )
}

export default AlertGuide
