import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import GameBoard from '../components/game/GameBoard'
import ScoreBoard from '../components/game/ScoreBoard'
import TouchControls from '../components/game/TouchControls'
import GameControls from '../components/game/GameControls'
import GameOverModal from '../components/game/GameOverModal'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { usePlayer } from '../context/PlayerContext'
import useGameEngine from '../hooks/useGameEngine'
import { getLevels } from '../services/levelService'
import { submitScore } from '../services/scoreService'
import { readableError } from '../services/api'
import { validateAlias } from '../utils/validators'

function ActiveGame({ level, playerName }) {
  const engine = useGameEngine(level)
  const [submission, setSubmission] = useState({ status: 'idle', data: null, error: '' })
  const submitted = useRef(false)
  const payloadRef = useRef(null)
  const { score, lives, timeRemaining, collectedItems, status } = engine

  const send = useCallback(async (payload) => {
    setSubmission({ status: 'sending', data: null, error: '' })
    try {
      const data = await submitScore(payload)
      setSubmission({ status: 'success', data, error: '' })
    } catch (error) {
      setSubmission({ status: 'error', data: null, error: readableError(error, 'No se pudo enviar el puntaje a n8n.') })
    }
  }, [])

  useEffect(() => {
    if ((status !== 'won' && status !== 'lost') || submitted.current) return
    submitted.current = true
    payloadRef.current = { playerName, score, level: level.id, levelName: level.name, result: status, timeRemaining, collectedItems, playedAt: new Date().toISOString() }
    send(payloadRef.current)
  }, [status, playerName, score, level, timeRemaining, collectedItems, send])

  function restart() {
    submitted.current = false
    payloadRef.current = null
    setSubmission({ status: 'idle', data: null, error: '' })
    engine.start()
  }

  return <section className="section container game-page"><div className="game-heading"><div><span className="eyebrow">MISIÓN 0{level.id} · {level.name.toUpperCase()}</span><h1>Protege la bahía</h1></div><Link to="/" className="back-link">← Cambiar nivel</Link></div>
    <div className="game-shell"><ScoreBoard score={score} time={timeRemaining} level={level.id} goal={level.goal} lives={lives} /><GameBoard boardRef={engine.boardRef} boatX={engine.boatX} items={engine.items} status={status} /><TouchControls onMoveLeft={() => engine.move(-1)} onMoveRight={() => engine.move(1)} disabled={status !== 'playing'} /><GameControls status={status} onStart={engine.start} onPause={engine.pause} onResume={engine.resume} onRestart={restart} /></div><p className="game-tip">TECLADO: ← → O A D · RECOGE LA VIDA MARINA · EVITA LOS PELIGROS</p>
    {(status === 'won' || status === 'lost') && <GameOverModal result={status} score={score} level={level} submission={submission} onRetry={() => send(payloadRef.current)} onPlayAgain={restart} />}
  </section>
}

export default function GamePage() {
  const { nivel } = useParams()
  const { playerName } = usePlayer()
  const [currentLevel, setCurrentLevel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  useEffect(() => {
    let active = true
    getLevels().then((data) => { if (active) setCurrentLevel(data.find((entry) => String(entry.id) === nivel) || null) }).catch((err) => { if (active) setError(readableError(err, 'No se pudo cargar el nivel.')) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload, nivel])
  if (loading) return <section className="section container"><Loader text="Cargando nivel..." /></section>
  if (error) return <section className="section container"><ErrorMessage message={error} onRetry={() => { setError(''); setLoading(true); setReload((value) => value + 1) }} /><Link to="/">Volver al inicio</Link></section>
  if (!currentLevel) return <section className="section container page-section"><h1>Nivel no encontrado</h1><p>Esta misión no existe.</p><Link className="button button-primary" to="/">Volver al inicio</Link></section>
  if (validateAlias(playerName)) return <section className="section container page-section"><h1>Antes de navegar</h1><p>Escribe un alias válido en el inicio para jugar.</p><Link className="button button-primary" to="/">Ir al inicio</Link></section>
  return <ActiveGame key={currentLevel.id} level={currentLevel} playerName={playerName} />
}
