import { NavLink } from 'react-router-dom'
import { usePlayer } from '../../context/PlayerContext'

export default function Header() {
  const { playerName } = usePlayer()
  return <header className="site-header"><div className="container header-inner">
    <NavLink className="brand" to="/" aria-label="Faro Rush, ir al inicio"><span className="brand-icon" aria-hidden="true">♜</span><span>FARO <strong>RUSH</strong><small>GUARDIANES DEL PACÍFICO</small></span></NavLink>
    <nav aria-label="Navegación principal"><NavLink to="/" end>Inicio</NavLink><NavLink to="/instrucciones">Cómo jugar</NavLink><NavLink to="/puntajes">Clasificación</NavLink></nav>
    {playerName && <span className="header-player">⚓ {playerName}</span>}
  </div></header>
}
