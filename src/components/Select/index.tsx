import { useState, useRef, useEffect } from 'react'
import './Select.scss'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  required?: boolean
  className?: string
}

function Select({ options, value, onChange, placeholder = '선택하세요', disabled = false, label, required = false, className = '' }: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(optionValue: string) {
    onChange?.(optionValue)
    setOpen(false)
  }

  return (
    <div className={`select ${className}`.trim()} ref={ref}>
      {label && (
        <p className="select__label">
          {label}
          {required && <span className="select__required" aria-hidden>*</span>}
        </p>
      )}
      <button
        type="button"
        className={`select__trigger ${open ? 'select__trigger--open' : ''} ${disabled ? 'select__trigger--disabled' : ''}`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <span className={selected ? 'select__value' : 'select__placeholder'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`select__arrow ${open ? 'select__arrow--up' : ''}`}>
          <mask id="mask0_102_4823" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <path d="M24 24L24 0L0 2.86197e-07L2.86197e-07 24L24 24Z" fill="#222222"/>
          </mask>
          <g mask="url(#mask0_102_4823)">
            <path fillRule="evenodd" clipRule="evenodd" d="M19.6241 7.97578C19.8584 8.2101 19.8584 8.59 19.6241 8.82431L12.4241 16.0243C12.1898 16.2586 11.8099 16.2586 11.5755 16.0243L4.37554 8.82431C4.14122 8.59 4.14122 8.2101 4.37554 7.97578C4.60985 7.74147 4.98975 7.74147 5.22407 7.97578L11.9998 14.7515L18.7755 7.97578C19.0099 7.74147 19.3898 7.74147 19.6241 7.97578Z" fill="#666666"/>
          </g>
        </svg>
      </button>

      {open && (
        <ul className="select__dropdown">
          {options.map((option) => (
            <li
              key={option.value}
              className={`select__option ${option.value === value ? 'select__option--selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Select
