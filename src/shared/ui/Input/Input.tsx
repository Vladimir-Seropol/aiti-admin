import styles from './Input.module.css'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  noIcon?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ noIcon, className, ...props }, ref) => {
    const inputClassName = `${styles.input} ${noIcon ? styles.noIcon : ''} ${className || ''}`
    
    return <input ref={ref} className={inputClassName} {...props} />
  }
)

Input.displayName = 'Input'