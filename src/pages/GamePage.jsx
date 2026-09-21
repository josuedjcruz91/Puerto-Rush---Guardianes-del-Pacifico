import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../components/common/ErrorMessage'
import Loader from '../components/common/Loader'
import GameOverModal from '../components/game/GameOverModal'
import MissionGame from '../components/game/MissionGame'
import { usePlayer } from '../context/PlayerContext'
import { readableError } from '../services/api'
import { getLevels } from '../services/levelService'
import { scoreSubmissionError, submitScore } from '../services/scoreService'
import { validateAlias } from '../utils/validators'

function CampaignGame({ levels, playerName }) {
  const [missionIndex, setMissionIndex] = useState(0)
  const [completedScores, setCompletedScores] = useState([])
  const [outcome, setOutcome] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [submission, setSubmission] = useState({ status: 'idle', data: null, error: '' })
  const payloadRef = useRef(null)
  const submissionRun = useRef(0)
  const level = levels[missionIndex]

  const send = useCallback(async (payload) => {
    const run = ++submissionRun.current
    setSubmission({ status: 'sending', data: null, error: '' })
    try {
      const data = await submitScore(payload)
      if (run === submissionRun.current) setSubmission({ status: 'success', data, error: '' })
    } catch (error) {
      if (run === submissionRun.current) setSubmission({ status: 'error', data: null, error: scoreSubmissionError(error) })
    }
  }, [])

  const finishMission = useCallback((result) => {
    if (result.result === 'lost') {
      setOutcome({ kind: 'lost', mission: result })
      return
    }
    const nextScores = [...completedScores, result]
    setCompletedScores(nextScores)
    if (nextScores.length < levels.length) {
      setOutcome({ kind: 'missionWon', mission: result })
      return
    }
    setOutcome({ kind: 'campaignWon', mission: result })
    payloadRef.current = {
      playerName,
      score: nextScores.reduce((sum, mission) => sum + mission.score, 0),
      level: Number(level.id),
      levelName: level.name,
      result: 'won',
      timeRemaining: result.timeRemaining,
      collectedItems: nextScores.reduce((sum, mission) => sum + mission.collectedItems, 0),
      missionScores: nextScores.map((mission) => mission.score),
      playedAt: new Date().toISOString(),
    }
    send(payloadRef.current)
  }, [completedScores, levels.length, level, playerName, send])

  function restartCampaign() {
    submissionRun.current += 1
    payloadRef.current = null
    setSubmission({ status: 'idle', data: null, error: '' })
    setCompletedScores([])
    setMissionIndex(0)
    setOutcome(null)
    setAttempt((value) => value + 1)
  }

  return <>
    <MissionGame key={`${level.id}-${attempt}`} level={level} totalLevels={levels.length} completedScores={completedScores} onFinish={finishMission} onRestart={() => { setOutcome(null); setAttempt((value) => value + 1) }} />
    {outcome && <GameOverModal outcome={outcome} completedScores={completedScores} totalLevels={levels.length} submission={submission} onRetrySend={() => payloadRef.current && send(payloadRef.current)} onNext={() => { setMissionIndex((value) => value + 1); setOutcome(null) }} onRetryMission={() => { setOutcome(null); setAttempt((value) => value + 1) }} onRestartCampaign={restartCampaign} />}
  </>
}

export default function GamePage() {
  const { nivel } = useParams()
  const { playerName } = usePlayer()
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    getLevels().then((data) => { if (active) setLevels([...data].sort((a, b) => Number(a.id) - Number(b.id))) }).catch((err) => { if (active) setError(readableError(err, 'No se pudieron cargar las misiones.')) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])

  if (loading) return <section className="section container"><Loader text="Cargando campaña..." /></section>
  if (error) return <section className="section container"><ErrorMessage message={error} onRetry={() => { setError(''); setLoading(true); setReload((value) => value + 1) }} /><Link to="/">Volver al inicio</Link></section>
  if (!levels.some((level) => String(level.id) === nivel)) return <section className="section container page-section"><h1>Nivel no encontrado</h1><p>Esta misión no existe.</p><Link className="button button-primary" to="/">Volver al inicio</Link></section>
  if (nivel !== '1') return <section className="section container page-section"><h1>Comienza por la misión 1</h1><p>Las misiones se desbloquean en orden. Así se conserva el puntaje acumulado hasta el podio.</p><Link className="button button-primary" to="/">Ir al inicio</Link></section>
  if (levels.length !== 5 || levels.some((level, index) => Number(level.id) !== index + 1)) return <section className="section container page-section"><ErrorMessage message="La campaña necesita las cinco misiones numeradas del 1 al 5 en db.json." /></section>
  if (validateAlias(playerName)) return <section className="section container page-section"><h1>Antes de navegar</h1><p>Escribe un alias válido en el inicio para jugar.</p><Link className="button button-primary" to="/">Ir al inicio</Link></section>
  return <CampaignGame levels={levels} playerName={playerName} />
}
