import Link from 'next/link'

// Cierre de las páginas de obras sociales y de la calculadora de aportes (23-nov-2026): "ver prepagas que aceptan tus aportes".
// Clarity, 16-22 nov: /obras-sociales/codigos (206 visitantes), cartillas y fichas de obras sociales con tráfico y sin contactos.
// Lleva al cotizador con Swiss Medical primero y una fuente propia para medirlo (el lead llega como "<fuente> · <desde>"):
//   cierre-os      → fichas, códigos y cartillas de obras sociales
//   cierre-aportes → calculadora de aportes
// El comparador solo acepta de 3 a 20 letras minúsculas o guiones en `desde`: si se cambia el nombre, respetarlo o se pierde.
// No muestra ningún precio: el valor para cada grupo se ve después de dejar los datos en el cotizador.
export type FuenteCierreAportes = 'cierre-os' | 'cierre-aportes'

export function CierreAportes({ fuente, osNombre, osSlug }: { fuente: FuenteCierreAportes; osNombre?: string; osSlug?: string }) {
  return (
    <section className="py-12 bg-[#E8002D] text-white">
      <div className="container max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Prepagas que aceptan tus aportes</h2>
        <p className="text-white text-sm mb-6">
          Si trabajás en relación de dependencia, podés derivar tus aportes{osNombre ? ` de ${osNombre}` : ''} a una prepaga y pagar solo la diferencia.
          Cotizá gratis y sin DNI, con los precios oficiales de la SSSalud.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/comparador?prepaga=swiss-medical&desde=${fuente}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all text-sm"
          >
            Ver prepagas con mis aportes →
          </Link>
          {osSlug && (
            <Link
              href={`/calculadora-aportes?os=${osSlug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm"
            >
              Calcular mi diferencia
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
