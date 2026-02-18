import styles from './Table.module.css'
import { Column, SortOrder } from './Table.types'
import clsx from 'clsx'

interface Props<T> {
  data: T[]
  columns: Column<T>[]
  sortBy: keyof T | null
  order: SortOrder
  onSort?: (field: keyof T) => void
  rowClassName?: (row: T) => string | undefined 
}

export function Table<T extends { id: number }>({
  data,
  columns,
  sortBy,
  order,
  onSort,
  rowClassName, 
}: Props<T>) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={String(column.key)}
              onClick={() =>
                column.sortable &&
                onSort?.(column.key as keyof T)
              }
              className={clsx({
                [styles.sortable]: column.sortable,
              })}
            >
              {column.title}

              {sortBy === column.key && order && (
                <span className={styles.sortIcon}>
                  {order === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr 
            key={row.id}
            className={rowClassName?.(row)} 
          >
            {columns.map((column) => {
              const value = row[column.key as keyof T]

              return (
                <td key={String(column.key)}>
                  {column.render
                    ? column.render(value, row)
                    : String(value ?? '')}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}