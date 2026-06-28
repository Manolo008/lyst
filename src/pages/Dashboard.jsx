import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import Sidebar       from '../components/Sidebar'
import Topbar        from '../components/Topbar'
import NoteCard      from '../components/NoteCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth }   from '../context/AuthContext'
import { fetchNotes } from '../api/notes'

const CHIPS = ['Alle', 'Gepind', 'Werk', 'Persoonlijk', 'Ideeën', 'Urgent']

export default function Dashboard() {
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [notes,      setNotes]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [activeChip, setActiveChip] = useState('Alle')
  const [query,      setQuery]      = useState('')

  useEffect(() => {
    loadNotes()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadNotes() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchNotes(token)
      // Normaliseer API-response naar intern formaat
      const normalized = data.map((n) => ({
        id:      n.id,
        title:   n.title,
        body:    n.body,
        labels:  typeof n.labels === 'string' ? JSON.parse(n.labels || '[]') : (n.labels || []),
        pinned:  n.pinned === true || n.pinned === 'true',
        reminder: n.reminder || null,
        date:    new Date(n.createdAt || Date.now()).toLocaleDateString('nl-NL'),
        accent:  n.accent || '#6B727F',
      }))
      setNotes(normalized)
    } catch (err) {
      setError(err.message || 'Notities ophalen mislukt. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = notes.filter((note) => {
    const matchChip =
      activeChip === 'Alle' ||
      (activeChip === 'Gepind' && note.pinned) ||
      note.labels.some((l) => l.name === activeChip)
    const matchQuery =
      !query ||
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.body.toLowerCase().includes(query.toLowerCase())
    return matchChip && matchQuery
  })

  const pinnedCount = notes.filter((n) => n.pinned).length

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar
          title="Mijn Notities"
          subtitle={`${notes.length} notities · ${pinnedCount} gepind`}
        >
          <div className="search-field">
            <Search size={16} color="var(--text-sec)" />
            <input
              placeholder="Zoeken in notities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/notitie/nieuw')}>
            <Plus size={15} /> Nieuwe notitie
          </button>
        </Topbar>

        <div className="content-area">
          {error && <div className="error-banner">{error}</div>}

          <div className="filter-chips">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                className={`chip${activeChip === chip ? ' active' : ''}`}
                onClick={() => setActiveChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner message="Notities ophalen..." />
          ) : filtered.length === 0 ? (
            <div className="loading-state">
              <span>Geen notities gevonden.</span>
              <button className="btn btn-primary" style={{ borderRadius: 8 }} onClick={() => navigate('/notitie/nieuw')}>
                Eerste notitie aanmaken
              </button>
            </div>
          ) : (
            <div className="notes-grid">
              {filtered.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => navigate(`/notitie/${note.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
