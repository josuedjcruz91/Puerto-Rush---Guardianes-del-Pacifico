export default function Loader({ text = 'Cargando...' }) {
  return <p className="notice" role="status">◌ {text}</p>
}
