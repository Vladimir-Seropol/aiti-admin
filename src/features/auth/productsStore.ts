import { create } from 'zustand'
import { Product } from '../../shared/types/product'

interface ProductsSortState {
  sortBy: keyof Product | null
  order: 'asc' | 'desc' | null
  setSort: (field: keyof Product, newOrder: 'asc' | 'desc' | null) => void
}

export const useProductsStore = create<ProductsSortState>((set) => ({
  sortBy: (localStorage.getItem('sortBy') as keyof Product) || null,
  order: (localStorage.getItem('order') as 'asc' | 'desc') || null,

  setSort: (field, newOrder) => {
    if (newOrder) {
      localStorage.setItem('sortBy', field)
      localStorage.setItem('order', newOrder)
    } else {
      localStorage.removeItem('sortBy')
      localStorage.removeItem('order')
    }
    set({ sortBy: field, order: newOrder })
  },
}))
