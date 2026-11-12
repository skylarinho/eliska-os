interface LekceVPredmetu {
  id: string
  predmet: string
}

/**
 * Lekce, která se nabídne po dokončení: další ve stejném předmětu (v pořadí seznamu, dokola),
 * přednostně taková, kde ještě nejsou 3 hvězdy. Když předmět jinou lekci nemá, vrátí null.
 */
export function dalsiLekceVPredmetu<T extends LekceVPredmetu>(
  lekce: readonly T[],
  aktualniId: string,
  hvezdy: Record<string, number>,
): T | null {
  const aktualni = lekce.find((l) => l.id === aktualniId)
  if (!aktualni) return null
  const vPredmetu = lekce.filter((l) => l.predmet === aktualni.predmet)
  const i = vPredmetu.findIndex((l) => l.id === aktualniId)
  const poradi = [...vPredmetu.slice(i + 1), ...vPredmetu.slice(0, i)]
  return poradi.find((l) => (hvezdy[l.id] ?? 0) < 3) ?? poradi[0] ?? null
}
