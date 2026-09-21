export default function LevelCard({ level, onSelect }) {
  return <article className="level-card"><div className="level-number">0{level.id}</div><div><span className="eyebrow">NIVEL {level.id}</span><h3>{level.name}</h3><p>{level.description}</p><div className="level-meta"><span>◷ {level.duration} s</span><span>✦ Meta {level.goal}</span></div></div><button className="button button-primary" onClick={() => onSelect(level.id)}>Jugar nivel <span aria-hidden="true">↗</span></button></article>
}
