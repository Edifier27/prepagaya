import type { Metadata } from 'next'
import Link from 'next/link'
import { PRECIO_ACTUALIZADO_PT } from '@/lib/data/prepagas'
import { SITE_NAME, SITE_URL } from '@/lib/utils'
import { extremosA30 } from '@/lib/precios/resumen'
import { pesosPt } from '@/lib/precios/en'
import { planesEstudiante } from '@/lib/precios/estudiante'
import { TablaPreciosIntl } from '@/components/intl/TablaPreciosIntl'
import { TablaEstudianteIntl } from '@/components/intl/TablaEstudianteIntl'
import { UsdAprox } from '@/components/intl/Dolar'
import { ContratarPlanButtonIntl } from '@/components/prepagas/ContratarPlanButtonIntl'
import { ldJson } from '@/lib/jsonld'

// Página en portugués (26-nov-2026, pedido de Darío): brasileños que viven o
// estudian en Argentina. Asesoramos en portugués, Swiss Medical afilia con
// pasaporte o residencia precaria y damos el certificado de cobertura para el
// DNI. Montos del cuadro oficial de la SSSalud, nada escrito a mano. Sin el
// descuento por edad de Swiss: se comunica después, en la cotización.

const A30 = extremosA30()
const URL_PAGINA = `${SITE_URL}/pt/plano-de-saude-argentina`

// Planes de Swiss Medical para un estudiante de 22 años (CABA y GBA)
const ESTUDANTE = planesEstudiante()
const ESTUDANTE_DESDE = ESTUDANTE.length ? Math.min(...ESTUDANTE.map((f) => f.precio)) : NaN
const listaEstudante = ESTUDANTE.map((f) => `${f.plan}, ${pesosPt(f.precio)}`).join('; ')

// Rede da Swiss Medical nas cidades com faculdades que os brasileiros mais buscam
const CIDADES: [string, string][] = [
  ['Buenos Aires (CABA)', 'caba'], ['La Plata', 'la-plata'], ['Rosario', 'rosario'], ['Córdoba', 'cordoba'],
  ['Corrientes', 'corrientes'], ['Mendoza', 'mendoza'], ['La Rioja', 'la-rioja'], ['Posadas', 'posadas'],
]

const FONTES_DECRETO = [
  { texto: 'Decreto 366/2025, Boletim Oficial', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/326096/2025-05-29' },
  { texto: 'Presidência: atendimento de não residentes', url: 'https://www.argentina.gob.ar/node/467195' },
  { texto: 'Migraciones: residência temporária de estudante', url: 'https://www.argentina.gob.ar/servicio/obtener-una-residencia-temporaria-como-estudiante' },
]

export const metadata: Metadata = {
  title: { absolute: `Plano de saúde na Argentina para brasileiros (${PRECIO_ACTUALIZADO_PT})` },
  description: `Na Argentina, plano de saúde se chama prepaga: desde ${pesosPt(A30.min.precio)} por mês aos 30 anos (tabela oficial). Filiação com passaporte e atendimento em português.`,
  alternates: {
    canonical: URL_PAGINA,
    languages: {
      'es-AR': `${SITE_URL}/para/extranjeros`,
      en: `${SITE_URL}/en/health-insurance-argentina`,
      ru: `${SITE_URL}/ru/strahovanie-argentina`,
      zh: `${SITE_URL}/zh/yiliao-baoxian-agenting`,
      pt: URL_PAGINA,
    },
  },
  keywords: [
    'plano de saúde na argentina',
    'quanto custa um plano de saúde na argentina',
    'como se chama plano de saúde na argentina',
    'plano de saúde estudante argentina',
    'seguro saúde argentina obrigatório',
    'prepaga argentina',
    'residência precária argentina',
  ],
}

const faqs: { q: string; a: string }[] = [
  {
    q: 'Como se chama plano de saúde na Argentina?',
    a: 'Prepaga, ou medicina prepaga. É o plano de saúde privado: você paga uma mensalidade conforme a idade e o plano e usa os médicos, clínicas e prontos-socorros da rede (a "cartilla"). As prepagas são reguladas pela Superintendencia de Servicios de Salud e todas cobrem pelo menos o PMO (Programa Médico Obrigatório). Já a obra social é a cobertura ligada ao trabalho formal: quem trabalha com carteira assinada na Argentina ou é monotributista contribui para uma.',
  },
  {
    q: 'Quanto custa um plano de saúde na Argentina?',
    a: `Estrangeiros pagam o mesmo que argentinos: o preço depende da idade e do plano, não da nacionalidade. Pela tabela oficial de ${PRECIO_ACTUALIZADO_PT}, para uma pessoa de 30 anos os planos vão de ${pesosPt(A30.min.precio)} por mês (${A30.min.prepaga}, ${A30.min.plan}) a ${pesosPt(A30.max.precio)} (${A30.max.prepaga}, ${A30.max.plan}), com IVA, na Cidade de Buenos Aires e Grande Buenos Aires.${listaEstudante ? ` Para uma pessoa de 22 anos, na Swiss Medical: ${listaEstudante} por mês, com 15% off na contratação on-line.` : ''}`,
  },
  {
    q: 'Brasileiro pode contratar plano de saúde na Argentina sem DNI?',
    a: 'Sim. A Swiss Medical aceita a filiação com o passaporte ou com o certificado de residência precária que a Migraciones entrega quando você inicia o trâmite de residência. Para outras prepagas, consulte o seu caso com o assessor.',
  },
  {
    q: 'Vocês dão o certificado de cobertura para a residência e o DNI?',
    a: 'Sim. Ao se filiar, nós entregamos o certificado de cobertura da prepaga para você apresentar no trâmite de residência e do DNI.',
  },
  {
    q: 'Vou estudar medicina na Argentina: preciso de plano de saúde?',
    a: `Enquanto você não tiver residência permanente, o Decreto 366/2025 exige seguro saúde, e nos hospitais públicos o atendimento programado é cobrado (a emergência é sempre atendida). Por isso, quem fica o ano todo costuma contratar uma prepaga${Number.isFinite(ESTUDANTE_DESDE) ? `: para uma pessoa de 22 anos, na Swiss Medical, a partir de ${pesosPt(ESTUDANTE_DESDE)} por mês (tabela oficial de ${PRECIO_ACTUALIZADO_PT}, Cidade de Buenos Aires e Grande Buenos Aires)` : ''}.`,
  },
  {
    q: 'O seguro saúde é obrigatório para entrar na Argentina?',
    a: 'Sim, para quem não tem residência permanente. O Decreto 366/2025, publicado no Boletim Oficial em 29 de maio de 2025, exige seguro saúde dos estrangeiros que entram no país sem residência permanente. Nos hospitais públicos, o atendimento programado de quem não tem residência permanente é cobrado; a emergência é sempre atendida.',
  },
  {
    q: 'Seguro viagem ou prepaga: qual eu preciso?',
    a: 'Para uma viagem curta, o habitual é um seguro viagem (assistência ao viajante), que nós não vendemos. Se você vai ficar meses ou anos, para estudar, trabalhar ou morar, a prepaga é a cobertura completa: médicos, exames, pronto-socorro e internação da rede todos os meses, sem limite por evento.',
  },
  {
    q: 'O plano de saúde na Argentina tem carência?',
    a: 'O que está no PMO (consultas, exames, internação, urgências) não pode ter carência, pela Lei 26.682 (art. 10). Para gravidez, a Swiss Medical tem carência de 2 meses desde a filiação, e não é possível entrar já grávida. No Brasil, a carência pode chegar a 180 dias, e a 300 dias para o parto.',
  },
  {
    q: 'O atendimento é em português?',
    a: 'Sim. Um assessor que fala português cota o plano, explica a cobertura e acompanha a filiação. Também atendemos em espanhol e inglês.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Plano de saúde na Argentina: guia para brasileiros',
    description: 'Como funciona a prepaga, quanto custa pela tabela oficial, filiação com passaporte e o seguro saúde exigido pelo Decreto 366/2025.',
    url: URL_PAGINA,
    image: `${SITE_URL}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': URL_PAGINA },
    inLanguage: 'pt-BR',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
]

const COMPARACAO: [string, string, string][] = [
  ['Nome', 'Plano de saúde, convênio', 'Prepaga (medicina prepaga)'],
  ['Quem regula', 'ANS (Agência Nacional de Saúde Suplementar)', 'Superintendencia de Servicios de Salud (SSSalud)'],
  ['Cobertura mínima', 'Rol de procedimentos da ANS', 'PMO (Programa Médico Obrigatório)'],
  ['Carência', 'Até 24 horas para urgência e emergência, até 300 dias para o parto e até 180 dias para o resto', 'O que está no PMO (consultas, exames, internação, urgências) não pode ter carência. Gravidez: 2 meses desde a filiação na Swiss Medical, e não dá para entrar já grávida'],
  ['Coparticipação', 'Planos com ou sem coparticipação', 'Planos com ou sem copago: na Swiss Medical, sem copago nas consultas a partir do SMG02'],
  ['Rede', 'Rede credenciada', 'Cartilla: médicos, clínicas, laboratórios e prontos-socorros (guardias)'],
]

const GLOSSARIO: [string, string][] = [
  ['Plano de saúde', 'Prepaga'],
  ['Rede credenciada', 'Cartilla'],
  ['Pronto-socorro', 'Guardia'],
  ['Coparticipação', 'Copago'],
  ['Carência', 'Carencia'],
  ['Reembolso', 'Reintegro'],
  ['Carteirinha', 'Credencial'],
  ['RG (identidade)', 'DNI'],
]

function Fontes({ itens }: { itens: { texto: string; url: string }[] }) {
  return (
    <p className="text-xs text-gray-400 mt-3 leading-relaxed">
      Fontes:{' '}
      {itens.map((f, i) => (
        <span key={f.url}>
          {i > 0 && ' · '}
          <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">{f.texto}</a>
        </span>
      ))}
    </p>
  )
}

export default function PlanoDeSaudeArgentinaPage() {
  return (
    <div lang="pt-BR">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />

      {/* Hero: resposta direta no primeiro parágrafo (GEO) */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-12">
        <div className="container max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
            Guia em português · Atualizado em {PRECIO_ACTUALIZADO_PT}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Plano de saúde na Argentina: guia para brasileiros
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            Na Argentina, o plano de saúde se chama <em>prepaga</em> (medicina prepaga). Brasileiros pagam o mesmo que um
            argentino da mesma idade: <strong className="text-gray-900">a partir de {pesosPt(A30.min.precio)}<UsdAprox ars={A30.min.precio} /> por mês</strong> para
            uma pessoa de 30 anos, pela tabela oficial de {PRECIO_ACTUALIZADO_PT}. A Swiss Medical aceita a filiação com
            passaporte ou com a residência precária, e nós entregamos o certificado de cobertura para o trâmite de
            residência e do DNI. O atendimento é em português.
          </p>
          <ContratarPlanButtonIntl
            locale="pt"
            fuente="pt-pillar"
            label="Cotar meu plano (grátis, sem DNI) →"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
          />
          <p className="text-xs text-gray-400 mt-3 flex flex-wrap gap-x-3 gap-y-1">
            <span>¿En español? <Link href="/para/extranjeros" className="text-[#E8002D] hover:underline font-medium">Guía en español →</Link></span>
            <span>· Reading in English? <Link href="/en/health-insurance-argentina" className="text-[#E8002D] hover:underline font-medium">English guide →</Link></span>
          </p>
        </div>
      </section>

      {/* 4 coisas para saber */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">4 coisas para saber</h2>
          <div className="space-y-4">
            {[
              { t: 'Na Argentina, plano de saúde é prepaga', d: <>As prepagas são reguladas pela Superintendencia de Servicios de Salud e todas cobrem pelo menos o <Link href="/pmo" className="text-[#E8002D] hover:underline font-medium">PMO</Link> (Programa Médico Obrigatório): consultas, exames, internação, urgências e parto.</> },
              { t: 'Sem DNI: passaporte ou residência precária', d: 'A Swiss Medical aceita a filiação com o passaporte ou com o certificado de residência precária que a Migraciones entrega quando você inicia o trâmite de residência.' },
              { t: 'Certificado de cobertura para a residência e o DNI', d: 'Ao se filiar, nós entregamos o certificado de cobertura da prepaga para você apresentar no trâmite de residência e do DNI.' },
              { t: 'Atendimento em português', d: 'Um assessor que fala português cota o plano, explica a cobertura e acompanha a filiação. Também atendemos em espanhol e inglês.' },
            ].map((item, i) => (
              <div key={item.t} className="flex items-start gap-4 bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <span className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-sm font-bold text-[#E8002D] flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{item.t}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preços oficiais (GEO) */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quanto custa: preços oficiais ({PRECIO_ACTUALIZADO_PT})</h2>
          <TablaPreciosIntl locale="pt" />
        </div>
      </section>

      {/* Estudantes */}
      <section id="estudantes" className="py-10 bg-gray-50 border-t border-gray-100 scroll-mt-20">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Vai estudar na Argentina? O plano de saúde para estudantes</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Enquanto você não tiver residência permanente, o Decreto 366/2025 exige seguro saúde, e nos hospitais públicos
            o atendimento programado é cobrado (a emergência é sempre atendida). A residência temporária de estudante é
            dada pela Dirección Nacional de Migraciones para alunos regulares de instituições reconhecidas, por um ano
            prorrogável, e o trâmite começa on-line, pelo sistema RaDEX.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Para se filiar à Swiss Medical, basta o passaporte ou a residência precária; com a filiação, entregamos o
            certificado de cobertura para o trâmite do DNI. O preço depende da idade, não da nacionalidade:
          </p>
          <TablaEstudianteIntl locale="pt" />
          <p className="text-sm text-gray-700 mt-5 mb-2 font-semibold">Rede da Swiss Medical nas cidades universitárias (em espanhol):</p>
          <p className="text-sm leading-relaxed">
            {CIDADES.map(([nome, zona], i) => (
              <span key={zona}>
                {i > 0 && <span className="text-gray-300"> · </span>}
                <Link href={`/cartillas/swiss-medical/${zona}`} className="text-[#E8002D] hover:underline font-medium">{nome}</Link>
              </span>
            ))}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ContratarPlanButtonIntl
              locale="pt"
              fuente="pt-estudantes"
              label="Cotar meu plano de estudante →"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-xl transition-all shadow-md text-sm"
            />
            <Link href="/para/estudiantes-extranjeros" className="text-sm font-semibold text-gray-600 hover:text-[#E8002D] hover:underline">
              Em espanhol: prepaga para estudiantes extranjeros →
            </Link>
          </div>
          <Fontes itens={FONTES_DECRETO} />
        </div>
      </section>

      {/* Brasil x Argentina */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Brasil x Argentina: o que muda no plano de saúde</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            A lógica é a mesma do Brasil: uma mensalidade conforme a idade e o plano, e uma rede de médicos e hospitais.
            A maior diferença está na carência:
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-[13px] sm:text-sm">
              <caption className="sr-only">Comparação entre o plano de saúde no Brasil e a prepaga na Argentina</caption>
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-2 sm:px-3 py-2.5 font-semibold"><span className="sr-only">Tema</span></th>
                  <th className="px-2 sm:px-3 py-2.5 font-semibold">No Brasil</th>
                  <th className="px-2 sm:px-3 py-2.5 font-semibold">Na Argentina</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 align-top">
                {COMPARACAO.map(([tema, br, ar]) => (
                  <tr key={tema}>
                    <th scope="row" className="px-2 sm:px-3 py-2.5 text-left font-semibold text-gray-900">{tema}</th>
                    <td className="px-2 sm:px-3 py-2.5 text-gray-700">{br}</td>
                    <td className="px-2 sm:px-3 py-2.5 text-gray-700">{ar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Fontes itens={[
            { texto: 'IDEC: carências dos planos de saúde', url: 'https://idec.org.br/node/19435' },
            { texto: 'ANS', url: 'https://www.gov.br/ans/pt-br/assuntos/consumidor/prazos-maximos-de-atendimento' },
            { texto: 'Lei 26.682, Infoleg', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/180000-184999/182180/texact.htm' },
          ]} />

          <h3 className="text-base font-bold text-gray-900 mt-8 mb-3">Como se diz na Argentina</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200 max-w-md">
            <table className="w-full text-sm">
              <caption className="sr-only">Termos do plano de saúde no Brasil e na Argentina</caption>
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-3 py-2 font-semibold">No Brasil</th>
                  <th className="px-3 py-2 font-semibold">Na Argentina</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {GLOSSARIO.map(([br, ar]) => (
                  <tr key={br}>
                    <td className="px-3 py-2 text-gray-700">{br}</td>
                    <td className="px-3 py-2 font-semibold text-gray-900">{ar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Turistas */}
      <section id="turistas" className="py-10 bg-gray-50 border-t border-gray-100 scroll-mt-20">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Vai só viajar? O seguro saúde para entrar na Argentina</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            O Decreto 366/2025, publicado no Boletim Oficial em 29 de maio de 2025, exige seguro saúde dos estrangeiros
            que entram na Argentina sem residência permanente. Nos hospitais públicos, o atendimento programado de quem
            não tem residência permanente é cobrado; a emergência é sempre atendida.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Para uma viagem curta, o habitual é um seguro viagem (assistência ao viajante), que nós não vendemos. Se você vai
            ficar meses ou anos, para estudar, trabalhar ou morar, a prepaga é a cobertura completa: médicos, exames,
            pronto-socorro e internação da rede todos os meses, sem limite por evento. <Link href="/en/mandatory-insurance-decree-366" className="text-[#E8002D] hover:underline font-medium">Detalhes do decreto (em inglês) →</Link>
          </p>
          <Fontes itens={FONTES_DECRETO.slice(0, 2)} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Perguntas frequentes</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-gray-900 select-none list-none">
                  <h3 className="font-semibold text-sm text-gray-900 m-0">{q}</h3>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#E8002D] text-white">
        <div className="container max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Cote seu plano com um assessor que fala português</h2>
          <p className="text-white text-sm mb-6">
            Grátis e sem compromisso. Para cotar, bastam sua idade e sua cidade; para se filiar à Swiss Medical, o passaporte.
          </p>
          <ContratarPlanButtonIntl
            locale="pt"
            fuente="pt-pillar-cta"
            label="Quero minha cotação →"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8002D] font-bold rounded-2xl hover:bg-red-50 transition-all shadow-lg text-sm"
          />
        </div>
      </section>
    </div>
  )
}
