import styles from './Skeleton.module.css'

interface Props {
  rows?: number
  columns?: number
}

 const Skeleton = ({ rows = 5, columns = 4 }: Props) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i}>
              <div className={styles.skeletonHeader} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: columns }).map((_, j) => (
              <td key={j}>
                <div className={styles.skeletonCell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Skeleton


