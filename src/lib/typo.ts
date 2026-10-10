const NBSP = ' '

/**
 * Česká typografie pro texty z obsahu:
 * - nezlomitelná mezera po jednopísmenných předložkách a spojkách (v, s, k, z, o, u, a, i),
 * - nezlomitelná mezera mezi číslem a jednotkou (4 věty, 35 Kč),
 * - „uvozovky“, pomlčka – s mezerami, násobení ×, rozsah 1–10.
 */
export function cz(text: string): string {
  let t = text

  // přímé uvozovky -> české
  t = t.replace(/"([^"]+)"/g, '„$1“')

  // spojovník s mezerami -> pomlčka
  t = t.replace(/ [-–—] /g, ' – ')

  // násobení: číslo x číslo
  t = t.replace(/(\d)\s*[x*]\s*(\d)/g, '$1 × $2')

  // rozsah čísel bez mezer
  t = t.replace(/(\d)[-–](\d)/g, '$1–$2')

  // jednopísmenné předložky a spojky (i velké); dvakrát kvůli řetězení „v a v“
  const jednopismenne = /(^|[\s(„“])([vVsSkKzZoOuUaAiI]) +(?=\S)/g
  t = t.replace(jednopismenne, `$1$2${NBSP}`).replace(jednopismenne, `$1$2${NBSP}`)

  // číslo + jednotka / slovo
  t = t.replace(/(\d) +(?=[A-Za-zÀ-žÁ-ž%°])/g, `$1${NBSP}`)

  return t
}

/** Skloňování po číslovkách: plural(3, ['hvězda', 'hvězdy', 'hvězd']) -> „hvězdy“. */
export function plural(n: number, [jedna, dve, pet]: [string, string, string]): string {
  const abs = Math.abs(n)
  if (abs === 1) return jedna
  if (abs >= 2 && abs <= 4) return dve
  return pet
}

/** Číslo + správný tvar slova s nezlomitelnou mezerou: pocet(3, [...]) -> „3 hvězdy“. */
export function pocet(n: number, tvary: [string, string, string]): string {
  return `${n}${NBSP}${plural(n, tvary)}`
}
