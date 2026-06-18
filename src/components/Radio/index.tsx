import './Radio.scss'

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

function Radio({ label, className = '', ...props }: RadioProps) {
  return (
    <label className={`radio ${className}`.trim()}>
      <input className="radio-input" type="radio" {...props} />
      <span className="radio-label">{label}</span>
    </label>
  )
}

export default Radio
