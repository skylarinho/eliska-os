import { useId, type FC, type KeyboardEvent } from 'react'
import type { CastHouby } from './houba'

export type StavCasti = 'srafa' | 'ok' | 'spatne'

interface KresbaHoubyProps {
  /** Jak vyznačit jednotlivé části; nevyznačené jsou obyčejně vybarvené. */
  stav?: Partial<Record<CastHouby, StavCasti>>
  /** Když je zadané, dají se části ťuknout (a vybrat klávesnicí). */
  onTukni?: (cast: CastHouby) => void
  /** Popis kresby pro čtečku, když se na ni neťuká. */
  popis?: string
}

const INKOUST = 'var(--inkoust)'

/** Popisky podle polohy, ať čtečka neprozradí název části. */
const POLOHA: Record<CastHouby, string> = {
  klobouk: 'Část nahoře',
  rourky: 'Část pod kloboukem',
  tren: 'Část mezi kloboukem a zemí',
  podhoubi: 'Část v zemi',
}

const TVARY: Record<CastHouby, string[]> = {
  klobouk: [
    'M66 110C58 48 118 20 160 20C202 20 262 48 254 110Q160 98 66 110Z',
    'M236 178C234 156 250 146 268 146C286 146 302 156 300 178Q268 172 236 178Z',
  ],
  rourky: ['M66 110Q160 98 254 110C252 126 236 136 212 140Q160 146 108 140C84 136 68 126 66 110Z'],
  tren: [
    'M126 141C122 162 110 182 114 202Q160 212 206 202C210 182 198 162 194 141Q160 146 126 141Z',
    'M250 177C246 186 244 196 246 203Q268 208 290 203C292 196 290 186 286 177Q268 173 250 177Z',
  ],
  podhoubi: ['M2 200H318V278H2Z'],
}

const VLAKNA = [
  'M130 206C110 220 90 216 70 232S40 250 20 248',
  'M150 208C146 230 128 240 120 262',
  'M170 208C176 232 196 238 204 262',
  'M190 206C214 220 236 214 256 230',
  'M258 206C256 222 242 230 234 246',
  'M280 206C290 222 300 226 314 236',
  'M70 232C66 244 72 254 64 268',
  'M120 262C104 266 92 262 80 272',
  'M204 262C220 268 236 264 248 272',
  'M256 230C268 242 266 256 278 266',
  'M100 222C96 234 104 244 96 256',
]

const SITKA = 'M140 156l8 6M150 170l8 6M170 156l8 6M178 172l8 6M138 184l8 6M160 188l8 6M184 188l6 6'
const TRAVA = 'M30 200l-4-12M34 200l2-14M38 200l6-10M84 200l-3-10M88 200l3-12M226 200l-3-10M230 200l3-12M304 200l-4-12M308 200l3-10'

/** Hřib „modrým perem“: klobouk, rourky, třeň a podhoubí v zemi. */
export const KresbaHouby: FC<KresbaHoubyProps> = ({ stav = {}, onTukni, popis }) => {
  const id = useId().replace(/:/g, '')
  const vzorek = (s: string) => `${id}-${s}`

  const vyplnZakladni: Record<CastHouby, string> = {
    klobouk: 'var(--inkoust-3)',
    rourky: `url(#${vzorek('rourky')})`,
    tren: 'var(--papir)',
    podhoubi: 'var(--linka)',
  }
  const vypln = (c: CastHouby) => {
    const s = stav[c]
    if (s === 'srafa') return `url(#${vzorek('srafa')})`
    if (s === 'ok') return `url(#${vzorek('ok')})`
    if (s === 'spatne') return 'var(--oprava-bg)'
    return vyplnZakladni[c]
  }
  const obrys = (c: CastHouby) => (stav[c] === 'ok' ? 'var(--spravne)' : stav[c] === 'spatne' ? 'var(--oprava)' : INKOUST)

  const klavesa = (c: CastHouby) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onTukni?.(c)
    }
  }

  const cast = (c: CastHouby) => (
    <g
      key={c}
      className={onTukni ? 'houba-cast' : undefined}
      {...(onTukni
        ? { role: 'button', tabIndex: 0, 'aria-label': POLOHA[c], onClick: () => onTukni(c), onKeyDown: klavesa(c) }
        : {})}
    >
      {TVARY[c].map((d) => (
        <path key={d} className="obrys" d={d} fill={vypln(c)} stroke={c === 'podhoubi' ? 'none' : obrys(c)} />
      ))}
    </g>
  )

  return (
    <svg
      viewBox="0 0 320 280"
      className="mx-auto block h-auto w-full max-w-[340px] rounded-m border-2 border-inkoust-3 bg-papir"
      fill="none"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(onTukni ? { role: 'group', 'aria-label': 'Kresba houby, ťukni na část' } : { role: 'img', 'aria-label': popis })}
    >
      <defs>
        <pattern id={vzorek('rourky')} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="var(--papir)" />
          <path d="M3 0V6" stroke="var(--inkoust-3)" strokeWidth="1.5" />
        </pattern>
        <pattern id={vzorek('srafa')} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="var(--papir)" />
          <path d="M0 0V8" stroke={INKOUST} strokeWidth="3" />
        </pattern>
        <pattern id={vzorek('ok')} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="var(--spravne-bg)" />
          <path d="M0 0V8" stroke="var(--spravne)" strokeWidth="3" />
        </pattern>
      </defs>

      {cast('podhoubi')}
      <g pointerEvents="none" stroke={obrys('podhoubi')}>
        <path d="M2 200H318" />
        <g strokeWidth={1.8}>
          {VLAKNA.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <path d={TRAVA} stroke={INKOUST} strokeWidth={2} />
      </g>
      {cast('tren')}
      <path d={SITKA} pointerEvents="none" stroke={INKOUST} strokeWidth={1.5} />
      {cast('rourky')}
      {cast('klobouk')}
    </svg>
  )
}
