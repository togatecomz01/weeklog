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
        <p className="radio-group-label">
          {label}
          {required && <span className="radio-group-required" aria-hidden>*</span>}
        </p>
      )}
      <div className="radio-group-items">
        {children}
      </div>
    </div>
  )
}

export default RadioGroup
