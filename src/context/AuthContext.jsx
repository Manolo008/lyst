import { createContext, useContext, useState, useEffect } from 'react'
import { signin, signup, getProfile } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('lyst_token'))
  const [loading, setLoading] = useState(!!localStorage.getItem('lyst_token'))

  // Herstel sessie bij page refresh
  useEffect(() => {
    if (!token) { setLoading(false); return }
    getProfile(token)
      .then(setUser)
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function login(username, password) {
    const data = await signin({ username, password })
    const jwt = data.accessToken
    localStorage.setItem('lyst_token', jwt)
    setToken(jwt)
    const profile = await getProfile(jwt)
    setUser(profile)
    return profile
  }

  async function register(username, email, password) {
    await signup({ username, email, password })
    return login(username, password)
  }

  function logout() {
    localStorage.removeItem('lyst_token')
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

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="spinner" />
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth moet binnen AuthProvider gebruikt worden')
  return ctx
}
