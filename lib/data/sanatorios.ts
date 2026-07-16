export interface PlanCubre {
  prepagaSlug: string
  prepagaNombre: string
  planSlug: string
  planNombre: string
  precio: number
  nota?: string
}

export interface Sanatorio {
  slug: string
  nombre: string
  aliases: string[]
  zonas: string[]
  planesQueLoCubren: PlanCubre[]
}

export const sanatorios: Sanatorio[] = [
  {
    slug: 'hospital-italiano',
    nombre: 'Hospital Italiano',
    aliases: ['italiano', 'hospital italiano de buenos aires', 'hiba'],
    zonas: ['caba', 'gba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310, nota: 'Sacado del Plan 210 en agosto 2024. Requiere 310 mínimo.' },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '510', planNombre: 'Plan 510', precio: 1139396 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467, nota: 'No incluido en S1/S2. Suma desde SMG20.' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 373881 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 390775 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'plata', planNombre: 'Plan Plata', precio: 309892, nota: 'Con reintegros desde Plan Plata.' },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'oro', planNombre: 'Plan Oro', precio: 393744 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'platinum', planNombre: 'Plan Platinum', precio: 478050 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'azul', planNombre: 'Plan Azul', precio: 490333 },
    ],
  },
  {
    slug: 'hospital-aleman',
    nombre: 'Hospital Alemán',
    aliases: ['aleman', 'alemán', 'hospital alemán'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310, nota: 'No incluido en Plan 210.' },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '510', planNombre: 'Plan 510', precio: 1139396 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 373881, nota: 'Suma desde SMG30. No en S1/S2/SMG20.' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 390775 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'plata', planNombre: 'Plan Plata', precio: 309892 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'oro', planNombre: 'Plan Oro', precio: 393744 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'azul', planNombre: 'Plan Azul', precio: 490333 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-3000', planNombre: 'Plan 3000', precio: 458614 },
    ],
  },
  {
    slug: 'fleni',
    nombre: 'FLENI',
    aliases: ['fleni', 'fundación fleni'],
    zonas: ['caba', 'gba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250, nota: 'Solo consultas ambulatorias. Internación desde Plan 310.' },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310, nota: 'Internación completa desde Plan 310.' },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '510', planNombre: 'Plan 510', precio: 1139396 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 373881, nota: 'Suma desde SMG30.' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg40', planNombre: 'Plan SMG40', precio: 390775 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
    ],
  },
  {
    slug: 'fundacion-favaloro',
    nombre: 'Fundación Favaloro',
    aliases: ['favaloro', 'fundacion favaloro', 'fundación favaloro'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467, nota: 'Suma desde SMG20. No en S1.' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 373881 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
    ],
  },
  {
    slug: 'sanatorio-otamendi',
    nombre: 'Sanatorio Otamendi',
    aliases: ['otamendi', 'sanatorio otamendi'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467, nota: 'Suma desde SMG20. No en S1/S2.' },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg30', planNombre: 'Plan SMG30', precio: 373881 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'azul', planNombre: 'Plan Azul', precio: 490333 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
    ],
  },
  {
    slug: 'sanatorio-mater-dei',
    nombre: 'Sanatorio Mater Dei',
    aliases: ['mater dei', 'materdei'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'plata', planNombre: 'Plan Plata', precio: 309892 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'global', planNombre: 'Plan Global', precio: 437027 },
    ],
  },
  {
    slug: 'hospital-britanico',
    nombre: 'Hospital Británico',
    aliases: ['britanico', 'británico', 'hospital britanico'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
    ],
  },
  {
    slug: 'clinica-bazterrica',
    nombre: 'Clínica Bazterrica',
    aliases: ['bazterrica', 'clinica bazterrica', 'clínica bazterrica'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'smart', planNombre: 'Plan Smart', precio: 262000, nota: 'Incluido desde el plan más básico de Omint.' },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'global', planNombre: 'Plan Global', precio: 437027 },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'clasico', planNombre: 'Plan Clásico', precio: 568962 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
    ],
  },
  {
    slug: 'clinica-del-sol',
    nombre: 'Clínica del Sol',
    aliases: ['del sol', 'clinica del sol', 'clínica del sol'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'smart', planNombre: 'Plan Smart', precio: 262000, nota: 'Sanatorio propio de Omint — incluido en todos los planes.' },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'global', planNombre: 'Plan Global', precio: 437027 },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'clasico', planNombre: 'Plan Clásico', precio: 568962 },
    ],
  },
  {
    slug: 'clinica-santa-isabel',
    nombre: 'Clínica Santa Isabel',
    aliases: ['santa isabel', 'clinica santa isabel', 'clínica santa isabel'],
    zonas: ['caba'],
    planesQueLoCubren: [
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'smart', planNombre: 'Plan Smart', precio: 262000, nota: 'Sanatorio propio de Omint — incluido en todos los planes.' },
      { prepagaSlug: 'omint', prepagaNombre: 'Omint', planSlug: 'global', planNombre: 'Plan Global', precio: 437027 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
    ],
  },
  {
    slug: 'hospital-austral',
    nombre: 'Hospital Austral',
    aliases: ['austral', 'hospital universitario austral'],
    zonas: ['gba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '410', planNombre: 'Plan 410', precio: 459250 },
      { prepagaSlug: 'medicus', prepagaNombre: 'Medicus', planSlug: 'celeste', planNombre: 'Plan Celeste', precio: 399484 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467 },
    ],
  },
  {
    slug: 'sanatorio-juncal',
    nombre: 'Sanatorio Juncal',
    aliases: ['juncal', 'sanatorio juncal'],
    zonas: ['gba'],
    planesQueLoCubren: [
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'f700', planNombre: 'Plan F700', precio: 257337 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
    ],
  },
  {
    slug: 'hospital-privado-cordoba',
    nombre: 'Hospital Privado Universitario Córdoba',
    aliases: ['hospital privado cordoba', 'privado cordoba', 'hospital privado de córdoba'],
    zonas: ['cordoba'],
    planesQueLoCubren: [
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
    ],
  },
  {
    slug: 'sanatorio-allende-cordoba',
    nombre: 'Sanatorio Allende (Córdoba)',
    aliases: ['allende', 'sanatorio allende', 'clínica allende'],
    zonas: ['cordoba'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'f700', planNombre: 'Plan F700', precio: 257337 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467 },
    ],
  },
  {
    slug: 'hospital-italiano-rosario',
    nombre: 'Hospital Italiano Rosario',
    aliases: ['italiano rosario', 'hospital italiano rosario'],
    zonas: ['rosario'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '310', planNombre: 'Plan 310', precio: 345310 },
      { prepagaSlug: 'swiss-medical', prepagaNombre: 'Swiss Medical', planSlug: 'smg20', planNombre: 'Plan SMG20', precio: 325467 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'plan-1000', planNombre: 'Plan 1000', precio: 362701 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
    ],
  },
  {
    slug: 'sanatorio-espanol-rosario',
    nombre: 'Sanatorio Español Rosario',
    aliases: ['español rosario', 'sanatorio español', 'sanatorio español rosario'],
    zonas: ['rosario'],
    planesQueLoCubren: [
      { prepagaSlug: 'osde', prepagaNombre: 'OSDE', planSlug: '210', planNombre: 'Plan 210', precio: 267250 },
      { prepagaSlug: 'sancor-salud', prepagaNombre: 'Sancor Salud', planSlug: 'f700', planNombre: 'Plan F700', precio: 257337 },
      { prepagaSlug: 'medife', prepagaNombre: 'Medifé', planSlug: 'bronce', planNombre: 'Plan Bronce', precio: 240360 },
    ],
  },
]

export function buscarSanatorio(query: string): Sanatorio[] {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []
  return sanatorios.filter(
    (s) =>
      s.nombre.toLowerCase().includes(q) ||
      s.aliases.some((a) => a.includes(q))
  )
}

// zonaKey del cotizador (ZONA_PREPAGAS en ComparadorWizard) → tags de zona
// usados acá. Las provincias sin sanatorios cargados devuelven [] a propósito:
// el popup de Cartilla cae al fallback genérico en vez de mostrar datos de
// otra zona como si fueran locales.
const ZONA_SANATORIO: Record<string, string[]> = {
  caba: ['caba'],
  'buenos-aires': ['gba'],
  cordoba: ['cordoba'],
  'santa-fe': ['rosario'],
}

export interface SanatorioDePlan {
  sanatorio: Sanatorio
  cobertura: PlanCubre
}

// Sanatorios de alta complejidad que cubre un plan puntual, con la nota real
// si existe (ej. "no incluido en S1/S2"). `enZona` prioriza los que matchean
// la provincia elegida en el cotizador; si no hay ninguno ahí, devuelve los
// de otras zonas igual (mejor mostrar cartilla de otra provincia con la
// etiqueta correspondiente que no mostrar nada).
export function sanatoriosDePlan(prepagaSlug: string, planSlug: string, zonaKey?: string): SanatorioDePlan[] {
  const matches: SanatorioDePlan[] = []
  for (const s of sanatorios) {
    const cobertura = s.planesQueLoCubren.find(
      (p) => p.prepagaSlug === prepagaSlug && p.planSlug === planSlug
    )
    if (cobertura) matches.push({ sanatorio: s, cobertura })
  }
  const zonasLocales = zonaKey ? (ZONA_SANATORIO[zonaKey] ?? []) : []
  if (zonasLocales.length === 0) return matches
  return [...matches].sort((a, b) => {
    const aLocal = a.sanatorio.zonas.some((z) => zonasLocales.includes(z)) ? 0 : 1
    const bLocal = b.sanatorio.zonas.some((z) => zonasLocales.includes(z)) ? 0 : 1
    return aLocal - bLocal
  })
}
