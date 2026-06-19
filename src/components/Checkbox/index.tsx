import './Checkbox.scss'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

function Checkbox({ label, className = '', id, ...props }: CheckboxProps) {
  return (
    <label className={`checkbox ${className}`.trim()}>
      <input type="checkbox" className="checkbox-input" id={id} {...props} />
      <span className="checkbox-box" />
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  )
}

export default Checkbox
