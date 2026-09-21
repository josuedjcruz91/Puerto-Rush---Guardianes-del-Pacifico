export default function LevelCard({ level, onSelect, available }) {
  return <article className="level-card"><div className="level-number">0{level.id}</div><div><span className="eyebrow">MISIÓN {level.id}</span><h3>{level.name}</h3><p>{level.description}</p><div className="level-meta"><span>◷ {level.duration} s</span><span>✦ Meta {level.goal}</span></div></div>{available ? <button className="button button-primary" onClick={onSelect}>Comenzar campaña <span aria-hidden="true">↗</span></button> : <span className="level-locked">Se desbloquea al cumplir la misión anterior</span>}</article>
}
