import React from 'react'

// ─── Letter-badge design system ───────────────────────────────────────────────
// Each category has a 2-letter abbreviation + color pair.
// The badge is a rounded square with bold text — no SVG icons.

type LetterCfg = {
  letters: string
  bg: string
  text: string
  bgHover: string
}

// ─── Coberturas ───────────────────────────────────────────────────────────────

const coberturaMap: Record<string, LetterCfg> = {
  psicologia:     { letters: 'PS', bg: 'bg-purple-100',  text: 'text-purple-800',  bgHover: 'group-hover:bg-purple-200' },
  'salud-mental': { letters: 'SM', bg: 'bg-purple-100',  text: 'text-purple-800',  bgHover: 'group-hover:bg-purple-200' },
  maternidad:     { letters: 'MA', bg: 'bg-pink-100',    text: 'text-pink-800',    bgHover: 'group-hover:bg-pink-200' },
  odontologia:    { letters: 'OD', bg: 'bg-cyan-100',    text: 'text-cyan-800',    bgHover: 'group-hover:bg-cyan-200' },
  fertilidad:     { letters: 'FE', bg: 'bg-violet-100',  text: 'text-violet-800',  bgHover: 'group-hover:bg-violet-200' },
  oncologia:      { letters: 'ON', bg: 'bg-rose-100',    text: 'text-rose-800',    bgHover: 'group-hover:bg-rose-200' },
  medicamentos:   { letters: 'RX', bg: 'bg-green-100',   text: 'text-green-800',   bgHover: 'group-hover:bg-green-200' },
  internacion:    { letters: 'IN', bg: 'bg-blue-100',    text: 'text-blue-800',    bgHover: 'group-hover:bg-blue-200' },
  urgencias:      { letters: 'UR', bg: 'bg-orange-100',  text: 'text-orange-800',  bgHover: 'group-hover:bg-orange-200' },
  rehabilitacion: { letters: 'RH', bg: 'bg-red-100',    text: 'text-red-800',    bgHover: 'group-hover:bg-red-200' },
  kinesiologia:   { letters: 'KN', bg: 'bg-red-100',    text: 'text-red-800',    bgHover: 'group-hover:bg-red-200' },
  optica:         { letters: 'OP', bg: 'bg-indigo-100',  text: 'text-indigo-800',  bgHover: 'group-hover:bg-indigo-200' },
  oftalmologia:   { letters: 'OF', bg: 'bg-indigo-100',  text: 'text-indigo-800',  bgHover: 'group-hover:bg-indigo-200' },
  cardiologia:    { letters: 'CD', bg: 'bg-red-100',     text: 'text-red-800',     bgHover: 'group-hover:bg-red-200' },
  pediatria:      { letters: 'PD', bg: 'bg-yellow-100',  text: 'text-yellow-800',  bgHover: 'group-hover:bg-yellow-200' },
  nutricion:      { letters: 'NT', bg: 'bg-lime-100',    text: 'text-lime-800',    bgHover: 'group-hover:bg-lime-200' },
}

// ─── Condiciones ──────────────────────────────────────────────────────────────

const condicionMap: Record<string, LetterCfg> = {
  diabetes:            { letters: 'DB', bg: 'bg-red-100',    text: 'text-red-800',    bgHover: 'group-hover:bg-red-200' },
  celiacos:            { letters: 'CE', bg: 'bg-amber-100',  text: 'text-amber-800',  bgHover: 'group-hover:bg-amber-200' },
  'salud-mental':      { letters: 'SM', bg: 'bg-purple-100', text: 'text-purple-800', bgHover: 'group-hover:bg-purple-200' },
  autismo:             { letters: 'AU', bg: 'bg-sky-100',    text: 'text-sky-800',    bgHover: 'group-hover:bg-sky-200' },
  preexistencias:      { letters: 'PX', bg: 'bg-slate-100',  text: 'text-slate-700',  bgHover: 'group-hover:bg-slate-200' },
  hipertension:        { letters: 'HT', bg: 'bg-rose-100',   text: 'text-rose-800',   bgHover: 'group-hover:bg-rose-200' },
  obesidad:            { letters: 'OB', bg: 'bg-orange-100', text: 'text-orange-800', bgHover: 'group-hover:bg-orange-200' },
  'adultos-mayores':   { letters: 'AM', bg: 'bg-red-100',   text: 'text-red-800',   bgHover: 'group-hover:bg-red-200' },
  artritis:            { letters: 'AR', bg: 'bg-indigo-100', text: 'text-indigo-800', bgHover: 'group-hover:bg-indigo-200' },
  'enfermedad-cronica':{ letters: 'EC', bg: 'bg-gray-100',   text: 'text-gray-700',   bgHover: 'group-hover:bg-gray-200' },
}

// ─── Obras Sociales ───────────────────────────────────────────────────────────

const obraSocialMap: Record<string, LetterCfg> = {
  osde:              { letters: 'OS', bg: 'bg-blue-100',    text: 'text-blue-800',    bgHover: 'group-hover:bg-blue-200' },
  'swiss-medical-os':{ letters: 'SW', bg: 'bg-red-100',     text: 'text-red-800',     bgHover: 'group-hover:bg-red-200' },
  pami:              { letters: 'PA', bg: 'bg-red-100',    text: 'text-red-800',    bgHover: 'group-hover:bg-red-200' },
  ioma:              { letters: 'IO', bg: 'bg-green-100',   text: 'text-green-800',   bgHover: 'group-hover:bg-green-200' },
  'sancor-os':       { letters: 'SC', bg: 'bg-emerald-100', text: 'text-emerald-800', bgHover: 'group-hover:bg-emerald-200' },
  galeno:            { letters: 'GA', bg: 'bg-violet-100',  text: 'text-violet-800',  bgHover: 'group-hover:bg-violet-200' },
  medicus:           { letters: 'MC', bg: 'bg-sky-100',     text: 'text-sky-800',     bgHover: 'group-hover:bg-sky-200' },
  medife:            { letters: 'MF', bg: 'bg-indigo-100',  text: 'text-indigo-800',  bgHover: 'group-hover:bg-indigo-200' },
  'accord-salud':    { letters: 'AC', bg: 'bg-cyan-100',    text: 'text-cyan-800',    bgHover: 'group-hover:bg-cyan-200' },
  ospat:             { letters: 'OP', bg: 'bg-amber-100',   text: 'text-amber-800',   bgHover: 'group-hover:bg-amber-200' },
  upcn:              { letters: 'UC', bg: 'bg-slate-100',   text: 'text-slate-700',   bgHover: 'group-hover:bg-slate-200' },
  iosfa:             { letters: 'IF', bg: 'bg-blue-100',    text: 'text-blue-800',    bgHover: 'group-hover:bg-blue-200' },
  osdepym:           { letters: 'OM', bg: 'bg-orange-100',  text: 'text-orange-800',  bgHover: 'group-hover:bg-orange-200' },
  amsalud:           { letters: 'AS', bg: 'bg-rose-100',    text: 'text-rose-800',    bgHover: 'group-hover:bg-rose-200' },
  osseg:             { letters: 'OG', bg: 'bg-gray-100',    text: 'text-gray-700',    bgHover: 'group-hover:bg-gray-200' },
}

const fallback: LetterCfg = { letters: '·', bg: 'bg-gray-100', text: 'text-gray-500', bgHover: 'group-hover:bg-gray-200' }

// ─── Size scale ───────────────────────────────────────────────────────────────

const SIZES: Record<string, { box: string; font: string; radius: string }> = {
  xs: { box: 'w-8  h-8',  font: 'text-[11px] font-black', radius: 'rounded-xl' },
  sm: { box: 'w-10 h-10', font: 'text-xs     font-black', radius: 'rounded-xl' },
  md: { box: 'w-12 h-12', font: 'text-sm     font-black', radius: 'rounded-2xl' },
  lg: { box: 'w-16 h-16', font: 'text-base   font-black', radius: 'rounded-2xl' },
}

// ─── Base badge ───────────────────────────────────────────────────────────────

function LetterBadge({ cfg, size = 'md' }: { cfg: LetterCfg; size?: string }) {
  const s = SIZES[size] ?? SIZES.md
  return (
    <div className={[
      s.box, s.radius, cfg.bg, cfg.text, cfg.bgHover,
      'flex items-center justify-center flex-shrink-0',
      'transition-all duration-200 group-hover:scale-105 group-hover:shadow-sm',
    ].join(' ')}>
      <span className={`${s.font} tracking-tight leading-none select-none`}>
        {cfg.letters}
      </span>
    </div>
  )
}

// ─── Public exports ───────────────────────────────────────────────────────────

export function CoberturaIcon({ slug, size }: { slug: string; size?: string }) {
  return <LetterBadge cfg={coberturaMap[slug] ?? fallback} size={size} />
}

export function CondicionIcon({ slug, size }: { slug: string; size?: string }) {
  return <LetterBadge cfg={condicionMap[slug] ?? fallback} size={size} />
}

export function ObraSocialIcon({ slug, size }: { slug: string; size?: string }) {
  return <LetterBadge cfg={obraSocialMap[slug] ?? fallback} size={size} />
}

// ─── Inline mini badges for Header dropdowns ─────────────────────────────────
// Small square with 2 letters, used inside nav links

type MiniBadgeProps = { letters: string; bg: string; text: string }

function MiniBadge({ letters, bg, text }: MiniBadgeProps) {
  return (
    <span className={[
      'inline-flex items-center justify-center',
      'w-6 h-6 rounded-lg flex-shrink-0',
      bg, text,
      'text-[10px] font-black tracking-tight leading-none select-none',
    ].join(' ')}>
      {letters}
    </span>
  )
}

// Coberturas
export const MiniPsicologia   = () => <MiniBadge letters="PS" bg="bg-purple-100"  text="text-purple-800" />
export const MiniMaternidad   = () => <MiniBadge letters="MA" bg="bg-pink-100"    text="text-pink-800" />
export const MiniOdontologia  = () => <MiniBadge letters="OD" bg="bg-cyan-100"    text="text-cyan-800" />
export const MiniFertilidad   = () => <MiniBadge letters="FE" bg="bg-violet-100"  text="text-violet-800" />
export const MiniOncologia    = () => <MiniBadge letters="ON" bg="bg-rose-100"    text="text-rose-800" />

// Condiciones
export const MiniDiabetes       = () => <MiniBadge letters="DB" bg="bg-red-100"    text="text-red-800" />
export const MiniCeliacos       = () => <MiniBadge letters="CE" bg="bg-amber-100"  text="text-amber-800" />
export const MiniSaludMental    = () => <MiniBadge letters="SM" bg="bg-purple-100" text="text-purple-800" />
export const MiniAutismo        = () => <MiniBadge letters="AU" bg="bg-sky-100"    text="text-sky-800" />
export const MiniPreexistencias = () => <MiniBadge letters="PX" bg="bg-slate-100"  text="text-slate-700" />

// Obras Sociales
export const MiniBuilding = () => <MiniBadge letters="OS" bg="bg-blue-100"    text="text-blue-800" />
export const MiniLeaf     = () => <MiniBadge letters="SC" bg="bg-emerald-100" text="text-emerald-800" />
export const MiniElder    = () => <MiniBadge letters="PA" bg="bg-red-100"    text="text-red-800" />
export const MiniCross    = () => <MiniBadge letters="SW" bg="bg-red-100"     text="text-red-800" />
