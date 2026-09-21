import Image from 'next/image'

// Franja de marca chica debajo del cotizador de la home (pedido de Darío,
// 21-sep-2026, inspirado en la cinta animada de zabalabienesraices.com pero
// a escala reducida: acá es una franja angosta, no un hero gigante). El
// logo se intercala con frases cortas — mismo patrón marca+tagline que la
// cinta de Zabala. Hover: la animación se pausa (CSS) y cada palabra crece
// un toque (para que se sienta "tocable", no solo decorativo).
const ITEMS = [
  { tipo: 'logo' as const },
  { tipo: 'texto' as const, texto: 'SIN DNI' },
  { tipo: 'logo' as const },
  { tipo: 'texto' as const, texto: 'COMPARÁ GRATIS' },
  { tipo: 'logo' as const },
  { tipo: 'texto' as const, texto: '+40 PREPAGAS' },
  { tipo: 'logo' as const },
  { tipo: 'texto' as const, texto: 'RESPUESTA EN MINUTOS' },
]

export function BrandMarquee() {
  return (
    <div className="bg-white border-b border-gray-100 overflow-hidden py-4">
      <div className="flex animate-marquee-band" style={{ width: 'max-content' }}>
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center shrink-0 px-5">
            {item.tipo === 'logo' ? (
              <Image src="/logo-wink.svg" alt="PrepagaYa" width={28} height={28} className="rounded-md" />
            ) : (
              <span className="font-black text-sm tracking-widest uppercase text-gray-900 transition-transform hover:scale-110 hover:text-[#E8002D] inline-block">
                {item.texto}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
