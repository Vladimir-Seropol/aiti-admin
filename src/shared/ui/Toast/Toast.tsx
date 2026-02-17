import { create } from 'zustand'
import { useEffect } from 'react'
import styles from './Toast.module.css'
import clsx from 'clsx'

interface Toast {
  id: number
  message: string
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string) => void
  removeToast: (id: number) => void
}

let idCounter = 0

// eslint-disable-next-line react-refresh/only-export-components
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message) =>
    set((state) => ({
      toasts: [...state.toasts, { id: idCounter++, message }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export const Toast = () => {
  const { toasts, removeToast } = useToastStore()

  useEffect(() => {
    toasts.forEach((t) => {
      const timer = setTimeout(() => removeToast(t.id), 3000)
      return () => clearTimeout(timer)
    })
  }, [toasts, removeToast])

  return (
    <div className={styles.wrapper}>
      {toasts.map((t) => (
        <div key={t.id} className={clsx(styles.toast)}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
