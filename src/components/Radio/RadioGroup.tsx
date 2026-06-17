import './RadioGroup.scss'

interface RadioGroupProps {
  children: React.ReactNode
  label?: string
  required?: boolean
  className?: string
}

function RadioGroup({ children, label, required = false, className = '' }: RadioGroupProps) {
  return (
    <div className={`radio-group ${className}`.trim()}>
      {label && (
        <p className="radio-group__label">
          {label}
          {required && <span className="radio-group__required" aria-hidden>*</span>}
        </p>
      )}
      <div className="radio-group__items">
        {children}
      </div>
    </div>
  )
}

export default RadioGroup
