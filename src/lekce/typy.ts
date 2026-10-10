/** Výsledek jedné odpovědi, který úloha předá kostře lekce. */
export interface Odpoved {
  spravne: boolean
  /** Nadpis zpětné vazby; výchozí je „Správně“. U chyby ho dodá úloha („Správně je y“). */
  nadpis: string
  /** Vysvětlení. */
  text: string
  /** Doplňující řádek pod vysvětlením, např. „Kořen: bylina“. */
  poznamka?: string
}

export interface PolozkaOvladani {
  /** Úloha zavolá po odpovědi dítěte; kostra otevře zpětnou vazbu. */
  odpovez: (odpoved: Odpoved) => void
  /** Je už na tuto položku odpovězeno (zamknout odpovědi). */
  odpovezeno: boolean
}
