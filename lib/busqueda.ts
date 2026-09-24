/** Minúsculas y sin tildes, para buscar "medife" y encontrar "Medifé". */
export const normalizarBusqueda = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
