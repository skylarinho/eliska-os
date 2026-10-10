export interface Plan {
  od: string
  do: string
  lekce: string[]
  poznamka?: string
}

export interface LekceVKatalogu {
  id: string
}

export interface StavLekci {
  /** Nejlepší výsledek lekce, 0 = ještě nedokončena. */
  hvezdy: Record<string, number>
  /** Datum posledního dokončení lekce (RRRR-MM-DD). */
  dokonceno: Record<string, string>
}

export type DnesniUkol =
  /** Další lekce z plánu. */
  | { typ: 'ukol'; lekceId: string; hotovo: number; celkem: number }
  /** Dnešní lekce z plánu už je hotová, další se nabídne zítra (jde ji začít i hned). */
  | { typ: 'na-dnes-hotovo'; dalsiId: string; hotovo: number; celkem: number }
  /** Celý plán je splněný, navrhujeme lekci s nejméně hvězdami. */
  | { typ: 'plan-splnen'; navrhId: string | null; hotovo: number; celkem: number }
  /** Bez plánu nebo mimo jeho dobu: lekce s nejméně hvězdami. */
  | { typ: 'volna'; navrhId: string | null }

/** Lekce s nejméně hvězdami; při shodě ta první v katalogu. */
export function nejmeneHvezd(katalog: LekceVKatalogu[], hvezdy: Record<string, number>): string | null {
  let nejlepsi: string | null = null
  let min = Infinity
  for (const { id } of katalog) {
    const h = hvezdy[id] ?? 0
    if (h < min) {
      min = h
      nejlepsi = id
    }
  }
  return nejlepsi
}

export function vyberDnesniUkol(
  plan: Plan | null | undefined,
  stav: StavLekci,
  katalog: LekceVKatalogu[],
  dnes: string,
): DnesniUkol {
  const volna = (): DnesniUkol => ({ typ: 'volna', navrhId: nejmeneHvezd(katalog, stav.hvezdy) })

  if (!plan || dnes < plan.od || dnes > plan.do) return volna()

  const znama = new Set(katalog.map((l) => l.id))
  const lekce = plan.lekce.filter((id) => znama.has(id))
  if (lekce.length === 0) return volna()

  const hotovaOdZacatku = (id: string) => (stav.dokonceno[id] ?? '') >= plan.od
  const nehotove = lekce.filter((id) => !hotovaOdZacatku(id))
  const celkem = lekce.length
  const hotovo = celkem - nehotove.length

  if (nehotove.length === 0) {
    return { typ: 'plan-splnen', navrhId: nejmeneHvezd(katalog, stav.hvezdy), hotovo, celkem }
  }

  const dnesDokoncena = lekce.some((id) => stav.dokonceno[id] === dnes)
  if (dnesDokoncena) {
    return { typ: 'na-dnes-hotovo', dalsiId: nehotove[0], hotovo, celkem }
  }

  return { typ: 'ukol', lekceId: nehotove[0], hotovo, celkem }
}
