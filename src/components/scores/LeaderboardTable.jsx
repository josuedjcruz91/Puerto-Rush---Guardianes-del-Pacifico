import { badgeForScore } from '../../utils/gameHelpers'

export default function LeaderboardTable({ scores }) {
  return <div className="table-wrap"><table><thead><tr><th>POS.</th><th>GUARDIÁN</th><th>PUNTOS</th><th>NIVEL</th><th>INSIGNIA</th><th>FECHA</th></tr></thead><tbody>
    {scores.map((entry, index) => <tr key={entry.id ?? `${entry.playerName}-${entry.playedAt}`}><td><span className="rank">#{index + 1}</span></td><td className="player-cell">{entry.playerName}</td><td className="points-cell">{entry.score}</td><td>{Array.isArray(entry.missionScores) ? `${entry.missionScores.length} misiones` : entry.levelName || `Nivel ${entry.level}`}</td><td>{entry.badge || badgeForScore(entry.score)}</td><td>{Number.isNaN(Date.parse(entry.playedAt)) ? '—' : new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(new Date(entry.playedAt))}</td></tr>)}
  </tbody></table></div>
}
