import { createContext, useContext, useState } from 'react'

type Role = 'admin' | 'user'

interface User {
  id: number
  name: string
  email: string
  role: Role
  department: string
  position: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (user: User, token: string, persist: boolean) => void
  logout: () => void
}

const STORAGE_KEY = 'weeklog_auth'

function loadAuth(): { user: User; token: string } | null {
  const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const saved = loadAuth()
  const [user, setUser] = useState<User | null>(saved?.user ?? null)
  const [token, setToken] = useState<string | null>(saved?.token ?? null)

  function login(user: User, token: string, persist: boolean) {
    const data = JSON.stringify({ user, token })
    if (persist) {
      localStorage.setItem(STORAGE_KEY, data)
    } else {
      sessionStorage.setItem(STORAGE_KEY, data)
    }
    setUser(user)
    setToken(token)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
