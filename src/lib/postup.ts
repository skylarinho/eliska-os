import { rozdilDni } from './datum'

export type Hvezdy = 0 | 1 | 2 | 3

/** 3 hvězdy = vše správně napoprvé, 2 = nejvýš jedna chyba, 1 = dokončeno. */
export function spocitejHvezdy(chyby: number): Hvezdy {
  if (chyby <= 0) return 3
  if (chyby === 1) return 2
  return 1
}

export interface Serie {
  pocet: number
  /** Datum poslední dokončené lekce (RRRR-MM-DD) nebo prázdný řetězec. */
  posledni: string
}

/** Po dokončené lekci: série se zvýší, jen když předchozí lekce byla včera; v ten samý den zůstává. */
export function zapisDokonceni(serie: Serie, dnes: string): Serie {
  if (serie.posledni === dnes) return serie
  if (serie.posledni && rozdilDni(serie.posledni, dnes) === 1) {
    return { pocet: serie.pocet + 1, posledni: dnes }
  }
  return { pocet: 1, posledni: dnes }
}

/** Série, kterou má dítě zobrazit: když přeskočilo den, je 0 (dokud nedokončí další lekci). */
export function aktualniSerie(serie: Serie, dnes: string): number {
  if (!serie.posledni) return 0
  return rozdilDni(serie.posledni, dnes) <= 1 ? serie.pocet : 0
}
