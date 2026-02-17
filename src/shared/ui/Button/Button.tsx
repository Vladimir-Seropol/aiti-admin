import styles from './Button.module.css'
import clsx from 'clsx'
import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link'  
}

export const Button = ({
  children,
  variant = 'primary',
  ...props
}: Props) => {
  return (
    <button
      className={clsx(styles.button, styles[variant])}
      {...props}
    >
      {children}
    </button>
  )
}