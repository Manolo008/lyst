import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, Sun, Bell, SlidersHorizontal, Archive } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { LABELS } from '../data'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/today', icon: Sun, label: 'Vandaag' },
  { to: '/reminders', icon: Bell, label: 'Reminders' },
  { to: '/filter', icon: SlidersHorizontal, label: 'Filteren' },
  { to: '/archief', icon: Archive, label: 'Archief' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const initial = (user?.email ?? 'U')[0].toUpperCase()
  const displayName = (user?.email ?? '')
    .split('@')[0]
    .split('.')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">Lyst</div>
        <span className="sidebar-tagline">jouw notities, georganiseerd</span>
      </div>

      <hr className="sidebar-divider" />

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <hr className="sidebar-divider" style={{ marginTop: 12 }} />

      <div className="sidebar-labels-section">
        <span className="sidebar-section-title">LABELS</span>
        {LABELS.map((label) => (
          <div key={label.name} className="label-item">
            <span className="label-dot" style={{ backgroundColor: label.color }} />
            <span>{label.name}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-avatar">{initial}</div>
        <div>
          <div className="user-name">{displayName}</div>
          <div
            className="user-logout"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Uitloggen
          </div>
        </div>
      </div>
    </aside>
  )
}
