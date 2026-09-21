import PlayerBoat from './PlayerBoat'
import FallingItem from './FallingItem'

export default function GameBoard({ boardRef, boatX, items, status }) {
  return <div className="game-board" ref={boardRef} aria-label="Área de juego"><div className="board-sun" /><div className="board-lighthouse"><span /><i /></div><div className="board-horizon" /><div className="board-waves" /><span className="board-label">BAHÍA DE PUNTARENAS · COSTA RICA</span>
    {items.map((item) => <FallingItem key={item.id} type={item.type} position={{ x: item.x, y: item.y }} />)}
    <PlayerBoat x={boatX} />
    {status === 'idle' && <div className="board-overlay"><strong>EL MAR TE ESPERA</strong><span>Presiona “Iniciar partida” para navegar.</span></div>}
    {status === 'paused' && <div className="board-overlay"><strong>EN PAUSA</strong><span>Presiona “Continuar” para volver al mar.</span></div>}
  </div>
}
