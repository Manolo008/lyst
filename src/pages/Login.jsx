import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  'Notities aanmaken & organiseren',
  'Labels en kleurcodering',
  'Slimme reminders & vandaag-view',
  'Veilig inloggen via NOVI API',
]

export default function Login() {
  const { isAuthenticated, login, register } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Al ingelogd → direct naar dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password, rememberMe)
      } else {
        await register(email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-logo">Lyst</div>
        <div className="login-tagline">Jouw notities, georganiseerd.</div>
        <p className="login-desc">
          Één plek voor al je ideeën, taken en herinneringen. Altijd bij de hand.
        </p>
        <ul className="login-features">
          {FEATURES.map((f) => (
            <li key={f} className="login-feature">
              <Check size={14} color="var(--accent)" strokeWidth={2.5} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-title">
            {tab === 'login' ? 'Welkom terug' : 'Account aanmaken'}
          </div>
          <div className="login-card-subtitle">
            {tab === 'login' ? 'Log in op je Lyst account' : 'Registreer gratis en begin direct'}
          </div>

          <div className="login-tabs">
            <button
              className={`login-tab${tab === 'login' ? ' active' : ''}`}
              onClick={() => {
                setTab('login')
                setError('')
              }}
            >
              Inloggen
            </button>
            <button
              className={`login-tab${tab === 'register' ? ' active' : ''}`}
              onClick={() => {
                setTab('register')
                setError('')
              }}
            >
              Registreren
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">E-mailadres</label>
              <input
                className="form-input"
                type="email"
                placeholder="jouw@email.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Wachtwoord</label>
              <input
                className="form-input"
                type="password"
                placeholder="minimaal 6 tekens"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {tab === 'login' && (
              <div className="remember-row">
                <label className="remember-label">
                  <input
                    type="checkbox"
                    className="remember-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="remember-box" aria-hidden="true" />
                  Onthoud mij
                </label>
                <span className="forgot-link">Wachtwoord vergeten?</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ borderRadius: 10, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? 'Even geduld...' : tab === 'login' ? 'Inloggen' : 'Account aanmaken'}
            </button>
          </form>

          <div className="login-divider">
            <hr />
            <span>of</span>
            <hr />
          </div>

          <div
            className="register-link"
            onClick={() => {
              setTab(tab === 'login' ? 'register' : 'login')
              setError('')
            }}
          >
            {tab === 'login' ? (
              <>
                Nog geen account? &nbsp;<strong>Registreer je gratis →</strong>
              </>
            ) : (
              <>
                Al een account? &nbsp;<strong>Log in →</strong>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
