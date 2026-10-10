/** Tvar lekce, který z markdownu vytvoří scripts/obsah.ts (src/content/generated/*.json). */

export type PredmetId = 'cestina' | 'matematika' | 'anglictina' | 'vlastiveda' | 'informatika'

export interface OtazkaZaklad {
  /** Text otázky (nadpis `## …`). */
  otazka: string
  /** Vysvětlení po odpovědi. */
  vysvetleni: string
  napoveda?: string
  chytak?: boolean
}

export interface OtazkaVyber extends OtazkaZaklad {
  typ: 'vyber'
  moznosti: string[]
  spravna: string
}

export interface OtazkaVice extends OtazkaZaklad {
  typ: 'vice'
  moznosti: string[]
  spravne: string[]
}

export interface OtazkaAnoNe extends OtazkaZaklad {
  typ: 'ano-ne'
  tvrzeni: { text: string; ano: boolean }[]
}

export interface OtazkaRazeni extends OtazkaZaklad {
  typ: 'razeni'
  /** Položky ve správném pořadí. */
  polozky: string[]
}

export interface OtazkaPrirazeni extends OtazkaZaklad {
  typ: 'prirazeni'
  spravna: string
  moznosti: string[]
}

export type Otazka = OtazkaVyber | OtazkaVice | OtazkaAnoNe | OtazkaRazeni | OtazkaPrirazeni

export interface ObsahLekce {
  id: string
  nazev: string
  popis: string
  predmet: PredmetId
  otazky: Otazka[]
}
