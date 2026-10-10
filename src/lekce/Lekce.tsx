import { useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Progress } from '@/components/arc/progress/progress'
import { cz } from '../lib/typo'
import { useProfileStore } from '../store/useProfileStore'
import { Vysledek } from './Vysledek'
import { ZpetnaVazba } from './ZpetnaVazba'
import type { Odpoved, PolozkaOvladani } from './typy'

interface LekceProps<T> {
  /** Id lekce v katalogu; pod ním se ukládají hvězdy. */
  id: string
  /** Zadání nad úlohou („Doplň i, í, y, nebo ý“). */
  zadani: string
  polozky: T[]
  onZavrit: () => void
  /** Úloha pro jednu položku. Po odpovědi zavolá `ovladani.odpovez`. */
  children: (polozka: T, ovladani: PolozkaOvladani) => ReactNode
}

/**
 * Společná kostra lekce: zavřít, postup, zadání, úloha, zpětná vazba v bottom sheetu a výsledek.
 * Na obrazovce je vždy jen jeden úkol.
 */
export function Lekce<T>({ id, zadani, polozky, onZavrit, children }: LekceProps<T>) {
  const dokonciLekci = useProfileStore((s) => s.dokonciLekci)
  const [pokus, setPokus] = useState(0)
  const [index, setIndex] = useState(0)
  const [chyby, setChyby] = useState(0)
  const [odpoved, setOdpoved] = useState<Odpoved | null>(null)
  const [hvezdy, setHvezdy] = useState<number | null>(null)

  const celkem = polozky.length
  const posledni = index === celkem - 1

  const odpovez = (o: Odpoved) => {
    if (odpoved) return
    if (!o.spravne) setChyby((c) => c + 1)
    setOdpoved(o)
  }

  const dalsi = () => {
    if (!odpoved) return
    setOdpoved(null)
    if (!posledni) {
      setIndex((i) => i + 1)
      return
    }
    setHvezdy(dokonciLekci(id, chyby))
  }

  const znovu = () => {
    setPokus((p) => p + 1)
    setIndex(0)
    setChyby(0)
    setOdpoved(null)
    setHvezdy(null)
  }

  if (hvezdy !== null) {
    return (
      <div className="pr-5 pb-20 min-[700px]:pr-12">
        <Vysledek
          spravne={celkem - Math.min(chyby, celkem)}
          celkem={celkem}
          hvezdy={hvezdy}
          onDomu={onZavrit}
          onZnovu={znovu}
        />
      </div>
    )
  }

  return (
    <div className="pr-5 pt-12 pb-20 min-[700px]:pr-12 min-[700px]:pt-10">
      <div className="mb-9 flex items-center gap-3.5">
        <button
          type="button"
          onClick={onZavrit}
          aria-label="Ukončit lekci"
          className="grid h-12 w-12 flex-none place-items-center rounded-full border-2 border-inkoust-3 bg-papir"
        >
          <X className="h-[18px] w-[18px]" strokeWidth={2.6} aria-hidden="true" />
        </button>
        <Progress
          className="flex-1"
          aria-label="Postup v lekci"
          aria-valuetext={`Úloha ${index + 1} z ${celkem}`}
          value={index + (odpoved ? 1 : 0)}
          max={celkem}
        />
      </div>

      <p className="mb-3.5 text-[16px] text-inkoust-2">{cz(zadani)}</p>

      <div key={`${pokus}-${index}`}>{children(polozky[index], { odpovez, odpovezeno: odpoved !== null })}</div>

      <ZpetnaVazba odpoved={odpoved} tlacitko={posledni ? 'Dokončit' : 'Další'} onDalsi={dalsi} />
    </div>
  )
}
