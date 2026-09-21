import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LevelCard from '../components/levels/LevelCard'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import { usePlayer } from '../context/PlayerContext'
import { getLevels } from '../services/levelService'
import { readableError } from '../services/api'
import { validateAlias } from '../utils/validators'

export default function HomePage() {
  const navigate = useNavigate()
  const { playerName, setPlayerName } = usePlayer()
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [aliasError, setAliasError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    getLevels().then((data) => { if (active) setLevels(data) }).catch((err) => { if (active) setError(readableError(err, 'No se pudieron cargar los niveles.')) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])

  function selectLevel(id) {
    const validation = validateAlias(playerName)
    setAliasError(validation)
    if (validation) { document.getElementById('player-name')?.focus(); return }
    setPlayerName(playerName.trim().replace(/\s+/g, ' '))
    navigate(`/juego/${id}`)
  }

  return <><section className="hero"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow">⚓ UNA MISIÓN FRENTE AL FARO DE PUNTARENAS</span><h1>EL PACÍFICO<br /><em>TE NECESITA.</em></h1><p>Surca la bahía, rescata su vida marina y esquiva los peligros del mar. Cada punto cuenta para convertirte en leyenda.</p><a className="button button-primary" href="#niveles">Elegir misión <span aria-hidden="true">↓</span></a><div className="hero-facts"><span><strong>03</strong> NIVELES</span><span><strong>03</strong> VIDAS</span><span><strong>01</strong> OCÉANO</span></div></div><div className="hero-art" aria-hidden="true"><div className="hero-sun" /><div className="hero-lighthouse"><span /><i /></div><div className="hero-water" /><div className="hero-boat">⛵</div><div className="hero-art-label">PUNTARENAS · 09°58′ N</div></div></div></section>
    <section className="section container" id="niveles"><div className="section-heading"><div><span className="eyebrow">TU AVENTURA COMIENZA AQUÍ</span><h2>Elige tu guardia</h2><p>Escribe tu alias y escoge una misión para comenzar.</p></div><span className="section-index">01 / 03</span></div>
      <div className="alias-panel"><label htmlFor="player-name">NOMBRE DEL GUARDIÁN</label><input id="player-name" value={playerName} maxLength={20} placeholder="Tu alias (2 a 20 caracteres)" onChange={(event) => { setPlayerName(event.target.value); setAliasError('') }} aria-invalid={Boolean(aliasError)} aria-describedby={aliasError ? 'alias-error' : undefined} />{aliasError && <p id="alias-error" className="field-error" role="alert">{aliasError}</p>}</div>
      {loading ? <Loader text="Cargando misiones..." /> : error ? <ErrorMessage message={error} onRetry={() => { setError(''); setLoading(true); setReload((value) => value + 1) }} /> : levels.length === 0 ? <EmptyState message="Aún no hay niveles disponibles." /> : <div className="level-grid">{levels.map((level) => <LevelCard key={level.id} level={level} onSelect={selectLevel} />)}</div>}
    </section><section className="mission-strip"><div className="container"><span className="eyebrow">LA MISIÓN</span><p>“El faro guía a los barcos. <strong>Tú proteges lo que vive bajo su luz.</strong>”</p></div></section></>
}
