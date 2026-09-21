import axios from 'axios'
import { api } from './api'

export async function getScores() {
  const { data } = await api.get('/scores')
  if (!Array.isArray(data)) throw new Error('La respuesta de puntajes no es válida.')
  return [...data].sort((a, b) => b.score - a.score || new Date(a.playedAt) - new Date(b.playedAt))
}

export async function submitScore(payload) {
  const url = import.meta.env.VITE_N8N_WEBHOOK_URL || '/n8n/webhook/faro-rush-score'
  const { data } = await axios.post(url, payload, { timeout: 10000 })
  const response = Array.isArray(data) ? data[0] : data
  if (!response?.success || !response.savedScore) throw new Error(response?.message || 'n8n no confirmó el registro del puntaje.')
  return response
}
