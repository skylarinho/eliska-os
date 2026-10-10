import type { FC } from 'react'
import vombatKlid from '../assets/vombat.svg'
import vombatRadost from '../assets/vombat-radost.svg'

export type VombatStav = 'klid' | 'radost'

interface VombatProps {
  stav?: VombatStav
  className?: string
}

/** Vombat se používá jen na úvodu (dnešní úkol) a na výsledku lekce. */
export const Vombat: FC<VombatProps> = ({ stav = 'klid', className = '' }) => (
  <img
    src={stav === 'radost' ? vombatRadost : vombatKlid}
    alt={stav === 'radost' ? 'Vombat má radost' : 'Vombat'}
    width={120}
    height={96}
    className={className}
  />
)
