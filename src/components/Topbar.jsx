export default function Topbar({ title, subtitle, breadcrumb, children }) {
  return (
    <div className="topbar">
      {breadcrumb ? (
        <span className="topbar-breadcrumb">{breadcrumb}</span>
      ) : (
        <div className="topbar-title-group">
          <div className="topbar-title">{title}</div>
          {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
