import { useMemo, useState, type FC } from 'react'
import { michej } from '../../lib/michej'
import { cz } from '../../lib/typo'
import { OdpovedTlacitko } from '../OdpovedTlacitko'
import type { PolozkaOvladani } from '../typy'

interface VyberProps extends PolozkaOvladani {
  moznosti: string[]
  spravna: string
  /** Vysvětlení po odpovědi. */
  vysvetleni: string
  poznamka?: string
  /** Další odpovědi, které se také berou jako správné (spornější otázky). */
  dalsiSpravne?: string[]
  /** Nadpis při chybě; výchozí „Správně je …“. */
  nadpisSpatne?: (spravna: string) => string
}

/** Výběr jedné správné odpovědi z několika. Možnosti se pokaždé zamíchají. */
export const Vyber: FC<VyberProps> = ({ moznosti, spravna, vysvetleni, poznamka, dalsiSpravne = [], nadpisSpatne, odpovez, odpovezeno }) => {
  const [zvoleno, setZvoleno] = useState<string | null>(null)
  const zamichane = useMemo(() => michej(moznosti), [moznosti])

  const vyber = (m: string) => {
    if (odpovezeno) return
    setZvoleno(m)
    const ok = m === spravna || dalsiSpravne.includes(m)
    odpovez({
      spravne: ok,
      nadpis: ok ? 'Správně' : (nadpisSpatne?.(spravna) ?? `Správně je ${spravna}`),
      text: vysvetleni,
      poznamka,
    })
  }

  return (
    <div className="flex flex-col gap-2.5">
      {zamichane.map((m) => (
        <OdpovedTlacitko
          key={m}
          textClass="text-[20px]"
          disabled={odpovezeno}
          stav={!odpovezeno ? null : m === spravna || (m === zvoleno && dalsiSpravne.includes(m)) ? 'ok' : m === zvoleno ? 'spatne' : null}
          onClick={() => vyber(m)}
        >
          {cz(m)}
        </OdpovedTlacitko>
      ))}
    </div>
  )
}
