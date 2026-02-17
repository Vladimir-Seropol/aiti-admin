import { ReactNode } from "react"
import styles from "./MainLayout.module.css"

interface Props {
  title: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  actions?: ReactNode
  children: ReactNode
}

export const MainLayout = ({
  title,
  searchValue,
  onSearchChange,
  actions,
  children,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h2>{title}</h2>
          {actions}
        </div>

        {onSearchChange && (
          <input
            className={styles.searchInput}
            placeholder="Найти"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}
      </header>

      <main className={styles.content}>{children}</main>
    </div>
  )
}
