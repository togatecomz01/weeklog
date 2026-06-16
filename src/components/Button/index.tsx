import './Button.scss'

type ButtonVariant = 'primary' | 'secondary' | 'inbox'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
  logout?: boolean
  startIcon?: React.ReactNode
}

function Button({
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
    `btn--${variant}`,
    fullWidth ? 'btn--full' : '',
    logout ? 'btn--logout' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...props}>
      {startIcon && <span className="btn__icon">{startIcon}</span>}
      {children}
    </button>
  )
}

export default Button
