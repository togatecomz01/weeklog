import './Button.scss'

type ButtonVariant = 'primary' | 'secondary' | 'send' | 'more'
type ButtonType = 'button' | 'submit' | 'reset'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: ButtonType
  variant?: ButtonVariant
  fullWidth?: boolean
  logout?: boolean
  startIcon?: React.ReactNode
}

function Button({
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  logout = false,
  startIcon,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    `btn-${variant}`,
    fullWidth ? 'btn-full' : '',
    logout ? 'btn-logout' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {startIcon && <span className="btn-icon">{startIcon}</span>}
      {children}
    </button>
  )
}

export default Button
