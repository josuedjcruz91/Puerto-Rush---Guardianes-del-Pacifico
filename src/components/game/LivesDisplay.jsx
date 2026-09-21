import { MAX_LIVES } from '../../constants/gameConfig'

export default function LivesDisplay({ lives }) {
  return <span aria-label={`${lives} de ${MAX_LIVES} vidas`}><span aria-hidden="true">{'♥'.repeat(lives)}{'♡'.repeat(MAX_LIVES - lives)}</span><small>VIDAS</small></span>
}
