export type SortOrder = 'asc' | 'desc' | null

export interface Column<T> {
  key: keyof T | 'selection' | 'actions' 
  title: string | React.ReactNode 
  sortable?: boolean
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T) => React.ReactNode
}