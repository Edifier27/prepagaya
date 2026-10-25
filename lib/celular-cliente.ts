// Revisión del celular en los formularios (25-oct-2026): antes de enviar el
// lead se pregunta a /api/celular si el número existe (bloques de ENACOM).
// Si no, devuelve el texto para mostrar. Si la persona vuelve a enviar el
// mismo número, se acepta: puede ser una línea nueva que todavía no figura,
// y no queremos perder a nadie por eso (el lead llega marcado "celular no
// verificado"). Si la consulta falla, también se deja pasar.
const avisados = new Set<string>()

export async function revisarCelular(celular: string): Promise<string | null> {
  const digitos = celular.replace(/\D/g, '')
  if (avisados.has(digitos)) return null
  try {
    const r = await fetch('/api/celular', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ celular }) })
    const d = r.ok ? await r.json() : null
    if (d && d.ok === false && typeof d.mensaje === 'string') {
      avisados.add(digitos)
      return `${d.mensaje} Si es correcto, volvé a tocar el botón.`
    }
  } catch { /* sin conexión: que pase */ }
  return null
}
