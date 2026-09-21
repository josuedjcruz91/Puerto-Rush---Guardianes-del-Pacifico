import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../../context/PlayerContext'
import ErrorMessage from '../common/ErrorMessage'

export default function GameOverModal({ result, score, level, submission, onRetry, onPlayAgain }) {
  const navigate = useNavigate()
  const { playerName } = usePlayer()
  return <div className="modal-backdrop"><section className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
    <span className="eyebrow">MISIÓN FINALIZADA</span><h2 id="result-title">{result === 'won' ? '¡La bahía está a salvo!' : 'La guardia ha terminado'}</h2>
    <p>{result === 'won' ? 'Alcanzaste la meta del nivel.' : 'Puedes volver a intentarlo y proteger más vida marina.'}</p>
    <div className="result-stats"><div><strong>{playerName}</strong><small>GUARDIÁN</small></div><div><strong>{score}</strong><small>PUNTOS</small></div><div><strong>0{level.id}</strong><small>NIVEL</small></div></div>
    {submission.status === 'sending' && <p className="notice" role="status">Enviando resultado a n8n...</p>}
    {submission.status === 'success' && <div className="submission-success" role="status"><strong>✓ Puntaje registrado</strong><p>Posición #{submission.data.position} · {submission.data.badge}</p></div>}
    {submission.status === 'error' && <ErrorMessage message={submission.error} onRetry={onRetry} retryLabel="Reintentar envío" />}
    <div className="modal-actions"><button className="button button-primary" onClick={onPlayAgain}>Jugar nuevamente</button><button className="button" onClick={() => navigate('/puntajes')}>Ver clasificación</button></div>
  </section></div>
}
