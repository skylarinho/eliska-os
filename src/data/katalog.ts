export type Predmet = 'cestina' | 'matematika' | 'anglictina' | 'vlastiveda' | 'informatika'

export interface Lekce {
  id: string
  nazev: string
  popis: string
  predmet: Predmet
  /** Krátký popis „co to obnáší“ na kartě Dnešní úkol. */
  meta: string
}

export const PREDMETY: { id: Predmet; nazev: string }[] = [
  { id: 'cestina', nazev: 'Čeština' },
  { id: 'matematika', nazev: 'Matematika' },
  { id: 'anglictina', nazev: 'Angličtina' },
  { id: 'vlastiveda', nazev: 'Vlastivěda' },
  { id: 'informatika', nazev: 'Informatika' },
]

/**
 * Lekce, které appka právě umí. Id odpovídají starým obrazovkám;
 * při převodu cvičení (krok 6) se nahradí lekcemi z obsahu.
 */
export const KATALOG: Lekce[] = [
  { id: 'game-czech', nazev: 'Vyjmenovaná slova', popis: 'B, L, M, P, S, V, Z', predmet: 'cestina', meta: 'Doplň i, í, y nebo ý' },
  { id: 'game-shop', nazev: 'Obchůdek', popis: 'Nákup a vracení peněz', predmet: 'matematika', meta: 'Nákupní lístek a mince' },
  { id: 'game-math', nazev: 'Rozklad a násobilka', popis: 'Desítky, jednotky, výsledky', predmet: 'matematika', meta: 'Počítání s čísly' },
  { id: 'game-english', nazev: 'Slovíčka s poslechem', popis: 'Pozdravy, zvířátka, jídlo a další', predmet: 'anglictina', meta: 'Poslech a výběr překladu' },
  { id: 'lesson-timeline', nazev: 'Časová osa dějin', popis: 'Seřaď 5 epoch', predmet: 'vlastiveda', meta: 'Seřazení epoch' },
  { id: 'lesson-artifacts', nazev: 'Předměty a epochy', popis: 'Kam patří pěstní klín?', predmet: 'vlastiveda', meta: 'Přiřazování k epoše' },
  { id: 'lesson-hw', nazev: 'Co je na obrázku?', popis: 'Části počítače', predmet: 'informatika', meta: 'Poznávání částí počítače' },
]

export const lekcePodleId = (id: string): Lekce | undefined => KATALOG.find((l) => l.id === id)
