import { useMemo, useState, type FC, type FormEvent } from 'react'
import { Button } from '@/components/arc/button/button'
import { VYJMENOVANA_SLOVA, jeSpravne, rozdelZvratne, type VyjmenovaneSlovo } from '../../data/vyjmenovanaSlova'
import { michej } from '../../lib/michej'
import { cz, pocet } from '../../lib/typo'
import { Dopsano } from '../Dopsano'
import { Lekce } from '../Lekce'
import { VYJMENOVANA_PSANI } from '../skupiny'
import type { PolozkaOvladani } from '../typy'

/** Kolik slov se v jedné lekci napíše. */
const SLOV_V_LEKCI = 6

/** Které y/ý ve slově rozhoduje: „píšeme tvrdé y“. */
function tvrde(slovo: string): string {
  return slovo.match(/[yý]/)?.[0] ?? 'y'
}

/** Vzor slova: první písmeno a pak čárka za každé další písmeno („b _ _ _ _ _“). */
const Vzor: FC<{ zaklad: string; zvratne?: string }> = ({ zaklad, zvratne }) => {
  const [prvni, ...zbytek] = [...zaklad]
  return (
    <p className="mb-6 flex flex-wrap items-end gap-x-[0.18em] text-[28px] leading-none font-medium" aria-hidden="true">
      <span className="inline-block w-[0.75em] text-center">{prvni}</span>
      {zbytek.map((_, i) => (
        <span key={i} className="inline-block h-[1em] w-[0.75em] border-b-[3px] border-inkoust-3" />
      ))}
      {zvratne && <span className="ml-[0.4em]">{zvratne}</span>}
    </p>
  )
}

const Uloha: FC<{ polozka: VyjmenovaneSlovo } & PolozkaOvladani> = ({ polozka, odpovez, odpovezeno }) => {
  const [text, setText] = useState('')
  const [vysledek, setVysledek] = useState<{ zapsano: string; spravne: boolean } | null>(null)
  const { zaklad, zvratne } = rozdelZvratne(polozka.slovo)
  const pismen = [...zaklad].length

  const zkontroluj = (e: FormEvent) => {
    e.preventDefault()
    if (odpovezeno || !text.trim()) return
    const spravne = jeSpravne(text, polozka)
    const zapsano = text.trim().replace(/\s+/g, ' ')
    setVysledek({ zapsano, spravne })
    const y = tvrde(polozka.slovo)
    odpovez({
      spravne,
      nadpis: spravne ? 'Správně' : `Správně je ${polozka.slovo}`,
      text: `${polozka.slovo[0].toLocaleUpperCase('cs')}${polozka.slovo.slice(1)} je vyjmenované slovo po ${polozka.skupina}, píšeme tvrdé ${y}.`,
      poznamka: spravne ? undefined : `Tvoje odpověď: ${zapsano}`,
    })
  }

  return (
    <form onSubmit={zkontroluj} noValidate>
      <p className="mb-5 text-[24px] leading-[1.4] font-medium text-pretty">{cz(polozka.napoveda)}</p>
      <Vzor zaklad={zaklad} zvratne={zvratne} />
      <p className="sr-only">{cz(`Slovo začíná na ${zaklad[0]} a má ${pocet(pismen, ['písmeno', 'písmena', 'písmen'])}.`)}</p>

      {vysledek ? (
        <p className="mb-6 min-h-[64px] text-[28px] leading-[1.6]">
          <Dopsano zvoleno={vysledek.spravne ? polozka.slovo : vysledek.zapsano} spravne={polozka.slovo} />
        </p>
      ) : (
        <label className="mb-6 block">
          <span className="sr-only">Napiš celé slovo</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={odpovezeno}
            autoFocus
            lang="cs"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="done"
            placeholder="Napiš slovo"
            className="h-16 w-full rounded-m border-2 border-b-[5px] border-inkoust-3 bg-papir px-4 text-[28px] font-medium text-inkoust placeholder:text-[20px] placeholder:font-normal placeholder:text-inkoust-3"
          />
        </label>
      )}

      <Button type="submit" size="lg" className="w-full !text-[18px]" disabled={odpovezeno || !text.trim()}>
        Zkontrolovat
      </Button>
    </form>
  )
}

interface NapisSlovoProps {
  lekceId: string
  onZavrit: () => void
}

/** Lekce „Napiš celé vyjmenované slovo“: podle významu a prvního písmene napsat celé slovo. */
export const NapisSlovo: FC<NapisSlovoProps> = ({ lekceId, onZavrit }) => {
  const skupiny = VYJMENOVANA_PSANI[lekceId]
  const slova = useMemo(
    () => michej(VYJMENOVANA_SLOVA.filter((s) => skupiny?.includes(s.skupina))).slice(0, SLOV_V_LEKCI),
    [skupiny],
  )

  return (
    <Lekce id={lekceId} zadani="Napiš celé vyjmenované slovo" polozky={slova} onZavrit={onZavrit}>
      {(s, ovladani) => <Uloha polozka={s} {...ovladani} />}
    </Lekce>
  )
}
