export default function ErrorMessage({ message, onRetry, retryLabel = 'Reintentar' }) {
  return <div className="notice notice-error" role="alert"><p>{message}</p>{onRetry && <button className="button button-small" onClick={onRetry}>{retryLabel}</button>}</div>
}
