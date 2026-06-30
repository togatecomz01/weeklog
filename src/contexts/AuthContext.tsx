import { createContext, useContext, useEffect, useState } from 'react'

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
  apiFetch: (url: string, options?: RequestInit) => Promise<Response>
}

const STORAGE_KEY = 'weeklog_auth'
const TAB_KEY     = 'weeklog_tabs'
const CLOSE_KEY   = 'weeklog_closing'
const SESSION_KEY = 'weeklog_session'

function loadAuth(): { user: User; token: string } | null {
  if (localStorage.getItem(CLOSE_KEY)) {
    if (sessionStorage.getItem(SESSION_KEY)) {
      localStorage.removeItem(CLOSE_KEY)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(CLOSE_KEY)
      localStorage.removeItem(TAB_KEY)
      return null
    }
  }

  const raw = localStorage.getItem(STORAGE_KEY)
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

  useEffect(() => {
    let unloaded = false
    const count = Number(localStorage.getItem(TAB_KEY) || '0') + 1
    localStorage.setItem(TAB_KEY, String(count))
    sessionStorage.setItem(SESSION_KEY, '1')

    function onUnload() {
      if (unloaded) return
      unloaded = true
      const remaining = Math.max(0, Number(localStorage.getItem(TAB_KEY) || '1') - 1)
      localStorage.setItem(TAB_KEY, String(remaining))
      if (remaining === 0) {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          try {
            const { persist } = JSON.parse(raw)
            if (!persist) localStorage.setItem(CLOSE_KEY, '1')
          } catch {}
        }
      }
    }

    window.addEventListener('pagehide', onUnload)
    return () => {
      onUnload()
      window.removeEventListener('pagehide', onUnload)
    }
  }, [])

  function login(user: User, token: string, persist: boolean) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token, persist }))
    sessionStorage.setItem(SESSION_KEY, '1')
    setUser(user)
    setToken(token)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TAB_KEY)
    localStorage.removeItem(CLOSE_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
    setToken(null)
  }

  async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    })
    if (res.status === 401) logout()
    return res
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
