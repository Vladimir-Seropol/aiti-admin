import styles from './Checkbox.module.css'
import { InputHTMLAttributes } from 'react'

export const Checkbox = ({
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label className={styles.wrapper}>
      <input type="checkbox" {...props} />
      <span />
    </label>
  )
}
