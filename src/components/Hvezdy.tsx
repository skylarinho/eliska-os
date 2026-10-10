import type { FC } from 'react'

const CESTA = 'M12 2.8l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.6l-5.6 3.2 1.3-6.2L3 9.3l6.3-.7z'

interface HvezdaProps {
  plna: boolean
  className?: string
}

/** Jedna hvězda; plná je zvýrazňovačově žlutá, prázdná je bílá. */
export const Hvezda: FC<HvezdaProps> = ({ plna, className = '' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d={CESTA}
      fill={plna ? 'var(--zvyraznovac)' : 'var(--papir)'}
      stroke="var(--inkoust)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
)

interface HvezdyProps {
  /** Počet hvězd 0–3. */
  pocet: number
  className?: string
  hvezdaClassName?: string
}

export const Hvezdy: FC<HvezdyProps> = ({ pocet, className = '', hvezdaClassName = 'h-[18px] w-[18px]' }) => (
  <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${pocet} ze 3 hvězd`}>
    {[0, 1, 2].map((k) => (
      <Hvezda key={k} plna={k < pocet} className={hvezdaClassName} />
    ))}
  </span>
)
