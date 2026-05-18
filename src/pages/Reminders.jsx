import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { Bell, Calendar, Check, Circle } from 'lucide-react'
import Sidebar        from '../components/Sidebar'
import Topbar         from '../components/Topbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth }    from '../context/AuthContext'
import { fetchNotes } from '../api/notes'

function startOfDay(d) {
  const r = new Date(d); r.setHours(0, 0, 0, 0); return r
}
function endOfDay(d) {
  const r = new Date(d); r.setHours(23, 59, 59, 999); return r
}
function startOfWeek(d) {
  const r = startOfDay(d); r.setDate(r.getDate() - r.getDay()); return r
}
function endOfWeek(d) {
  const r = startOfWeek(d); r.setDate(r.getDate() + 6); return endOfDay(r)
}

function formatReminder(dateStr) {
  const d   = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function Reminders() {
  const { token } = useAuth()
  const navigate  = useNavigate()

  const [notes,   setNotes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState({})
  const [view,    setView]    = useState('lijst')

  useEffect(() => {
    fetchNotes(token)
      .then((data) => {
        const withReminder = data
          .filter((n) => n.reminder)
          .map((n) => ({
            id:       n.id,
            title:    n.title,
            labels:   typeof n.labels === 'string' ? JSON.parse(n.labels || '[]') : (n.labels || []),
            reminder: n.reminder,
          }))
        setNotes(withReminder)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const now  = new Date()
  const today = notes.filter((n) => {
    const d = new Date(n.reminder)
    return d >= startOfDay(now) && d <= endOfDay(now)
  })
  const week = notes.filter((n) => {
    const d = new Date(n.reminder)
    return d > endOfDay(now) && d <= endOfWeek(now)
  })
  const later = notes.filter((n) => {
    const d = new Date(n.reminder)
    return d > endOfWeek(now)
  })

  const totalActive = today.filter((r) => !done[r.id]).length + week.length + later.length

  function toggleDone(id) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content"><LoadingSpinner message="Reminders ophalen..." /></div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Reminders" subtitle={`${totalActive} actieve reminders`}>
          <div className="view-toggle">
            <button className={`view-toggle-btn${view === 'lijst'    ? ' active' : ''}`} onClick={() => setView('lijst')}>Lijst</button>
            <button className={`view-toggle-btn${view === 'kalender' ? ' active' : ''}`} onClick={() => setView('kalender')}>Kalender</button>
          </div>
        </Topbar>

        <div className="reminders-content">
          {error && <div className="error-banner">{error}</div>}

          {/* Vandaag */}
          <div className="reminders-section-header">
            <div className="section-icon" style={{ backgroundColor: 'var(--red)' }}>
              <Bell size={14} color="white" />
            </div>
            <span className="section-title">Vandaag</span>
            <span className="section-count">{today.length} reminders</span>
          </div>

          {today.length === 0 ? (
            <div className="empty-state"><Circle size={26} color="var(--border)" /><span>Geen reminders voor vandaag</span></div>
          ) : today.map((rem) => {
            const isDone  = !!done[rem.id]
            const lblColor = rem.labels[0]?.color || 'var(--text-sec)'
            return (
              <div key={rem.id} className={`reminder-card${isDone ? ' done' : ''}`} onClick={() => navigate(`/notitie/${rem.id}`)}>
                <div
                  className={`reminder-checkbox${isDone ? ' checked' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleDone(rem.id) }}
                >
                  {isDone && <Check size={12} color="white" strokeWidth={3} />}
                </div>
                <div className="reminder-info">
                  <div className={`reminder-title${isDone ? ' done' : ''}`}>{rem.title}</div>
                  {rem.labels[0] && (
                    <div className="reminder-label-row">
                      <span className="reminder-label-dot" style={{ backgroundColor: lblColor }} />
                      <span className="reminder-label-name">{rem.labels[0].name}</span>
                    </div>
                  )}
                </div>
                <div className="reminder-time-badge today">
                  <Bell size={12} />
                  {formatReminder(rem.reminder)}
                </div>
              </div>
            )
          })}

          <hr className="section-divider" />

          {/* Deze week */}
          <div className="reminders-section-header">
            <div className="section-icon" style={{ backgroundColor: 'var(--yellow)' }}>
              <Calendar size={14} color="white" />
            </div>
            <span className="section-title">Deze week</span>
            <span className="section-count">{week.length} reminders</span>
          </div>

          {week.length === 0 ? (
            <div className="empty-state"><Circle size={26} color="var(--border)" /><span>Geen reminders deze week</span></div>
          ) : week.map((rem) => {
            const lblColor = rem.labels[0]?.color || 'var(--text-sec)'
            return (
              <div key={rem.id} className="reminder-card" onClick={() => navigate(`/notitie/${rem.id}`)}>
                <div className="reminder-checkbox" />
                <div className="reminder-info">
                  <div className="reminder-title">{rem.title}</div>
                  {rem.labels[0] && (
                    <div className="reminder-label-row">
                      <span className="reminder-label-dot" style={{ backgroundColor: lblColor }} />
                      <span className="reminder-label-name">{rem.labels[0].name}</span>
                    </div>
                  )}
                </div>
                <div className="reminder-time-badge week">
                  <Calendar size={12} />
                  {formatReminder(rem.reminder)}
                </div>
              </div>
            )
          })}

          <hr className="section-divider" />

          {/* Later */}
          <div className="reminders-section-header">
            <span className="section-title" style={{ color: 'var(--text-sec)' }}>Later</span>
            <span className="section-count">{later.length} reminders</span>
          </div>

          {later.length === 0 ? (
            <div className="empty-state">
              <Circle size={26} color="var(--border)" />
              <span>Geen reminders gepland voor later</span>
            </div>
          ) : later.map((rem) => {
            const lblColor = rem.labels[0]?.color || 'var(--text-sec)'
            return (
              <div key={rem.id} className="reminder-card" onClick={() => navigate(`/notitie/${rem.id}`)}>
                <div className="reminder-checkbox" />
                <div className="reminder-info">
                  <div className="reminder-title">{rem.title}</div>
                  {rem.labels[0] && (
                    <div className="reminder-label-row">
                      <span className="reminder-label-dot" style={{ backgroundColor: lblColor }} />
                      <span className="reminder-label-name">{rem.labels[0].name}</span>
                    </div>
                  )}
                </div>
                <div className="reminder-time-badge week">
                  <Calendar size={12} />
                  {formatReminder(rem.reminder)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
