import { Bookmark, Bell } from 'lucide-react'

export default function NoteCard({ note, onClick }) {
  return (
    <div className="note-card" onClick={onClick}>
      <div
        className="note-card-accent"
        style={{ backgroundColor: note.accent || note.labels?.[0]?.color || '#6B727F' }}
      />
      <div className="note-card-body">
        {note.pinned && (
          <span className="note-card-pin">
            <Bookmark size={14} />
          </span>
        )}
        <div className="note-card-title">{note.title}</div>
        <div className="note-card-text">{note.body}</div>
      </div>
      <div className="note-card-footer">
        {note.labels?.map((lbl) => (
          <span
            key={lbl.name}
            className="note-label"
            style={{ backgroundColor: lbl.color + '20', color: lbl.color }}
          >
            {lbl.name}
          </span>
        ))}
        {note.reminder && (
          <span className="note-reminder">
            <Bell size={11} />
            {note.reminder}
          </span>
        )}
        <span className="note-date">{note.date || note.createdAt}</span>
      </div>
    </div>
  )
}
