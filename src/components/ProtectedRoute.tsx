import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../features/auth/authStore'

interface Props {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const isAuth = useAuthStore((state) => state.isAuth)

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
