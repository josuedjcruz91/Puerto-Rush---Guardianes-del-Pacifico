export const MAX_LIVES = 3
export const BOAT_WIDTH = 76
export const ITEM_SIZE = 42
export const ITEM_TYPES = {
  turtle: { label: 'Tortuga rescatada', symbol: '🐢', points: 20, kind: 'positive' },
  fish: { label: 'Pez protegido', symbol: '🐟', points: 10, kind: 'positive' },
  star: { label: 'Estrella del Pacífico', symbol: '⭐', points: 30, kind: 'positive' },
  life: { label: 'Salvavidas', symbol: '🛟', points: 0, kind: 'positive' },
  trash: { label: 'Basura flotante', symbol: '🗑️', points: 0, kind: 'obstacle' },
  rock: { label: 'Roca', symbol: '🪨', points: 0, kind: 'obstacle' },
  storm: { label: 'Tormenta', symbol: '🌩️', points: -10, kind: 'obstacle' },
}
