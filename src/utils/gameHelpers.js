import { ITEM_TYPES } from '../constants/gameConfig'

export function randomItemType(level) {
  if (Math.random() < level.obstacleChance) {
    return Math.random() < level.stormChance ? 'storm' : (Math.random() < 0.5 ? 'trash' : 'rock')
  }
  const value = Math.random()
  return value < 0.36 ? 'fish' : value < 0.69 ? 'turtle' : value < 0.88 ? 'star' : 'life'
}

export function badgeForScore(score) {
  if (score >= 400) return 'Leyenda del Pacífico'
  if (score >= 250) return 'Protector del Faro'
  if (score >= 120) return 'Guardián de la Bahía'
  return 'Marinero Novato'
}

export function applyItem(itemType, score, lives, maxLives) {
  const item = ITEM_TYPES[itemType]
  if (itemType === 'life') return { score, lives: Math.min(maxLives, lives + 1), collected: 1 }
  if (item.kind === 'obstacle') return { score: Math.max(0, score + item.points), lives: Math.max(0, lives - 1), collected: 0 }
  return { score: score + item.points, lives, collected: 1 }
}
