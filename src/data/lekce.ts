import { LEKCE_Z_OBSAHU } from '../content/obsah'
import { pocet } from '../lib/typo'
import { KATALOG, type Lekce } from './katalog'

/** Lekce napsané v kódu a lekce z markdownu (obsah/otazky). */
export const VSECHNY_LEKCE: Lekce[] = [
  ...KATALOG,
  ...LEKCE_Z_OBSAHU.map(
    (l): Lekce => ({
      id: l.id,
      nazev: l.nazev,
      popis: l.popis,
      predmet: l.predmet,
      meta: pocet(l.otazky.length, ['otázka', 'otázky', 'otázek']),
    }),
  ),
]

export const lekcePodleId = (id: string): Lekce | undefined => VSECHNY_LEKCE.find((l) => l.id === id)
