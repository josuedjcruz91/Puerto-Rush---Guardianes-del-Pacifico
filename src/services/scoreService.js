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

export function scoreSubmissionError(error) {
  const status = error.response?.status
  const data = error.response?.data
  if (Array.isArray(data?.errors)) return `n8n rechazó el resultado (HTTP ${status}): ${data.errors.join(' ')}`
  if (status === 404) return 'El webhook no está registrado (HTTP 404). Importa y publica el workflow “Faro Rush - Registro y Leaderboard” en n8n. Comprueba que el nodo Webhook use POST y el path faro-rush-score.'
  if (status === 500 || status === 502 || status === 503) return `No se pudo completar el envío (HTTP ${status}). Revisa que n8n esté activo y que json-server responda en el puerto 3001. Consulta la ejecución en n8n para ver el nodo que falló.`
  if (error.code === 'ECONNABORTED') return 'n8n tardó demasiado en responder. Comprueba sus ejecuciones y usa “Reintentar envío”.'
  if (!error.response) return 'No hay conexión con n8n. Inícialo en localhost:5678, publica el workflow y vuelve a intentarlo.'
  return data?.message || error.message || `Error HTTP ${status} al enviar el puntaje.`
}
