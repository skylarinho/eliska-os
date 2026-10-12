import { useState, type FC } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/arc/button/button'
import { Progress } from '@/components/arc/progress/progress'
import type { BlokVykladu, KartaVykladu } from '../content/typy'
import { cz } from '../lib/typo'

interface VykladProps {
  karty: KartaVykladu[]
  onHotovo: () => void
  onZavrit: () => void
}

const Blok: FC<{ blok: BlokVykladu }> = ({ blok }) => {
  if (blok.typ === 'text') return <p className="mb-4 text-[17px] leading-[1.6] text-pretty">{cz(blok.text)}</p>
  if (blok.typ === 'tipy')
    return (
      <ul className="mb-5 flex flex-col gap-2.5">
        {blok.polozky.map((t) => (
          <li key={t} className="border-l-[3px] border-inkoust-3 pl-3.5 text-[17px] leading-[1.55]">
            {cz(t)}
          </li>
        ))}
      </ul>
    )
  return (
    <p className="mb-3 text-[28px] leading-[1.4] font-medium tabular-nums">
      {blok.casti.map((c, i) =>
        c.dopsano ? (
          <span key={i} className="font-ruka text-[1.35em] leading-[0.9] font-bold text-inkoust">
            {cz(c.text)}
          </span>
        ) : (
          <span key={i}>{cz(c.text)}</span>
        ),
      )}
    </p>
  )
}

/** Výklad před otázkami: jedna karta na obrazovku, tlačítka Zpět a Další. */
export const Vyklad: FC<VykladProps> = ({ karty, onHotovo, onZavrit }) => {
  const [index, setIndex] = useState(0)
  const karta = karty[index]
  const posledni = index === karty.length - 1

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
          aria-label="Postup ve výkladu"
          aria-valuetext={`Karta ${index + 1} z ${karty.length}`}
          value={index + 1}
          max={karty.length}
        />
      </div>

      <p className="mb-3.5 text-[16px] text-inkoust-2">Než začneš</p>
      <section key={index} aria-live="polite">
        <h1 className="mb-5 text-[30px] leading-tight font-bold text-balance">{cz(karta.nadpis)}</h1>
        {karta.bloky.map((b, i) => (
          <Blok key={i} blok={b} />
        ))}
      </section>

      <div className="mt-8 flex flex-col gap-2.5">
        <Button size="lg" className="w-full !text-[18px]" onClick={() => (posledni ? onHotovo() : setIndex((i) => i + 1))}>
          {posledni ? 'Jdu procvičovat' : 'Další'}
        </Button>
        {index > 0 && (
          <Button size="lg" variant="secondary" className="w-full !text-[18px]" onClick={() => setIndex((i) => i - 1)}>
            Zpět
          </Button>
        )}
      </div>
    </div>
  )
}
