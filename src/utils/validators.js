export function validateAlias(value) {
  const alias = value.trim().replace(/\s+/g, ' ')
  if (alias.length < 2 || alias.length > 20) return 'El alias debe tener entre 2 y 20 caracteres.'
  return ''
}
