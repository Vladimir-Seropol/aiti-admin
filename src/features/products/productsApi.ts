import { api } from '../../shared/api/axios'
import { ProductResponse } from '../../shared/types/product'
import axios, { CancelTokenSource } from 'axios'

let cancelToken: CancelTokenSource | null = null


const CACHE_PREFIX = 'products_cache'
const CACHE_TTL = 30 * 60 * 1000 

interface CacheItem {
  data: ProductResponse
  timestamp: number
}

const getCacheKey = (search: string, sortBy: string | null, order: string | null, page: number, limit: number): string => {
  const params = { search, sortBy, order, page, limit }
  return `${CACHE_PREFIX}_${JSON.stringify(params)}`
}

const getFromCache = (key: string): ProductResponse | null => {
  const cached = localStorage.getItem(key)
  if (!cached) return null
  
  try {
    const item: CacheItem = JSON.parse(cached)
    if (Date.now() - item.timestamp < CACHE_TTL) {
      return item.data
    }

    localStorage.removeItem(key)
  } catch (e) {
    console.error('Cache parse error:', e)
  }
  
  return null
}

const setToCache = (key: string, data: ProductResponse) => {
  const item: CacheItem = {
    data,
    timestamp: Date.now(),
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(item))
  } catch (e) {

    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('Cache quota exceeded, clearing old cache')

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          try {
            const item: CacheItem = JSON.parse(localStorage.getItem(key) || '')
            if (Date.now() - item.timestamp > 24 * 60 * 60 * 1000) {
              localStorage.removeItem(key)
            }
          } catch {
            localStorage.removeItem(key)
          }
        }
      })
    }
  }
}

export const fetchProducts = async (
  search: string,
  sortBy: string | null,
  order: "asc" | "desc" | null,
  page: number,        
  limit: number        
): Promise<ProductResponse> => {

  if (cancelToken) {
    cancelToken.cancel()
  }
  cancelToken = axios.CancelToken.source()

  const params: Record<string, string | number> = {
    limit: limit,      
    skip: (page - 1) * limit 
  }
  
  if (sortBy && order) {
    params.sortBy = sortBy
    params.order = order
  }

  const url = search ? `/products/search?q=${search}` : '/products'
  

  const cacheKey = getCacheKey(search, sortBy, order, page, limit)
  const cachedData = getFromCache(cacheKey)
  if (cachedData) {
    return cachedData
  }

  const response = await api.get<ProductResponse>(url, {
    params,
    cancelToken: cancelToken.token,
  })

  setToCache(cacheKey, response.data)

  return response.data
}


export const clearProductsCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key)
    }
  })
}

