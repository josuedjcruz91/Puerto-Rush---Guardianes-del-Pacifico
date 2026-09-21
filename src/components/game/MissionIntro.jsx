import { Link } from 'react-router-dom'

export default function MissionIntro({ level, cumulative, countdown, onStart }) {
  if (countdown !== null) return <div className="board-overlay mission-countdown" role="status" aria-live="assertive"><span>LA MISIÓN COMIENZA EN</span><strong>{countdown}</strong><span>Prepara tu lancha</span></div>
  return <div className="board-overlay mission-intro"><span className="eyebrow">MISIÓN {level.id} DE 5 · {level.name.toUpperCase()}</span><strong>Tu objetivo: {level.goal} puntos</strong><p>Recoge tortugas (+20), peces (+10) y estrellas (+30). El salvavidas recupera una vida. Evita basura, rocas y tormentas: quitan vidas; la tormenta también resta 10 puntos.</p><p>Muévete con ← →, A D o los botones táctiles. Tienes {level.duration} segundos y 3 vidas. Al cumplir la meta pasarás a la siguiente misión. Acumulado actual: <b>{cumulative} puntos</b>.</p><div className="intro-actions"><button className="button button-primary" onClick={onStart}>Iniciar cuenta regresiva</button><Link to="/instrucciones">Ver todas las reglas</Link></div></div>
}
