interface Props {
  className?: string
  texto?: string
  dark?: boolean
}

export function TrustBadge({ className = '', texto = 'Conexión segura SSL · Datos protegidos', dark = false }: Props) {
  return (
    <div
      className={`flex items-center justify-center gap-1.5 text-[11px] rounded-lg py-2 px-3 ${
        dark ? 'text-gray-400 bg-white/[0.04] border border-white/[0.08]' : 'text-gray-500 bg-gray-50 border border-gray-100'
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-3.5 h-3.5 shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
      <span>{texto}</span>
    </div>
  )
}
