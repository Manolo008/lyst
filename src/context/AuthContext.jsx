import { createContext, useContext, useState } from 'react'
import { signin, signup } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('lyst_token'))
  const [user,  setUser]  = useState(() => {
    const saved = localStorage.getItem('lyst_user')
    return saved ? JSON.parse(saved) : null
  })

  async function login(email, password) {
    const data = await signin({ email, password })
    const jwt  = data.accessToken
    localStorage.setItem('lyst_token', jwt)
    localStorage.setItem('lyst_user',  JSON.stringify(data.user ?? { email }))
    setToken(jwt)
    setUser(data.user ?? { email })
  }

  async function register(email, password) {
    await signup({ email, password })
    return login(email, password)
  }

  function logout() {
    localStorage.removeItem('lyst_token')
    localStorage.removeItem('lyst_user')
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

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth moet binnen AuthProvider gebruikt worden')
  return ctx
}
