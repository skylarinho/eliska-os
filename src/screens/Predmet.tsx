import { useEffect, useRef, type FC } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Hvezdy } from '../components/Hvezdy'
import { PREDMETY, type Predmet as PredmetId } from '../data/katalog'
import { VSECHNY_LEKCE } from '../data/lekce'
import { cz, pocet } from '../lib/typo'
import { useProfileStore } from '../store/useProfileStore'

interface PredmetProps {
  predmet: PredmetId
  onStart: (lekceId: string) => void
  onZpet: () => void
}

/** Seznam lekcí jednoho předmětu. */
export const Predmet: FC<PredmetProps> = ({ predmet, onStart, onZpet }) => {
  const hvezdy = useProfileStore((s) => s.getActiveProfile()?.hvezdy) ?? {}
  const nazev = PREDMETY.find((p) => p.id === predmet)?.nazev ?? ''
  const lekce = VSECHNY_LEKCE.filter((l) => l.predmet === predmet)
  const nadpis = useRef<HTMLHeadingElement>(null)

  // Po přechodu sem posadíme fokus na nadpis, ať čtečka i klávesnice začínají tady.
  useEffect(() => nadpis.current?.focus(), [predmet])

  return (
    <div
      className="pr-5 pt-12 pb-20 min-[700px]:pr-12 min-[700px]:pt-10"
      style={{ ['--b' as string]: `var(--${predmet})` }}
    >
      <button
        type="button"
        onClick={onZpet}
        aria-label="Zpět na předměty"
        className="mb-6 grid h-12 w-12 place-items-center rounded-full border-2 border-inkoust-3 bg-papir"
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </button>

      <i className="mb-3 block h-1.5 w-[34px] rounded-[3px] bg-[var(--b)]" aria-hidden="true" />
      <h1 ref={nadpis} tabIndex={-1} className="mb-1 text-[30px] leading-tight font-bold outline-none">
        {nazev}
      </h1>
      <p className="mb-6 text-[15px] text-inkoust-2">{pocet(lekce.length, ['lekce', 'lekce', 'lekcí'])}</p>

      {lekce.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => onStart(l.id)}
          className="mb-2 flex min-h-[60px] w-full items-center gap-3 rounded-s border-2 border-l-[6px] border-inkoust-3 border-l-[var(--b)] bg-papir px-3.5 py-3 text-left active:border-inkoust active:border-l-[var(--b)]"
        >
          <span className="min-w-0 flex-1">
            <b className="block text-[17px] leading-tight font-semibold">{cz(l.nazev)}</b>
            <small className="mt-0.5 block text-[14px] text-inkoust-2">{cz(l.popis)}</small>
          </span>
          <Hvezdy pocet={hvezdy[l.id] ?? 0} />
        </button>
      ))}
    </div>
  )
}
