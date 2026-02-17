import styles from "./Pagination.module.css"

interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export const Pagination = ({ page, totalPages, onChange }: Props) => {
  if (totalPages <= 1) return null

  return (
    <div className={styles.wrapper}>
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ←
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={p === page ? styles.active : ""}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        →
      </button>
    </div>
  )
}
