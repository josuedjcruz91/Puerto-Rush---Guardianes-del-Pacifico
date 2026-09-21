import { useEffect, useState } from 'react'
import LeaderboardTable from '../components/scores/LeaderboardTable'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import { getScores } from '../services/scoreService'
import { readableError } from '../services/api'

export default function ScoresPage() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  useEffect(() => {
    let active = true
    getScores().then((data) => { if (active) setScores(data) }).catch((err) => { if (active) setError(readableError(err, 'No se pudieron cargar los puntajes.')) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])
  return <section className="section container page-section"><div className="section-heading"><div><span className="eyebrow">LEYENDAS DEL PACÍFICO</span><h1>Clasificación</h1><p>El podio se ordena por la suma de puntos de las cinco misiones completadas.</p></div><span className="section-index">TOP GUARDIANES</span></div>
    {loading ? <Loader text="Cargando clasificación..." /> : error ? <ErrorMessage message={error} onRetry={() => { setError(''); setLoading(true); setReload((value) => value + 1) }} /> : scores.length === 0 ? <EmptyState message="Aún no hay puntajes registrados. Sé el primero en jugar." /> : <LeaderboardTable scores={scores} />}
  </section>
}
