// Pediatría por sanatorio (1-oct-2026): cuántos pediatras y subespecialistas
// atienden en cada sede, contados del cuerpo médico que publica el propio
// sanatorio. Regla de Darío: no se publican nombres de médicos, solo conteos;
// para ver quiénes son, se enlaza a la página oficial del sanatorio.

export interface PediatriaSanatorio {
  /** Página oficial del cuerpo médico */
  fuente: string
  /** Fecha (ISO) en que se contó */
  verificado: string
  /** Pediatras de pediatría general por sede */
  generalesPorSede: { sede: string; n: number }[]
  /** Pediatras de pediatría general, sin repetir a quien atiende en más de una sede */
  totalGenerales: number
  /** Subespecialistas pediátricos (una persona puede tener más de una subespecialidad) */
  subespecialidades: { nombre: string; n: number }[]
  /** Subespecialistas, sin repetir */
  totalSubespecialistas: number
}

export const PEDIATRIA_SANATORIOS: Record<string, PediatriaSanatorio> = {
  'sanatorio-las-lomas': {
    fuente: 'https://laslomas.com.ar/cuerpo-medico/',
    verificado: '2026-10-01',
    generalesPorSede: [
      { sede: 'San Isidro', n: 19 },
      { sede: 'Nordelta', n: 8 },
      { sede: 'Pilar', n: 8 },
    ],
    totalGenerales: 33,
    subespecialidades: [
      { nombre: 'Neumonología pediátrica', n: 6 },
      { nombre: 'Fonoaudiología pediátrica', n: 5 },
      { nombre: 'Cardiología pediátrica', n: 4 },
      { nombre: 'Dermatología pediátrica', n: 3 },
      { nombre: 'Oftalmología pediátrica', n: 3 },
      { nombre: 'Cirugía general pediátrica', n: 2 },
      { nombre: 'Ecocardiografía pediátrica', n: 2 },
      { nombre: 'Traumatología pediátrica', n: 2 },
      { nombre: 'Alergia e inmunología pediátrica', n: 1 },
      { nombre: 'Diabetología pediátrica', n: 1 },
      { nombre: 'Nefrología pediátrica', n: 1 },
      { nombre: 'Nutrición pediátrica', n: 1 },
      { nombre: 'Urología pediátrica', n: 1 },
    ],
    totalSubespecialistas: 31,
  },
}

export function pediatriaDeSanatorio(slug: string): PediatriaSanatorio | undefined {
  return PEDIATRIA_SANATORIOS[slug]
}
