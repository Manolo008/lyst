import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Check } from 'lucide-react'
import Sidebar        from '../components/Sidebar'
import Topbar         from '../components/Topbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth }    from '../context/AuthContext'
import { fetchNotes } from '../api/notes'

const LABEL_FILTERS = [
  { name: 'Alle labels', color: 'var(--text-sec)' },
  { name: 'Werk',        color: '#3B82F6' },
  { name: 'Persoonlijk', color: '#9644EF' },
  { name: 'Ideeën',      color: '#FBC003' },
  { name: 'Urgent',      color: '#EF4444' },
]

const DATE_FILTERS = ['Vandaag', 'Deze week', 'Deze maand', 'Alle datums']
const SORT_OPTIONS = ['Nieuwste eerst', 'Oudste eerst', 'Alfabetisch']

function isToday(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

function isThisWeek(dateStr) {
  if (!dateStr) return false
  const d   = new Date(dateStr)
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay())
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return d >= start && d < end
}

function isThisMonth(dateStr) {
  if (!dateStr) return false
  const d   = new Date(dateStr)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export default function Filter() {
  const { token } = useAuth()
  const navigate  = useNavigate()

  const [notes,       setNotes]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [activeLabel, setActiveLabel] = useState('Alle labels')
  const [activeDate,  setActiveDate]  = useState('Alle datums')
  const [activeSort,  setActiveSort]  = useState('Nieuwste eerst')
  const [query,       setQuery]       = useState('')

  useEffect(() => {
    fetchNotes(token)
      .then((data) => {
        setNotes(data.map((n) => ({
          id:        n.id,
          title:     n.title,
          body:      n.body,
          labels:    typeof n.labels === 'string' ? JSON.parse(n.labels || '[]') : (n.labels || []),
          createdAt: n.createdAt,
          date:      new Date(n.createdAt || Date.now()).toLocaleDateString('nl-NL'),
        })))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hasActiveFilters = activeLabel !== 'Alle labels' || activeDate !== 'Alle datums' || query

  const results = notes
    .filter((n) => activeLabel === 'Alle labels' || n.labels.some((l) => l.name === activeLabel))
    .filter((n) => {
      if (activeDate === 'Vandaag')    return isToday(n.createdAt)
      if (activeDate === 'Deze week')  return isThisWeek(n.createdAt)
      if (activeDate === 'Deze maand') return isThisMonth(n.createdAt)
      return true
    })
    .filter((n) => {
      if (!query) return true
      const q = query.toLowerCase()
      return n.title.toLowerCase().includes(q) || (n.body || '').toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (activeSort === 'Alfabetisch')  return a.title.localeCompare(b.title)
      if (activeSort === 'Oudste eerst') return new Date(a.createdAt) - new Date(b.createdAt)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const activeColor = LABEL_FILTERS.find((l) => l.name === activeLabel)?.color || 'var(--text-sec)'

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Filteren &amp; Zoeken">
          <div className="search-field">
            <Search size={16} color="var(--text-sec)" />
            <input
              placeholder="Zoeken in notities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </Topbar>

        {loading ? (
          <LoadingSpinner message="Notities ophalen..." />
        ) : (
          <div className="filter-layout">
            <div className="filter-panel">
              <div className="filter-panel-title">Filters</div>

              <div className="filter-group-title">LABEL</div>
              {LABEL_FILTERS.map((lbl) => (
                <div
                  key={lbl.name}
                  className={`filter-option${activeLabel === lbl.name ? ' active' : ''}`}
                  onClick={() => setActiveLabel(lbl.name)}
                >
                  <span
                    className="filter-option-dot"
                    style={{ backgroundColor: lbl.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {activeLabel === lbl.name && <Check size={8} color="white" strokeWidth={3} />}
                  </span>
                  {lbl.name}
                </div>
              ))}

              <div className="filter-group-title">DATUM</div>
              {DATE_FILTERS.map((d) => (
                <div
                  key={d}
                  className={`filter-option${activeDate === d ? ' active' : ''}`}
                  onClick={() => setActiveDate(d)}
                >
                  {d}
                </div>
              ))}

              <div className="filter-group-title">SORTERING</div>
              {SORT_OPTIONS.map((opt) => (
                <div
                  key={opt}
                  className={`filter-sort-option${activeSort === opt ? ' active' : ''}`}
                  onClick={() => setActiveSort(opt)}
                >
                  <span style={{ fontSize: 12 }}>{activeSort === opt ? '● ' : '○ '}</span>
                  {opt}
                </div>
              ))}

              <div className="filter-actions">
                <button
                  className="btn btn-outline-danger btn-full"
                  style={{ height: 34, fontSize: 13 }}
                  onClick={() => { setActiveLabel('Alle labels'); setActiveDate('Alle datums'); setActiveSort('Nieuwste eerst'); setQuery('') }}
                >
                  Filters wissen
                </button>
              </div>
            </div>

            <div className="filter-results">
              {error && <div className="error-banner">{error}</div>}

              <div className="results-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="results-title">Resultaten voor:</span>
                  <span
                    className="active-filter-chip"
                    style={{ backgroundColor: activeColor + '20', color: activeColor }}
                  >
                    {activeLabel} &nbsp;×
                  </span>
                </div>
                <div className="results-count">{results.length} notities gevonden</div>
              </div>

              {results.length === 0 ? (
                <div className="loading-state">
                  <span>{hasActiveFilters ? 'Geen notities gevonden voor deze filters.' : 'Nog geen notities aangemaakt.'}</span>
                </div>
              ) : (
                results.map((note) => {
                  const labelColor = note.labels[0]?.color || '#6B727F'
                  return (
                    <div
                      key={note.id}
                      className="result-card"
                      onClick={() => navigate(`/notitie/${note.id}`)}
                    >
                      <div className="result-card-accent" style={{ background: labelColor }} />
                      <div className="result-card-body">
                        <div className="result-card-title">
                          {note.title}
                          <span className="result-card-date">{note.date}</span>
                        </div>
                        <div className="result-card-text">{note.body}</div>
                        {note.labels[0] && (
                          <span
                            className="result-label"
                            style={{ backgroundColor: labelColor + '20', color: labelColor }}
                          >
                            {note.labels[0].name}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
