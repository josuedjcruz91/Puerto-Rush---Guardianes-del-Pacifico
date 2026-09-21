import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useGameEngine from '../../hooks/useGameEngine'
import GameBoard from './GameBoard'
import GameControls from './GameControls'
import MissionIntro from './MissionIntro'
import ScoreBoard from './ScoreBoard'
import TouchControls from './TouchControls'

export default function MissionGame({ level, totalLevels, completedScores, onFinish, onRestart }) {
  const engine = useGameEngine(level)
  const [countdown, setCountdown] = useState(null)
  const countdownTimer = useRef(null)
  const reported = useRef(false)
  const cumulativeBefore = completedScores.filter((mission) => mission.level < Number(level.id)).reduce((sum, mission) => sum + mission.score, 0)

  const begin = useCallback(() => {
    if (engine.status !== 'idle' || countdownTimer.current !== null) return
    const deadline = performance.now() + 3000
    setCountdown(3)
    countdownTimer.current = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - performance.now()) / 1000))
      if (remaining === 0) {
        window.clearInterval(countdownTimer.current)
        countdownTimer.current = null
        setCountdown(null)
        engine.start()
      } else setCountdown(remaining)
    }, 100)
  }, [engine])

  useEffect(() => () => window.clearInterval(countdownTimer.current), [])
  useEffect(() => {
    if (reported.current || !['won', 'lost'].includes(engine.status)) return
    reported.current = true
    onFinish({ level: Number(level.id), levelName: level.name, score: engine.score, result: engine.status, timeRemaining: engine.timeRemaining, collectedItems: engine.collectedItems })
  }, [engine.status, engine.score, engine.timeRemaining, engine.collectedItems, level, onFinish])

  return <section className="section container game-page"><div className="game-heading"><div><span className="eyebrow">CAMPAÑA DEL PACÍFICO · MISIÓN {level.id} DE {totalLevels}</span><h1>{level.name}</h1></div><Link to="/" className="back-link">← Salir de la campaña</Link></div>
    <ol className="mission-progress" aria-label="Progreso de la campaña">{Array.from({ length: totalLevels }, (_, index) => <li key={index + 1} className={index + 1 < Number(level.id) ? 'done' : index + 1 === Number(level.id) ? 'current' : ''} aria-current={index + 1 === Number(level.id) ? 'step' : undefined}>Misión {index + 1}</li>)}</ol>
    <div className="game-shell"><ScoreBoard score={engine.score} cumulative={cumulativeBefore + engine.score} time={engine.timeRemaining} level={level.id} totalLevels={totalLevels} goal={level.goal} lives={engine.lives} /><GameBoard boardRef={engine.boardRef} boatX={engine.boatX} items={engine.items} status={engine.status} overlay={<MissionIntro level={level} cumulative={cumulativeBefore} countdown={countdown} onStart={begin} />} /><TouchControls onMoveLeft={() => engine.move(-1)} onMoveRight={() => engine.move(1)} disabled={engine.status !== 'playing'} /><GameControls status={engine.status} countdown={countdown} onStart={begin} onPause={engine.pause} onResume={engine.resume} onRestart={onRestart} /></div>
    <p className="game-tip">CUMPLE LA META PARA DESBLOQUEAR LA SIGUIENTE MISIÓN · LOS PUNTOS SE SUMAN PARA EL PODIO</p>
  </section>
}
