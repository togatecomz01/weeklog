import './Radio.scss'

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

function Radio({ label, className = '', ...props }: RadioProps) {
  return (
    <label className={`radio ${className}`.trim()}>
      <input className="radio__input" type="radio" {...props} />
      <span className="radio__icon radio__icon--checked">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8.5" fill="white" stroke="#2563EB"/>
          <circle cx="9" cy="9" r="5.5" fill="#2563EB" stroke="#2563EB"/>
        </svg>
      </span>
      <span className="radio__icon radio__icon--unchecked">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8.5" fill="white" stroke="#D1D5DB"/>
        </svg>
      </span>
      <span className="radio__label">{label}</span>
    </label>
  )
}

export default Radio
