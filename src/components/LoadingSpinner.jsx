export default function LoadingSpinner({ message = 'Laden...' }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <span>{message}</span>
    </div>
  )
}
