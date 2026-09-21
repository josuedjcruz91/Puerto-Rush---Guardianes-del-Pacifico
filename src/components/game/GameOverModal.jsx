import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../../context/PlayerContext'
import ErrorMessage from '../common/ErrorMessage'

export default function GameOverModal({ outcome, completedScores, totalLevels, submission, onRetrySend, onNext, onRetryMission, onRestartCampaign }) {
  const navigate = useNavigate()
  const { playerName } = usePlayer()
  const { kind, mission } = outcome
  const total = completedScores.reduce((sum, entry) => sum + entry.score, 0)
  const final = kind === 'campaignWon'
  const lost = kind === 'lost'
  const title = final ? '¡Completaste las cinco misiones!' : lost ? 'La misión se interrumpió' : `¡Misión ${mission.level} completada!`

  return <div className="modal-backdrop"><section className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
    <span className="eyebrow">{final ? 'PODIO DEL PACÍFICO' : `MISIÓN ${mission.level} DE ${totalLevels}`}</span><h2 id="result-title">{title}</h2>
    <p>{lost ? 'Se agotó el tiempo o las vidas. Reintenta esta misión; tus misiones anteriores siguen en el acumulado de esta partida.' : final ? 'Tu clasificación usa la suma de las cinco misiones.' : 'La meta se cumplió. Revisa tus puntos y prepárate para la siguiente misión.'}</p>
    <div className="result-stats"><div><strong>{playerName}</strong><small>GUARDIÁN</small></div><div><strong>{mission.score}</strong><small>PUNTOS ESTA MISIÓN</small></div><div><strong>{total}</strong><small>ACUMULADO{lost ? ' COMPLETADO' : ''}</small></div></div>
    {completedScores.length > 0 && <div className="mission-recap"><h3>Marcador por misión</h3><ol>{completedScores.map((entry) => <li key={entry.level}><span>{entry.level}. {entry.levelName}</span><strong>+{entry.score}</strong></li>)}</ol></div>}
    {lost && <p className="notice">Los {mission.score} puntos de esta misión se sumarán cuando alcances la meta.</p>}
    {final && submission.status === 'sending' && <p className="notice" role="status">Enviando el total de cinco misiones a n8n...</p>}
    {final && submission.status === 'success' && <div className="submission-success" role="status"><strong>✓ Puntaje acumulado registrado</strong><p>Posición #{submission.data.position} · {submission.data.badge}</p>{Array.isArray(submission.data.topFive) && <div className="podium"><h3>Podio actual</h3><ol>{submission.data.topFive.slice(0, 3).map((entry, index) => <li key={entry.id ?? `${entry.playerName}-${index}`}><span>#{index + 1} {entry.playerName}</span><strong>{entry.score} pts</strong></li>)}</ol></div>}</div>}
    {final && submission.status === 'error' && <ErrorMessage message={submission.error} onRetry={onRetrySend} retryLabel="Reintentar envío" />}
    <div className="modal-actions">
      {kind === 'missionWon' && <button className="button button-primary" onClick={onNext}>Ir a la misión {mission.level + 1} →</button>}
      {lost && <button className="button button-primary" onClick={onRetryMission}>Reintentar misión</button>}
      {final && <button className="button button-primary" onClick={onRestartCampaign}>Nueva campaña</button>}
      {!final && <button className="button" onClick={onRestartCampaign}>Empezar desde la misión 1</button>}
      {final && <button className="button" onClick={() => navigate('/puntajes')} disabled={submission.status !== 'success'}>Ver clasificación</button>}
    </div>
  </section></div>
}
