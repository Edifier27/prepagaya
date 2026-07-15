export interface Plan {
  slug: string
  nombre: string
  precio: number // precio base (30 años, individual)
  descripcion: string
  cobertura: string[]
  copago: boolean
  redAbierta: boolean
  destacado?: boolean
}

export interface Prepaga {
  slug: string
  nombre: string
  logo: string
  colorPrimario: string
  descripcion: string
  satisfaccion: number // porcentaje 0-100
  rating: number // 0-5
  calidadCartilla: number // 1-5, calidad de la red de prestadores (cartilla)
  cantidadOpiniones: number
  profesionales: number
  sanatoriosPropios: number
  planes: Plan[]
  pros: string[]
  contras: string[]
  telefono?: string
  web?: string
  caracteristicas: {
    appMovil: boolean
    atencion24hs: boolean
    coberturaNacional: boolean
    odontologia: boolean
    saludMental: boolean
    maternidad: boolean
    optica: boolean
    farmacia: boolean
  }
  ciudades: string[]
}

export interface Comparativa {
  slug: string
  prepaga1Slug: string
  prepaga2Slug: string
  titulo: string
  descripcion: string
  ganadorPrecio: string
  ganadorRed: string
  ganadorSatisfaccion: string
  veredicto: string
}

export interface Ciudad {
  slug: string
  nombre: string
  provincia: string
  prepagasDisponibles: string[]
}

export interface Perfil {
  slug: string
  nombre: string
  descripcion: string
  prepagsRecomendadas: string[]
}

export interface Guia {
  slug: string
  titulo: string
  descripcion: string
  contenido: string
}

export interface Review {
  id: string
  prepagaSlug: string
  planSlug?: string
  nombre: string
  rating: number
  comentario: string
  fecha: string
  verificado: boolean
}
