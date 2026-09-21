import { createContext, useContext, useState } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [playerName, setPlayerName] = useState('')
  return <PlayerContext.Provider value={{ playerName, setPlayerName }}>{children}</PlayerContext.Provider>
}

// El hook comparte este contexto con el proveedor de la aplicación.
// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayer debe utilizarse dentro de PlayerProvider')
  return context
}
