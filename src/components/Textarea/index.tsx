import { useEffect, useRef } from 'react'

import './Textarea.scss'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string
    label?: string
    required?: boolean
    error?: boolean
    errorMessage?: string
}

function Textarea({
    className = '',
    label,
    required = false,
    error = false,
    errorMessage,
    id,
    rows = 1,
    onInput,
    value,
    defaultValue,
    ...props
}: TextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const textareaClasses = [
        'textarea',
        error ? 'error' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    const resizeTextarea = () => {
        const textarea = textareaRef.current

        if (!textarea) return

        const borderHeight = textarea.offsetHeight - textarea.clientHeight

        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight + borderHeight}px`
    }

    const handleInput: React.InputEventHandler<HTMLTextAreaElement> = (event) => {
        resizeTextarea()
        onInput?.(event)
    }

    useEffect(() => {
        resizeTextarea()
    }, [value, defaultValue])

    return (
        <div className="input-group">
            {label && (
                <label className="input-label" htmlFor={id}>
                    {label}
                    {required && <span className="input-required" aria-hidden>*</span>}
                </label>
            )}

            <textarea
                ref={textareaRef}
                id={id}
                className={textareaClasses}
                rows={rows}
                required={required}
                value={value}
                defaultValue={defaultValue}
                onInput={handleInput}
                {...props}
            />

            {error && errorMessage && (
                <p className="input-error">{errorMessage}</p>
            )}
        </div>
    )
}

export default Textarea
