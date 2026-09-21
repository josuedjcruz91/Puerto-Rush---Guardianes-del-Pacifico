import { api } from './api'

export async function getLevels() {
  const { data } = await api.get('/levels')
  if (!Array.isArray(data)) throw new Error('La respuesta de niveles no es válida.')
  return data
}
