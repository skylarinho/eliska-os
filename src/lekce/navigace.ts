import { createContext, useContext } from 'react'
import type { Lekce } from '../data/katalog'

/** Co nabídnout na výsledku lekce. Dodává App, čte Vysledek. */
export interface NavigaceLekce {
  /** Další lekce ve stejném předmětu, nebo null. */
  dalsi: Lekce | null
  onDalsi: () => void
  onJinyPredmet: () => void
}

export const NavigaceLekceContext = createContext<NavigaceLekce | null>(null)

export const useNavigaceLekce = () => useContext(NavigaceLekceContext)
