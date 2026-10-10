/** Dnešní datum v místním čase jako RRRR-MM-DD (ne UTC, ať se den nepřehodí kolem půlnoci). */
export function dnesISO(d: Date = new Date()): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/** Rozdíl ve dnech mezi dvěma daty RRRR-MM-DD (b − a). */
export function rozdilDni(a: string, b: string): number {
  const [ya, ma, da] = a.split('-').map(Number)
  const [yb, mb, db] = b.split('-').map(Number)
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / 86_400_000)
}
