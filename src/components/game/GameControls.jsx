export default function GameControls({ status, onStart, onPause, onResume, onRestart }) {
  return <div className="game-controls"><button className="button button-primary" onClick={onStart} disabled={status !== 'idle'}>Iniciar partida</button><button className="button" onClick={onPause} disabled={status !== 'playing'}>Pausar</button><button className="button" onClick={onResume} disabled={status !== 'paused'}>Continuar</button><button className="button button-quiet" onClick={onRestart} disabled={status === 'idle'}>Reiniciar</button></div>
}
