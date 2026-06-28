import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Bell, Circle } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { fetchNotes } from '../api/notes'

function isToday(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
}

export default function Vandaag() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNotes(token)
      .then((data) => {
        const vandaag = data
          .filter((n) => isToday(n.reminder))
          .map((n) => ({
            id: n.id,
            title: n.title,
            labels: typeof n.labels === 'string' ? JSON.parse(n.labels || '[]') : n.labels || [],
            reminder: n.reminder,
          }))
        setNotes(vandaag)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <LoadingSpinner message="Vandaag ophalen..." />
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Vandaag"
          subtitle={`${notes.length} ${notes.length === 1 ? 'reminder' : 'reminders'} voor vandaag`}
        />

        <div className="reminders-content">
          {error && <div className="error-banner">{error}</div>}

          <div className="reminders-section-header">
            <div className="section-icon" style={{ backgroundColor: 'var(--primary)' }}>
              <Sun size={14} color="white" />
            </div>
            <span className="section-title">Vandaag</span>
            <span className="section-count">{notes.length} reminders</span>
          </div>

          {notes.length === 0 ? (
            <div className="empty-state">
              <Circle size={26} color="var(--border)" />
              <span>Geen reminders voor vandaag</span>
            </div>
          ) : (
            notes.map((note) => {
              const lblColor = note.labels[0]?.color || 'var(--text-sec)'
              return (
                <div
                  key={note.id}
                  className="reminder-card"
                  onClick={() => navigate(`/notitie/${note.id}`)}
                >
                  <div className="reminder-checkbox" />
                  <div className="reminder-info">
                    <div className="reminder-title">{note.title}</div>
                    {note.labels[0] && (
                      <div className="reminder-label-row">
                        <span
                          className="reminder-label-dot"
                          style={{ backgroundColor: lblColor }}
                        />
                        <span className="reminder-label-name">{note.labels[0].name}</span>
                      </div>
                    )}
                  </div>
                  <div className="reminder-time-badge today">
                    <Bell size={12} />
                    {formatTime(note.reminder)}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
