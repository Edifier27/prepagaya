'use client'

import { useState } from 'react'
import { CODIGO_PAIS_INTL, CODIGOS_PAIS_OPCIONES, formatearCelularInternacional } from '@/lib/utils'
import { trackEvent, trackLead } from '@/lib/analytics'
import { TrustBadge } from '@/components/ui/TrustBadge'
import { CampoTrampa, datoTrampa } from '@/components/ui/CampoTrampa'

type Locale = 'us' | 'ru' | 'zh'

interface Props {
  /** País del silo — fija el código de país del teléfono en vez de pedir que el visitante lo elija (pedido de Darío, 22-sep-2026). */
  locale: Locale
  /** Se manda a /api/leads para trackear el origen (ej. "en-pillar", "ru-precios"). */
  fuente: string
  label?: string
  className?: string
}

interface Textos {
  boton: string
  tituloPopup: string
  descripcion: string
  labelNombre: string
  labelCelular: string
  labelEmail: string
  placeholderNombre: string
  placeholderEmail: string
  submit: string
  enviando: string
  exitoTitulo: string
  exitoTexto: string
  seguridad: string
  interesInterno: string // metadata interna en español, para el panel de Darío/Gabriela
  opcional: string
  error: string
  codigoPais: string
}

const TEXTOS: Record<Locale, Textos> = {
  us: {
    boton: 'Get my quote →',
    tituloPopup: 'Get your best-price plan in Argentina',
    descripcion: 'Leave your info and we’ll quote the plan that fits you best, at the best price in Argentina.',
    labelNombre: 'Name',
    labelCelular: 'Phone',
    labelEmail: 'Email',
    placeholderNombre: 'Your name',
    placeholderEmail: 'you@email.com',
    submit: 'Get my quote',
    enviando: 'Sending...',
    exitoTitulo: 'Done!',
    exitoTexto: 'We received your info. An advisor will contact you shortly with your exact quote.',
    seguridad: 'Secure SSL connection · Data protected',
    interesInterno: 'Extranjero (EE.UU.)',
    opcional: 'optional',
    error: 'We couldn’t send it. Please try again.',
    codigoPais: 'Country code',
  },
  ru: {
    boton: 'Получить расчёт →',
    tituloPopup: 'Подберём для вас лучший план в Аргентине',
    descripcion: 'Оставьте свои данные, и мы подберём план с лучшей ценой в Аргентине специально для вас.',
    labelNombre: 'Имя',
    labelCelular: 'Телефон',
    labelEmail: 'Email',
    placeholderNombre: 'Ваше имя',
    placeholderEmail: 'you@email.com',
    submit: 'Получить расчёт',
    enviando: 'Отправка...',
    exitoTitulo: 'Готово!',
    exitoTexto: 'Мы получили ваши данные. Консультант свяжется с вами в ближайшее время с точным расчётом.',
    seguridad: 'Безопасное SSL-соединение · Данные защищены',
    interesInterno: 'Extranjero (Rusia)',
    opcional: 'необязательно',
    error: 'Не удалось отправить. Попробуйте ещё раз.',
    codigoPais: 'Код страны',
  },
  zh: {
    boton: '获取报价 →',
    tituloPopup: '为您匹配阿根廷最优惠的保险计划',
    descripcion: '留下您的信息,我们将为您匹配价格最优的阿根廷医疗保险计划。',
    labelNombre: '姓名',
    labelCelular: '电话',
    labelEmail: '邮箱',
    placeholderNombre: '您的姓名',
    placeholderEmail: 'you@email.com',
    submit: '获取报价',
    enviando: '发送中...',
    exitoTitulo: '完成!',
    exitoTexto: '我们已收到您的信息,顾问会尽快与您联系,提供准确报价。',
    seguridad: 'SSL 安全连接 · 数据受保护',
    interesInterno: 'Extranjero (China)',
    opcional: '可选',
    error: '发送失败,请重试。',
    codigoPais: '国家代码',
  },
}

export function ContratarPlanButtonIntl({ locale, fuente, label, className }: Props) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const t = TEXTOS[locale]
  const codigoPais = CODIGO_PAIS_INTL[locale]
  const [prefijo, setPrefijo] = useState(codigoPais.prefijo)
  // Email opcional (29-oct-2026), como en el formulario en español: con
  // nombre y celular alcanza para que el asesor escriba
  const ok = nombre.trim().length >= 2 && celular.replace(/\D/g, '').length >= 6 && (email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
  const esAR = prefijo === '54'

  function handleClose() {
    setOpen(false)
    setNombre(''); setCelular(''); setEmail(''); setStatus('idle')
  }

  async function handleSubmit() {
    if (!ok) return
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...datoTrampa(),
          nombre: nombre.trim(),
          // +54: celular argentino, sin "pais" para que se normalice con el 9
          celular: esAR ? celular.trim() : formatearCelularInternacional(prefijo, celular),
          email: email.trim() || `${prefijo}${celular.replace(/\D/g, '')}@sin-email.com`,
          fuente,
          prepaga_interes: t.interesInterno,
          ...(esAR ? {} : { pais: `${locale}+${prefijo}` }),
        }),
      })
      // Antes mostraba "listo" aunque la API respondiera error
      if (!res.ok) throw new Error(String(res.status))
      trackLead(fuente)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); trackEvent('abrir_cotizador', { fuente, prepaga: t.interesInterno }) }}
        className={className ?? 'inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E8002D] hover:bg-[#B8001F] text-white font-bold rounded-2xl transition-all shadow-lg text-sm'}
      >
        {label ?? t.boton}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#E8002D] to-[#B8001F] px-6 py-5 text-white">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="text-xl font-bold mb-1">{t.tituloPopup}</div>
              <p className="text-red-100 text-sm leading-relaxed">{t.descripcion}</p>
            </div>

            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-green-500">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-bold text-gray-900 mb-1">{t.exitoTitulo}</p>
                  <p className="text-sm text-gray-500">{t.exitoTexto}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    <CampoTrampa />
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{t.labelNombre} *</label>
                      <input
                        type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                        placeholder={t.placeholderNombre} autoComplete="given-name"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{t.labelCelular} *</label>
                      <div className="flex gap-2">
                        <select value={prefijo} onChange={(e) => setPrefijo(e.target.value)} aria-label={t.codigoPais}
                          className="flex-shrink-0 w-[6.5rem] border-2 border-gray-200 rounded-xl px-2 text-sm font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:border-[#E8002D]">
                          {CODIGOS_PAIS_OPCIONES.map((o) => <option key={o.prefijo} value={o.prefijo}>+{o.prefijo} {o.pais}</option>)}
                        </select>
                        <input
                          type="tel" value={celular} onChange={(e) => setCelular(e.target.value)}
                          placeholder={prefijo === codigoPais.prefijo ? codigoPais.placeholder : esAR ? '11 2345-6789' : ''} autoComplete="tel" inputMode="tel"
                          className="w-full min-w-0 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{t.labelEmail} <span className="font-normal text-gray-400">({t.opcional})</span></label>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.placeholderEmail} autoComplete="email"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8002D] transition-colors"
                      />
                    </div>
                  </div>

                  <TrustBadge texto={t.seguridad} className="mb-3" />
                  {status === 'error' && <p role="alert" className="mb-3 text-center text-sm font-semibold text-[#B8001F]">{t.error}</p>}

                  <button
                    onClick={handleSubmit}
                    disabled={!ok || status === 'loading'}
                    className="w-full py-3.5 bg-[#E8002D] hover:bg-[#B8001F] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors"
                  >
                    {status === 'loading' ? t.enviando : t.submit}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
