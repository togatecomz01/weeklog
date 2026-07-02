import { useEffect, useRef, useState } from 'react'
import './Input.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string
  required?: boolean
  hint?: string
  tooltip?: string
  error?: boolean
  errorMessage?: string
}

function Input({ className = '', label, required = false, hint, tooltip, error = false, errorMessage, id, onClick, ...props }: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const inputClasses = ['input', error ? 'error' : '', className].filter(Boolean).join(' ')

  useEffect(() => {
    if (!tooltipOpen) return
    function handleOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setTooltipOpen(false)
      }
    }
    document.addEventListener('click', handleOutside)
    return () => document.removeEventListener('click', handleOutside)
  }, [tooltipOpen])

  function handleClick(e: React.MouseEvent<HTMLInputElement>) {
    if (props.type === 'date') {
      (inputRef.current as any)?.showPicker?.()
    }
    onClick?.(e)
  }

  return (
    <div className="input-group">
      {label && (
        <div className="input-label-row">
          <label
            className="input-label"
            htmlFor={id}
            onClick={(e) => e.preventDefault()}
          >
            {label}
            {required && <span className="input-required" aria-hidden>*</span>}
          </label>
          {tooltip && (
            <span
              ref={tooltipRef}
              className="input-tooltip"
              onClick={() => setTooltipOpen((v) => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="input-tooltip-icon">
                <path d="M7.99998 14.1667C11.4057 14.1667 14.1666 11.4058 14.1666 8C14.1666 4.59424 11.4057 1.83333 7.99998 1.83333C4.59422 1.83333 1.83331 4.59424 1.83331 8C1.83331 11.4058 4.59422 14.1667 7.99998 14.1667Z" stroke="#999999"/>
                <path d="M8 7.87533V11.2087" stroke="#999999" strokeLinecap="round"/>
                <path d="M8.00002 6.45867C8.46026 6.45867 8.83335 6.08557 8.83335 5.62533C8.83335 5.1651 8.46026 4.792 8.00002 4.792C7.53978 4.792 7.16669 5.1651 7.16669 5.62533C7.16669 6.08557 7.53978 6.45867 8.00002 6.45867Z" fill="#999999"/>
              </svg>
              {tooltipOpen && <span className="input-tooltip-text">{tooltip}</span>}
            </span>
          )}
        </div>
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
