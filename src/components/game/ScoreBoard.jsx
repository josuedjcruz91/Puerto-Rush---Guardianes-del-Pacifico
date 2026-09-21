import LivesDisplay from './LivesDisplay'

export default function ScoreBoard({ score, time, level, goal, lives }) {
  return <div className="scoreboard" aria-live="polite"><div><strong>{score}</strong><small>PUNTOS / {goal}</small></div><div><strong>{time}s</strong><small>TIEMPO</small></div><div><strong>0{level}</strong><small>NIVEL</small></div><div className="lives"><LivesDisplay lives={lives} /></div></div>
}
