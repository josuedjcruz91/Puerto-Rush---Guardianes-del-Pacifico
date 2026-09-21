import { useCallback, useEffect, useRef, useState } from 'react'
import { applyItem, randomItemType } from '../utils/gameHelpers'
import { BOAT_WIDTH, ITEM_SIZE, MAX_LIVES } from '../constants/gameConfig'

const initialGame = (level) => ({
  boatX: 0, score: 0, lives: MAX_LIVES, timeRemaining: level.duration,
  items: [], collectedItems: 0, status: 'idle',
})

export default function useGameEngine(level) {
  const boardRef = useRef(null)
  const nextItemId = useRef(0)
  const keysRef = useRef({ left: false, right: false })
  const remainingAtStart = useRef(level.duration)
  const [game, setGame] = useState(() => initialGame(level))

  const boardWidth = useCallback(() => boardRef.current?.clientWidth || 700, [])
  const start = useCallback(() => {
    keysRef.current = { left: false, right: false }
    remainingAtStart.current = level.duration
    setGame({ ...initialGame(level), boatX: Math.max(0, (boardWidth() - BOAT_WIDTH) / 2), status: 'playing' })
  }, [level, boardWidth])
  const pause = useCallback(() => setGame((current) => current.status === 'playing' ? { ...current, status: 'paused' } : current), [])
  const resume = useCallback(() => setGame((current) => current.status === 'paused' ? { ...current, status: 'playing' } : current), [])
  const move = useCallback((direction) => {
    setGame((current) => current.status === 'playing' ? {
      ...current,
      boatX: Math.max(0, Math.min(boardWidth() - BOAT_WIDTH, current.boatX + direction * 38)),
    } : current)
  }, [boardWidth])

  useEffect(() => {
    if (game.status !== 'playing') return undefined
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('button, a, input, textarea, select')) return
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(event.key)) event.preventDefault()
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') keysRef.current.left = true
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') keysRef.current.right = true
    }
    const onKeyUp = (event) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') keysRef.current.left = false
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') keysRef.current.right = false
    }
    const clearKeys = () => { keysRef.current = { left: false, right: false } }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', clearKeys)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', clearKeys)
      clearKeys()
    }
  }, [game.status])

  useEffect(() => {
    if (game.status !== 'playing') return undefined
    const deadline = Date.now() + remainingAtStart.current * 1000
    const timer = window.setInterval(() => setGame((current) => {
      if (current.status !== 'playing') return current
      const timeRemaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      remainingAtStart.current = timeRemaining
      return timeRemaining === current.timeRemaining ? current : { ...current, timeRemaining }
    }), 200)
    return () => window.clearInterval(timer)
  }, [game.status])

  useEffect(() => {
    if (game.status !== 'playing') return undefined
    const spawn = window.setInterval(() => {
      const width = boardWidth()
      const item = { id: ++nextItemId.current, type: randomItemType(level), x: Math.random() * Math.max(0, width - ITEM_SIZE), y: -ITEM_SIZE }
      setGame((current) => current.status === 'playing' ? { ...current, items: [...current.items, item] } : current)
    }, level.spawnInterval)
    return () => window.clearInterval(spawn)
  }, [game.status, level, boardWidth])

  useEffect(() => {
    if (game.status !== 'playing') return undefined
    const tickMs = 32
    let lastTick = performance.now()
    const tick = window.setInterval(() => {
      const now = performance.now()
      const elapsed = Math.min((now - lastTick) / 1000, 0.25)
      lastTick = now
      const width = boardWidth()
      const height = boardRef.current?.clientHeight || 440
      setGame((current) => {
        if (current.status !== 'playing') return current
        const direction = Number(keysRef.current.right) - Number(keysRef.current.left)
        const boatX = Math.max(0, Math.min(width - BOAT_WIDTH, current.boatX + direction * 220 * elapsed))
        let score = current.score
        let lives = current.lives
        let collectedItems = current.collectedItems
        const items = []
        for (const item of current.items) {
          const moved = { ...item, y: item.y + level.fallSpeed * elapsed }
          const collision = item.y <= height - 20 && moved.y + ITEM_SIZE >= height - 70
            && moved.x + ITEM_SIZE > boatX + 7 && moved.x < boatX + BOAT_WIDTH - 7
          if (collision) {
            const next = applyItem(item.type, score, lives, MAX_LIVES)
            score = next.score
            lives = next.lives
            collectedItems += next.collected
          } else if (moved.y < height) items.push(moved)
        }
        return { ...current, boatX, score, lives, collectedItems, items }
      })
    }, tickMs)
    return () => window.clearInterval(tick)
  }, [game.status, level, boardWidth])

  useEffect(() => {
    if (game.status !== 'playing') return
    if (game.score >= level.goal) setGame((current) => current.status === 'playing' ? { ...current, status: 'won' } : current)
    else if (game.lives <= 0 || game.timeRemaining <= 0) setGame((current) => current.status === 'playing' ? { ...current, status: 'lost' } : current)
  }, [game.status, game.score, game.lives, game.timeRemaining, level.goal])

  return { ...game, boardRef, start, pause, resume, move }
}
