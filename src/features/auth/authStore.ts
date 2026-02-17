import { create } from 'zustand'

interface AuthState {
  token: string | null
  isAuth: boolean
  login: (token: string, remember: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token:
    localStorage.getItem('token') ||
    sessionStorage.getItem('token'),

  isAuth: !!(
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')
  ),

  login: (token, remember) => {
    if (remember) {
      localStorage.setItem('token', token)
    } else {
      sessionStorage.setItem('token', token)
    }

    set({ token, isAuth: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    set({ token: null, isAuth: false })
  },
}))
