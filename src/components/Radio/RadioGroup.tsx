import './RadioGroup.scss'

interface RadioGroupProps {
  children: React.ReactNode
  className?: string
}

function RadioGroup({ children, className = '' }: RadioGroupProps) {
  return (
    <div className={`radio-group ${className}`.trim()}>
      {children}
    </div>
  )
}

export default RadioGroup
