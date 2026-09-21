export default function PlayerBoat({ x }) {
  return <div className="player-boat" style={{ left: x }} aria-label="Lancha guardiana" role="img"><span className="boat-light" /><span className="boat-cabin" /><span className="boat-hull" /></div>
}
