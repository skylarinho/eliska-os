import type { FC } from 'react'

interface DopsanoProps {
  /** Co dítě zvolilo; undefined = ještě nic. */
  zvoleno?: string
  /** Správná odpověď. */
  spravne: string
}

/**
 * Mezera v úloze, kterou dítě „dopíše perem“ (Caveat).
 * Správně: zeleně. Špatně: zvolené písmeno červeně přeškrtnuté a vedle něj správné.
 */
export const Dopsano: FC<DopsanoProps> = ({ zvoleno, spravne }) => {
  const stav = zvoleno === undefined ? 'ceka' : zvoleno === spravne ? 'ok' : 'spatne'
  const barva =
    stav === 'ok' ? 'border-spravne text-spravne' : stav === 'spatne' ? 'border-oprava text-oprava' : 'border-inkoust text-inkoust'

  return (
    <span
      className={`inline-block min-w-[0.95em] border-b-[3px] text-center font-ruka text-[1.35em] leading-[0.9] font-bold ${barva}`}
    >
      {stav === 'ceka' && (
        <>
          {' '}
          <span className="sr-only">prázdné místo</span>
        </>
      )}
      {stav === 'ok' && zvoleno}
      {stav === 'spatne' && (
        <>
          <s className="mr-[0.1em] opacity-70">{zvoleno}</s>
          {spravne}
        </>
      )}
    </span>
  )
}
