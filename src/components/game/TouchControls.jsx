export default function TouchControls({ onMoveLeft, onMoveRight, disabled }) {
  return <div className="touch-controls" aria-label="Controles táctiles"><button disabled={disabled} onPointerDown={onMoveLeft} aria-label="Mover lancha a la izquierda">←</button><span>DESLIZA LA LANCHA</span><button disabled={disabled} onPointerDown={onMoveRight} aria-label="Mover lancha a la derecha">→</button></div>
}
