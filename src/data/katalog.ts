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
 * Lekce, které appka právě umí. Po zavedení obsahu z markdownu (krok 6b) se k nim přidají lekce z obsah/otazky.
 */
export const KATALOG: Lekce[] = [
  { id: 'cestina-vyjmenovana-b', nazev: 'Vyjmenovaná slova po B', popis: '4 věty', predmet: 'cestina', meta: '4 věty, asi 3 minuty' },
  { id: 'cestina-vyjmenovana-l-m', nazev: 'Vyjmenovaná slova po L a M', popis: '4 věty', predmet: 'cestina', meta: '4 věty, asi 3 minuty' },
  { id: 'cestina-vyjmenovana-p-s', nazev: 'Vyjmenovaná slova po P a S', popis: '4 věty', predmet: 'cestina', meta: '4 věty, asi 3 minuty' },
  { id: 'cestina-vyjmenovana-v-z', nazev: 'Vyjmenovaná slova po V a Z', popis: '5 vět', predmet: 'cestina', meta: '5 vět, asi 4 minuty' },
  { id: 'matematika-obchudek', nazev: 'Obchůdek', popis: 'Nákup a vracení peněz', predmet: 'matematika', meta: '4 nákupy, asi 8 minut' },
  { id: 'matematika-rozklad', nazev: 'Rozklad na desítky', popis: 'Sčítání do 100', predmet: 'matematika', meta: '4 příklady, asi 4 minuty' },
  { id: 'matematika-nasobilka', nazev: 'Násobilka', popis: 'Vyber správný výsledek', predmet: 'matematika', meta: '8 příkladů, asi 4 minuty' },
  { id: 'anglictina-pozdravy', nazev: 'Slovíčka: pozdravy', popis: 'Hello, thank you a další', predmet: 'anglictina', meta: '4 slovíčka, asi 3 minuty' },
  { id: 'anglictina-zviratka', nazev: 'Slovíčka: zvířátka', popis: 'Pes, kočka, liška', predmet: 'anglictina', meta: '4 slovíčka, asi 3 minuty' },
  { id: 'anglictina-jidlo-skola', nazev: 'Slovíčka: jídlo a škola', popis: 'Jablko, mléko, tužka', predmet: 'anglictina', meta: '6 slovíček, asi 4 minuty' },
  { id: 'anglictina-barvy-cisla', nazev: 'Slovíčka: barvy a čísla', popis: 'Red, green, ten', predmet: 'anglictina', meta: '5 slovíček, asi 4 minuty' },
  { id: 'vlastiveda-casova-osa', nazev: 'Časová osa dějin', popis: 'Seřaď 5 epoch', predmet: 'vlastiveda', meta: 'Seřazení 5 epoch, asi 2 minuty' },
  { id: 'vlastiveda-epochy', nazev: 'Předměty a epochy', popis: 'Kam patří pěstní klín?', predmet: 'vlastiveda', meta: '7 předmětů, asi 5 minut' },
  { id: 'informatika-hardware', nazev: 'Co je na obrázku?', popis: 'Části počítače', predmet: 'informatika', meta: '8 zařízení, asi 5 minut' },
]
