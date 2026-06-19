import type { ReactNode } from 'react'
import './ButtonContainer.scss'

function ButtonContainer({
    children }: { children: ReactNode }) {
    return (
        <div className="button-container">
            {children}
        </div>
    )
}

export default ButtonContainer
