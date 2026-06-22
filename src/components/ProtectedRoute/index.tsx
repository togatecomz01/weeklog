import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

type Role = 'admin' | 'user'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: Role[]
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />

  return <>{children}</>
}

export default ProtectedRoute
