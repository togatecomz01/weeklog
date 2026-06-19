import './Input.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string
  required?: boolean
  hint?: string
  error?: boolean
  errorMessage?: string
}

function Input({ className = '', label, required = false, hint, error = false, errorMessage, id, ...props }: InputProps) {
  const inputClasses = ['input', error ? 'error' : '', className].filter(Boolean).join(' ')

  return (
    <div className="input-group">
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
          {required && <span className="input-required" aria-hidden>*</span>}
        </label>
      )}
      <input className={inputClasses} id={id} required={required} {...props} />
      {hint && !error && <p className="input-hint">{hint}</p>}
      {error && errorMessage && (
        <p className="input-error">{errorMessage}</p>
      )}
    </div>
  )
}

export default Input
