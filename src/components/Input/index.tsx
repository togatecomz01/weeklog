import './Input.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  error?: boolean
  errorMessage?: string
}

function Input({ className = '', error = false, errorMessage, ...props }: InputProps) {
  const inputClasses = ['input', error ? 'input--error' : '', className].filter(Boolean).join(' ')

  return (
    <div className="input-wrapper">
      <input className={inputClasses} {...props} />
      {error && errorMessage && (
        <p className="input-wrapper__error">{errorMessage}</p>
      )}
    </div>
  )
}

export default Input
