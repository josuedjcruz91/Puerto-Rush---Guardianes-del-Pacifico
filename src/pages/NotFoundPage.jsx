import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return <section className="section container page-section not-found"><span className="eyebrow">RUTA EXTRAVIADA</span><h1>404</h1><p>Esta parte del océano no está en el mapa.</p><Link className="button button-primary" to="/">Volver al faro</Link></section>
}
