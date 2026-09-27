// Topes de reintegro que las prepagas actualizan TODOS LOS MESES (Darío,
// 27-sep-2026: "ese reintegro de cirugía estética se actualiza todos los
// meses"). Un solo lugar para cambiarlos: cada mes, monto y mes del alcance
// oficial del plan. Los textos dicen "se actualiza todos los meses: en <mes>
// era de <monto>", así siguen siendo ciertos aunque el dato tenga un mes.

/** Swiss Medical SMG50, cirugía estética por reintegro (Alcance de la cobertura SMG50) */
export const TOPE_CIRUGIA_SMG50 = {
  texto: '$3.765.888',
  mes: 'septiembre de 2026',
}

/** "se actualiza todos los meses: en septiembre de 2026 era de $3.765.888" */
export const topeCirugiaSmg50 = `se actualiza todos los meses: en ${TOPE_CIRUGIA_SMG50.mes} era de ${TOPE_CIRUGIA_SMG50.texto}`
