import { useState } from 'react'
import { Bell, Calendar, Check, Circle } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'
import { REMINDERS } from '../data'

export default function Reminders() {
  const [view, setView]       = useState('lijst')
  const [done, setDone]       = useState({ 2: true })

  function toggleDone(id) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const totalActive = REMINDERS.today.filter((r) => !done[r.id]).length + REMINDERS.week.length

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Reminders" subtitle={`${totalActive} actieve reminders`}>
          <div className="view-toggle">
            <button
              className={`view-toggle-btn${view === 'lijst' ? ' active' : ''}`}
              onClick={() => setView('lijst')}
            >
              Lijst
            </button>
            <button
              className={`view-toggle-btn${view === 'kalender' ? ' active' : ''}`}
              onClick={() => setView('kalender')}
            >
              Kalender
            </button>
          </div>
        </Topbar>

        <div className="reminders-content">
          {/* Vandaag */}
          <div className="reminders-section-header">
            <div className="section-icon" style={{ backgroundColor: 'var(--red)' }}>
              <Bell size={14} color="white" />
            </div>
            <span className="section-title">Vandaag</span>
            <span className="section-count">3 reminders</span>
          </div>

          {REMINDERS.today.map((rem) => {
            const isDone = !!done[rem.id]
            return (
              <div key={rem.id} className={`reminder-card${isDone ? ' done' : ''}`}>
                <div
                  className={`reminder-checkbox${isDone ? ' checked' : ''}`}
                  onClick={() => toggleDone(rem.id)}
                >
                  {isDone && <Check size={12} color="white" strokeWidth={3} />}
                </div>
                <div className="reminder-info">
                  <div className={`reminder-title${isDone ? ' done' : ''}`}>{rem.title}</div>
                  <div className="reminder-label-row">
                    <span className="reminder-label-dot" style={{ backgroundColor: rem.color }} />
                    <span className="reminder-label-name">{rem.label}</span>
                  </div>
                </div>
                <div className="reminder-time-badge today">
                  <Bell size={12} />
                  {rem.time}
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
            <span className="section-count">2 reminders</span>
          </div>

          {REMINDERS.week.map((rem) => (
            <div key={rem.id} className="reminder-card">
              <div className="reminder-checkbox" />
              <div className="reminder-info">
                <div className="reminder-title">{rem.title}</div>
                <div className="reminder-label-row">
                  <span className="reminder-label-dot" style={{ backgroundColor: rem.color }} />
                  <span className="reminder-label-name">{rem.label}</span>
                </div>
              </div>
              <div className="reminder-time-badge week">
                <Calendar size={12} />
                {rem.time}
              </div>
            </div>
          ))}

          <hr className="section-divider" />

          {/* Later */}
          <div className="reminders-section-header">
            <span className="section-title" style={{ color: 'var(--text-sec)' }}>Later</span>
          </div>

          <div className="empty-state">
            <Circle size={26} color="var(--border)" />
            <span>Geen reminders gepland voor later</span>
          </div>
        </div>
      </div>
    </div>
  )
}
