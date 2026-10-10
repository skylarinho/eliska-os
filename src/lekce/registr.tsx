import type { ReactNode } from 'react'
import { obsahPodleId } from '../content/obsah'
import { LekceZObsahu } from './LekceZObsahu'
import { Vyjmenovana, VYJMENOVANA_SKUPINY } from './cestina/Vyjmenovana'
import { Slovicka, SLOVICKA_OKRUHY } from './anglictina/Slovicka'
import { Hardware } from './informatika/Hardware'
import { Obchudek } from './matematika/Obchudek'
import { CasovaOsa } from './vlastiveda/CasovaOsa'
import { Epochy } from './vlastiveda/Epochy'
import { Nasobilka } from './matematika/Nasobilka'
import { Rozklad } from './matematika/Rozklad'

/** Vrátí lekci v kostře podle id z katalogu, nebo null, když taková lekce není. */
export function vykresliLekci(id: string, onZavrit: () => void): ReactNode | null {
  if (id in VYJMENOVANA_SKUPINY) return <Vyjmenovana lekceId={id} onZavrit={onZavrit} />
  if (id === 'matematika-nasobilka') return <Nasobilka lekceId={id} onZavrit={onZavrit} />
  if (id === 'matematika-rozklad') return <Rozklad lekceId={id} onZavrit={onZavrit} />
  if (id === 'matematika-obchudek') return <Obchudek lekceId={id} onZavrit={onZavrit} />
  if (id in SLOVICKA_OKRUHY) return <Slovicka lekceId={id} onZavrit={onZavrit} />
  if (id === 'vlastiveda-casova-osa') return <CasovaOsa lekceId={id} onZavrit={onZavrit} />
  if (id === 'vlastiveda-epochy') return <Epochy lekceId={id} onZavrit={onZavrit} />
  if (id === 'informatika-hardware') return <Hardware lekceId={id} onZavrit={onZavrit} />
  const zObsahu = obsahPodleId(id)
  if (zObsahu) return <LekceZObsahu lekce={zObsahu} onZavrit={onZavrit} />
  return null
}
