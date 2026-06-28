import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bell, Calendar, Trash2, Bookmark } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { fetchNote, createNote, updateNote, deleteNote } from '../api/notes'

const LABEL_OPTIONS = [
  { name: 'Werk', color: '#3B82F6' },
  { name: 'Persoonlijk', color: '#9644EF' },
  { name: 'Ideeën', color: '#FBC003' },
  { name: 'Urgent', color: '#EF4444' },
]

const EMPTY = { title: '', body: '', labels: [], pinned: false, reminder: '' }

export default function NoteDetail() {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'nieuw'

  const [note, setNote] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isNew) return
    fetchNote(token, id)
      .then((data) =>
        setNote({
          title: data.title || '',
          body: data.body || '',
          labels:
            typeof data.labels === 'string' ? JSON.parse(data.labels || '[]') : data.labels || [],
          pinned: data.pinned === true || data.pinned === 'true',
          reminder: data.reminder || '',
          createdAt: data.createdAt,
          modifiedAt: data.modifiedAt,
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  function update(field, value) {
    setNote((prev) => ({ ...prev, [field]: value }))
  }

  function toggleLabel(lbl) {
    setNote((prev) => {
      const exists = prev.labels.some((l) => l.name === lbl.name)
      return {
        ...prev,
        labels: exists ? prev.labels.filter((l) => l.name !== lbl.name) : [...prev.labels, lbl],
      }
    })
  }

  async function handleSave() {
    if (!note.title.trim()) {
      setError('Geef de notitie een titel.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...note,
        labels: JSON.stringify(note.labels),
        accent: note.labels[0]?.color || '#6B727F',
      }
      if (isNew) {
        const created = await createNote(token, payload)
        navigate(`/notitie/${created.id}`, { replace: true })
      } else {
        await updateNote(token, id, payload)
        setSuccess('Opgeslagen!')
        setTimeout(() => setSuccess(''), 2500)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Weet je zeker dat je deze notitie wilt verwijderen?')) return
    try {
      await deleteNote(token, id)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <LoadingSpinner message="Notitie laden..." />
        </div>
      </div>
    )
  }

  const created = note.createdAt ? new Date(note.createdAt).toLocaleString('nl-NL') : '—'
  const modified = note.modifiedAt ? new Date(note.modifiedAt).toLocaleString('nl-NL') : '—'

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar breadcrumb={`← Dashboard  /  ${note.title || 'Nieuwe notitie'}`}>
          {!isNew && (
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Verwijderen
            </button>
          )}
          <button
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 8, opacity: saving ? 0.7 : 1 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Opslaan...' : isNew ? 'Aanmaken' : 'Opslaan'}
          </button>
        </Topbar>

        <div className="detail-layout">
          <div className="editor-area">
            {error && <div className="error-banner">{error}</div>}
            {success && <div className="success-banner">{success}</div>}

            <input
              className="editor-title"
              placeholder="Notitie titel..."
              value={note.title}
              onChange={(e) => update('title', e.target.value)}
            />
            <hr className="editor-divider" />

            <div className="editor-meta">
              {note.labels.map((lbl) => (
                <span
                  key={lbl.name}
                  className="label-chip"
                  style={{ backgroundColor: lbl.color + '1A', color: lbl.color, cursor: 'pointer' }}
                  onClick={() => toggleLabel(lbl)}
                >
                  <span className="label-chip-dot" style={{ backgroundColor: lbl.color }} />
                  {lbl.name} ×
                </span>
              ))}
              <div style={{ position: 'relative' }}>
                <button
                  className="add-label-btn"
                  onClick={(e) => {
                    e.currentTarget.nextSibling.style.display =
                      e.currentTarget.nextSibling.style.display === 'block' ? 'none' : 'block'
                  }}
                >
                  + Label
                </button>
                <div
                  style={{
                    display: 'none',
                    position: 'absolute',
                    top: 30,
                    left: 0,
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 8,
                    zIndex: 10,
                    minWidth: 140,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  {LABEL_OPTIONS.map((lbl) => (
                    <div
                      key={lbl.name}
                      onClick={() => toggleLabel(lbl)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: 13,
                        borderRadius: 6,
                        background: note.labels.some((l) => l.name === lbl.name)
                          ? lbl.color + '15'
                          : 'transparent',
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: lbl.color,
                        }}
                      />
                      {lbl.name}
                    </div>
                  ))}
                </div>
              </div>
              {note.reminder && (
                <>
                  <span className="meta-divider" />
                  <span className="reminder-badge">
                    <Bell size={13} />
                    {note.reminder}
                  </span>
                </>
              )}
            </div>

            <textarea
              className="editor-body"
              placeholder="Begin hier te schrijven..."
              value={note.body}
              onChange={(e) => update('body', e.target.value)}
            />
          </div>

          <div className="detail-panel">
            {!isNew && (
              <div className="panel-section">
                <div className="panel-section-title">Details</div>
                <div className="panel-meta-label">Aangemaakt</div>
                <div className="panel-meta-value">{created}</div>
                <div className="panel-meta-label">Gewijzigd</div>
                <div className="panel-meta-value">{modified}</div>
              </div>
            )}

            <div className="panel-section">
              <div className="panel-section-title">Labels</div>
              {LABEL_OPTIONS.map((lbl) => {
                const active = note.labels.some((l) => l.name === lbl.name)
                return (
                  <div
                    key={lbl.name}
                    className="panel-label-chip"
                    style={{
                      backgroundColor: active ? lbl.color + '1A' : 'var(--input-bg)',
                      color: lbl.color,
                      cursor: 'pointer',
                      marginBottom: 6,
                    }}
                    onClick={() => toggleLabel(lbl)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: lbl.color,
                          display: 'inline-block',
                        }}
                      />
                      <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>
                        {lbl.name}
                      </span>
                    </span>
                    {active && <span>✓</span>}
                  </div>
                )
              })}
            </div>

            <div className="panel-section">
              <div className="panel-section-title">Reminder</div>
              <div className="panel-reminder">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Calendar size={15} color="var(--text)" />
                  <input
                    type="datetime-local"
                    style={{
                      border: 'none',
                      background: 'none',
                      outline: 'none',
                      fontSize: 12,
                      fontFamily: 'inherit',
                      color: 'var(--text)',
                      width: '100%',
                    }}
                    value={note.reminder}
                    onChange={(e) => update('reminder', e.target.value)}
                  />
                </div>
                {note.reminder && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Bell size={13} color="var(--orange)" />
                    <span style={{ fontSize: 12, color: 'var(--orange)' }}>Reminder actief</span>
                  </div>
                )}
              </div>
              {note.reminder && (
                <button
                  className="btn btn-outline-danger btn-full"
                  style={{ fontSize: 12, height: 32 }}
                  onClick={() => update('reminder', '')}
                >
                  Reminder wissen
                </button>
              )}
            </div>

            <div className="panel-section">
              <div className="panel-section-title">Opties</div>
              <div className="panel-toggle-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <Bookmark size={16} color="var(--text)" /> Notitie pinnen
                </span>
                <div
                  className="toggle"
                  style={{ background: note.pinned ? 'var(--primary)' : 'var(--border)' }}
                  onClick={() => update('pinned', !note.pinned)}
                >
                  <div
                    className="toggle-knob"
                    style={{
                      right: note.pinned ? 2 : undefined,
                      left: note.pinned ? undefined : 2,
                    }}
                  />
                </div>
              </div>
              {!isNew && (
                <div className="panel-toggle-row">
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      color: 'var(--red)',
                      cursor: 'pointer',
                    }}
                    onClick={handleDelete}
                  >
                    <Trash2 size={16} color="var(--red)" /> Notitie verwijderen
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
