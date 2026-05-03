import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Check } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar  from '../components/Topbar'
import { FILTER_NOTES } from '../data'

const LABEL_FILTERS = [
  { name: 'Alle labels',  color: 'var(--text-sec)' },
  { name: 'Werk',         color: '#3B82F6' },
  { name: 'Persoonlijk',  color: '#9644EF' },
  { name: 'Ideeën',       color: '#FBC003' },
  { name: 'Urgent',       color: '#EF4444' },
]

const DATE_FILTERS  = ['Vandaag', 'Deze week', 'Deze maand', 'Alle datums']
const SORT_OPTIONS  = ['Nieuwste eerst', 'Oudste eerst', 'Alfabetisch']

export default function Filter() {
  const [activeLabel, setActiveLabel]   = useState('Werk')
  const [activeDate, setActiveDate]     = useState('Alle datums')
  const [activeSort, setActiveSort]     = useState('Nieuwste eerst')
  const [query, setQuery]               = useState('')
  const navigate = useNavigate()

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
                  style={{
                    backgroundColor: lbl.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeLabel === lbl.name && (
                    <Check size={8} color="white" strokeWidth={3} />
                  )}
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
            {SORT_OPTIONS.map((opt, i) => (
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
                onClick={() => { setActiveLabel('Alle labels'); setActiveDate('Alle datums'); setActiveSort('Nieuwste eerst') }}
              >
                Filters wissen
              </button>
              <button className="btn btn-primary btn-full" style={{ borderRadius: 8 }}>
                Toepassen
              </button>
            </div>
          </div>

          <div className="filter-results">
            <div className="results-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="results-title">Resultaten voor:</span>
                <span
                  className="active-filter-chip"
                  style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}
                >
                  {activeLabel} &nbsp;×
                </span>
              </div>
              <div className="results-count">{FILTER_NOTES.length} notities gevonden</div>
            </div>

            {FILTER_NOTES.map((note) => (
              <div
                key={note.id}
                className="result-card"
                onClick={() => navigate(`/notitie/${note.id}`)}
              >
                <div className="result-card-accent" />
                <div className="result-card-body">
                  <div className="result-card-title">
                    {note.title}
                    <span className="result-card-date">{note.date}</span>
                  </div>
                  <div className="result-card-text">{note.body}</div>
                  <span
                    className="result-label"
                    style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}
                  >
                    Werk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
