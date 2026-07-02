import { useRef } from 'react'
import './Input.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string
  required?: boolean
  hint?: string
  error?: boolean
  errorMessage?: string
}

function Input({ className = '', label, required = false, hint, error = false, errorMessage, id, onClick, ...props }: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputClasses = ['input', error ? 'error' : '', className].filter(Boolean).join(' ')

  function handleClick(e: React.MouseEvent<HTMLInputElement>) {
    if (props.type === 'date') {
      (inputRef.current as any)?.showPicker?.()
    }
    onClick?.(e)
  }

  return (
    <div className="input-group">
      {label && (
        <label
          className="input-label"
          htmlFor={id}
          onClick={(e) => e.preventDefault()}
        >
          {label}
          {required && <span className="input-required" aria-hidden>*</span>}
        </label>
      )}
      <input ref={inputRef} className={inputClasses} id={id} required={required} onClick={handleClick} {...props} />
      {hint && !error && <p className="input-hint">{hint}</p>}
      {error && errorMessage && (
        <p className="input-error">{errorMessage}</p>
      )}
    </div>
  )
}

export default Input
