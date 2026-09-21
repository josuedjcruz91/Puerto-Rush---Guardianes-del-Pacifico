import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 6000,
})

export function readableError(error, fallback) {
  if (!error.response) return `${fallback} Comprueba que el servicio esté encendido y vuelve a intentarlo.`
  const data = error.response.data
  if (Array.isArray(data?.errors)) return `${data.message || fallback}: ${data.errors.join(', ')}`
  return data?.message || fallback
}
