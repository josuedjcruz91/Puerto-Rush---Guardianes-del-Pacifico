import LivesDisplay from './LivesDisplay'

export default function ScoreBoard({ score, cumulative, time, level, totalLevels, goal, lives }) {
  return <div className="scoreboard" aria-live="polite"><div><strong>{score}</strong><small>MISIÓN / {goal}</small></div><div><strong>{cumulative}</strong><small>ACUMULADO</small></div><div><strong>{time}s</strong><small>TIEMPO</small></div><div><strong>{level}/{totalLevels}</strong><small>MISIÓN</small></div><div className="lives"><LivesDisplay lives={lives} /></div></div>
}
