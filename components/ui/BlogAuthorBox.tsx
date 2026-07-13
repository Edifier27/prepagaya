import Link from 'next/link'
import { SITE_URL } from '@/lib/utils'

interface Props {
  fechaPublicacion: string
  fechaRevision?: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function BlogAuthorBox({ fechaPublicacion, fechaRevision }: Props): React.ReactElement {
  const revision = fechaRevision ?? fechaPublicacion
  return (
    <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 my-6">
      <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="#E8002D" strokeWidth={1.8} strokeLinecap="round" className="w-5 h-5">
          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm">Equipo PrepagaYa</span>
          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full font-medium">
            Verificado
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          Especialistas en medicina prepaga argentina · Datos verificados mensualmente
        </p>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 flex-wrap">
          <span>Publicado: {formatDate(fechaPublicacion)}</span>
          {fechaRevision && fechaRevision !== fechaPublicacion && (
            <span>· Revisado: {formatDate(revision)}</span>
          )}
          <span>·</span>
          <Link href="/metodologia" className="text-[#E8002D] hover:underline">
            Ver metodología →
          </Link>
        </div>
      </div>
    </div>
  )
}
