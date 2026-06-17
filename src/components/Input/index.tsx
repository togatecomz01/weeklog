import './Input.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string
  required?: boolean
  error?: boolean
  errorMessage?: string
}

function Input({ className = '', label, required = false, error = false, errorMessage, id, ...props }: InputProps) {
  const inputClasses = ['input', error ? 'input--error' : '', className].filter(Boolean).join(' ')

  return (
    <div className="input-group">
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
          {required && <span className="input-required" aria-hidden>*</span>}
        </label>
      )}
      <input className={inputClasses} id={id} required={required} {...props} />
      {error && errorMessage && (
        <p className="input-error">{errorMessage}</p>
      )}
    </div>
  )
}

export default Input
