import { CAMPO_TRAMPA } from '@/lib/leads-validacion'

// Campo trampa para bots (21-oct-2026): invisible para las personas (fuera de
// la pantalla, sin tab ni lector de pantalla) pero presente en el HTML. Si
// llega completo, /api/leads descarta el lead. No usa display:none porque
// muchos bots saltean los campos ocultos así.
export function CampoTrampa() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        No completar este campo
        <input type="text" name={CAMPO_TRAMPA} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}

/** Para sumar al cuerpo del lead: { pya_confirmacion: lo que haya en el campo
 *  trampa de la página } ('' para una persona). */
export function datoTrampa(): Record<string, string> {
  if (typeof document === 'undefined') return { [CAMPO_TRAMPA]: '' }
  const valor = Array.from(document.querySelectorAll<HTMLInputElement>(`input[name="${CAMPO_TRAMPA}"]`)).map((i) => i.value).join('').slice(0, 100)
  return { [CAMPO_TRAMPA]: valor }
}
