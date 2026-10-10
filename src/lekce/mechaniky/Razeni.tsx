import { useMemo, useState, type FC } from 'react'
import { Undo2 } from 'lucide-react'
import { Button } from '@/components/arc/button/button'
import { michej } from '../../lib/michej'
import { cz } from '../../lib/typo'
import type { PolozkaOvladani } from '../typy'

export interface PolozkaRazeni {
  id: string
  nazev: string
  popis?: string
}

interface RazeniProps extends PolozkaOvladani {
  /** Položky ve správném pořadí; appka je zamíchá. */
  polozky: PolozkaRazeni[]
  vysvetleni: string
}

/** Řazení: dítě klepáním skládá položky do pořadí a pak zkontroluje. */
export const Razeni: FC<RazeniProps> = ({ polozky, vysvetleni, odpovez, odpovezeno }) => {
  const nabidka = useMemo(() => {
    let z: PolozkaRazeni[]
    do z = michej(polozky)
    while (polozky.length > 1 && z.every((p, i) => p.id === polozky[i].id))
    return z
  }, [polozky])
  const [poradi, setPoradi] = useState<PolozkaRazeni[]>([])

  const volne = nabidka.filter((p) => !poradi.some((x) => x.id === p.id))
  const hotovo = poradi.length === polozky.length

  const zkontroluj = () => {
    const spravne = poradi.every((p, i) => p.id === polozky[i].id)
    odpovez({
      spravne,
      nadpis: spravne ? 'Správně' : 'Správné pořadí je jiné',
      text: spravne ? vysvetleni : `${polozky.map((p, i) => `${i + 1}. ${p.nazev}`).join(', ')}. ${vysvetleni}`,
    })
  }

  return (
    <>
      <ol className="mb-5 flex flex-col gap-2" aria-label="Tvoje pořadí">
        {polozky.map((spravna, i) => {
          const vlozena = poradi[i]
          const ok = odpovezeno && vlozena?.id === spravna.id
          const spatne = odpovezeno && vlozena && vlozena.id !== spravna.id
          return (
            <li
              key={i}
              className={`flex min-h-[60px] items-center gap-3 rounded-s border-2 px-3.5 py-2 ${
                ok ? 'border-spravne bg-spravne-bg' : spatne ? 'border-oprava bg-oprava-bg' : vlozena ? 'border-inkoust' : 'border-dashed border-inkoust-3'
              }`}
            >
              <span className="w-5 text-[17px] font-semibold text-inkoust-2">{i + 1}.</span>
              {vlozena ? (
                <button
                  type="button"
                  disabled={odpovezeno}
                  onClick={() => setPoradi((p) => p.filter((x) => x.id !== vlozena.id))}
                  aria-label={`Vrátit: ${vlozena.nazev}`}
                  className="min-h-12 flex-1 text-left text-[20px] font-semibold disabled:opacity-100"
                >
                  {spatne ? (
                    <>
                      <s className="text-oprava opacity-70">{cz(vlozena.nazev)}</s>{' '}
                      <span className="font-ruka text-[1.35em] font-bold text-spravne">{cz(spravna.nazev)}</span>
                    </>
                  ) : (
                    cz(vlozena.nazev)
                  )}
                </button>
              ) : (
                <span className="text-[15px] text-inkoust-2">prázdné místo</span>
              )}
            </li>
          )
        })}
      </ol>

      {!odpovezeno && (
        <>
          <div className="mb-5 flex flex-col gap-2">
            {volne.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPoradi((x) => [...x, p])}
                className="min-h-[60px] rounded-m border-2 border-b-[5px] border-inkoust-3 bg-papir px-4 py-2 text-left active:translate-y-[3px] active:border-b-2"
              >
                <b className="block text-[18px] leading-tight font-semibold">{cz(p.nazev)}</b>
                {p.popis && <small className="text-[14px] text-inkoust-2">{cz(p.popis)}</small>}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="lg"
              disabled={poradi.length === 0}
              onClick={() => setPoradi((x) => x.slice(0, -1))}
              aria-label="Vrátit poslední"
            >
              <Undo2 className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button size="lg" className="flex-1 !text-[18px]" disabled={!hotovo} onClick={zkontroluj}>
              Zkontrolovat
            </Button>
          </div>
        </>
      )}
    </>
  )
}
