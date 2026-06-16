import './ButtonContainer.scss'

function ButtonContainer({
    children }: { children: React.ReactNode }) {
    return (
        <div className="button-container">
            {children}
        </div>
    )
}

export default ButtonContainer
