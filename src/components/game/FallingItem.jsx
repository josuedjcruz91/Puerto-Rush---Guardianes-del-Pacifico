import { ITEM_TYPES } from '../../constants/gameConfig'

export default function FallingItem({ type, position, style }) {
  const item = ITEM_TYPES[type]
  return <div className={`falling-item item-${type}`} style={{ left: position.x, top: position.y, ...style }} role="img" aria-label={item.label} title={item.label}>{item.symbol}</div>
}
