import { useCallback, useEffect, useState } from 'react'
import type { Predmet } from '../data/katalog'

/** Kde v appce jsme: přehled s dlaždicemi, seznam lekcí předmětu, nebo lekce. */
export type Trasa = { typ: 'domu' } | { typ: 'predmet'; predmet: Predmet } | { typ: 'lekce'; id: string }

const PREDMETY: readonly string[] = ['cestina', 'matematika', 'anglictina', 'vlastiveda', 'prirodoveda', 'informatika']

/** `#/predmet/cestina` → trasa. Neznámý tvar vede na přehled. */
export function zHashe(hash: string): Trasa {
  const [typ, hodnota] = hash.replace(/^#\/?/, '').split('/')
  if (typ === 'predmet' && hodnota && PREDMETY.includes(hodnota)) return { typ: 'predmet', predmet: hodnota as Predmet }
  if (typ === 'lekce' && hodnota) return { typ: 'lekce', id: decodeURIComponent(hodnota) }
  return { typ: 'domu' }
}

export function naHash(t: Trasa): string {
  if (t.typ === 'predmet') return `#/predmet/${t.predmet}`
  if (t.typ === 'lekce') return `#/lekce/${encodeURIComponent(t.id)}`
  return '#/'
}

/** Kolik kroků zpět (v historii prohlížeče) je přehled. Ukládáme do history.state. */
interface StavHistorie {
  hloubka: number
}

const hloubka = (): number => (window.history.state as StavHistorie | null)?.hloubka ?? 0

/**
 * Jednoduchá navigace přes historii prohlížeče: tlačítko či gesto Zpět na mobilu
 * vrací o krok v appce, místo aby ji zavřelo.
 */
export function useTrasa() {
  const [trasa, setTrasa] = useState<Trasa>(() => zHashe(window.location.hash))

  useEffect(() => {
    const zmena = () => setTrasa(zHashe(window.location.hash))
    window.addEventListener('popstate', zmena)
    return () => window.removeEventListener('popstate', zmena)
  }, [])

  /** Přejde dál; `nahradit` přepíše aktuální krok (z lekce rovnou do další lekce). */
  const jdi = useCallback((t: Trasa, { nahradit = false } = {}) => {
    const h = hloubka()
    if (nahradit) window.history.replaceState({ hloubka: h } satisfies StavHistorie, '', naHash(t))
    else window.history.pushState({ hloubka: h + 1 } satisfies StavHistorie, '', naHash(t))
    setTrasa(t)
  }, [])

  /** O krok zpět; když v historii appky nic není (např. po obnovení stránky), přejde na `nahradni`. */
  const zpet = useCallback(
    (nahradni: Trasa) => {
      if (hloubka() > 0) window.history.back()
      else jdi(nahradni, { nahradit: true })
    },
    [jdi],
  )

  /** Rovnou na přehled, bez hromadění historie. */
  const domu = useCallback(() => {
    const h = hloubka()
    if (h > 0) window.history.go(-h)
    else jdi({ typ: 'domu' }, { nahradit: true })
  }, [jdi])

  return { trasa, jdi, zpet, domu }
}
