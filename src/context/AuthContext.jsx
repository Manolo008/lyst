import { createContext, useContext, useState } from 'react'
import { signin, signup } from '../api/auth'

const AuthContext = createContext(null)

function getStored(key) {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key)
}

function clearStored(key) {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStored('lyst_token'))
  const [user, setUser] = useState(() => {
    const saved = getStored('lyst_user')
    return saved ? JSON.parse(saved) : null
  })

  async function login(email, password, rememberMe = true) {
    const data = await signin({ email, password })
    const jwt = data.accessToken
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('lyst_token', jwt)
    storage.setItem('lyst_user', JSON.stringify(data.user ?? { email }))
    setToken(jwt)
    setUser(data.user ?? { email })
  }

  async function register(email, password) {
    await signup({ email, password })
    return login(email, password, true)
  }

  function logout() {
    clearStored('lyst_token')
    clearStored('lyst_user')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth moet binnen AuthProvider gebruikt worden')
  return ctx
}
