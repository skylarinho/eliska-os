import type { Serie } from '../lib/postup'

export interface UlozenyProfil {
  id: string
  name: string
  vokativ: string
  avatar: string
  /** Nejlepší výsledek lekce (0–3). */
  hvezdy: Record<string, number>
  /** Datum posledního dokončení lekce. */
  dokonceno: Record<string, string>
  serie: Serie
}

type Surovy = Record<string, unknown>

/**
 * v0/v1 → v2: XP, úrovně a staré série se zahodí, dříve dokončené lekce dostanou 1 hvězdu,
 * zmizí školní e-mail, doplní se vokativ.
 */
export function migrujProfily(profily: unknown, vokativ: (jmeno: string) => string): UlozenyProfil[] {
  if (!Array.isArray(profily)) return []
  return (profily as Surovy[]).map((p) => {
    const name = typeof p.name === 'string' ? p.name : ''
    const hotove = Array.isArray(p.completedLessons) ? (p.completedLessons as string[]) : []
    const hvezdy: Record<string, number> =
      p.hvezdy && typeof p.hvezdy === 'object' ? { ...(p.hvezdy as Record<string, number>) } : {}
    for (const id of hotove) hvezdy[id] = Math.max(hvezdy[id] ?? 0, 1)

    return {
      id: String(p.id),
      name,
      vokativ: typeof p.vokativ === 'string' && p.vokativ ? p.vokativ : vokativ(name),
      avatar: typeof p.avatar === 'string' ? p.avatar : 'vombat',
      hvezdy,
      dokonceno: p.dokonceno && typeof p.dokonceno === 'object' ? (p.dokonceno as Record<string, string>) : {},
      serie: (p.serie as Serie | undefined) ?? { pocet: 0, posledni: '' },
    }
  })
}
