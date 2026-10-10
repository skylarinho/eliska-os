import type { ObsahLekce } from './typy'

/**
 * Lekce z obsah/otazky/*.md, které při buildu převedl scripts/obsah.ts do generated/*.json.
 * Když ještě nic nevzniklo, je seznam prázdný.
 */
const moduly = import.meta.glob<ObsahLekce>('./generated/*.json', { eager: true, import: 'default' })

export const LEKCE_Z_OBSAHU: ObsahLekce[] = Object.values(moduly)

export const obsahPodleId = (id: string): ObsahLekce | undefined => LEKCE_Z_OBSAHU.find((l) => l.id === id)
