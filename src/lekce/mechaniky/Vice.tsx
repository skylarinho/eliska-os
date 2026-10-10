import { useMemo, useState, type FC } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/arc/button/button'
import { michej } from '../../lib/michej'
import { cz } from '../../lib/typo'
import type { PolozkaOvladani } from '../typy'

interface ViceProps extends PolozkaOvladani {
  moznosti: string[]
  spravne: string[]
  vysvetleni: string
}

/** „Vyber všechny správné“: zaškrtávací možnosti a tlačítko Zkontrolovat. */
export const Vice: FC<ViceProps> = ({ moznosti, spravne, vysvetleni, odpovez, odpovezeno }) => {
  const zamichane = useMemo(() => michej(moznosti), [moznosti])
  const [zvolene, setZvolene] = useState<string[]>([])

  const prepni = (m: string) =>
    setZvolene((z) => (z.includes(m) ? z.filter((x) => x !== m) : [...z, m]))

  const zkontroluj = () => {
    const ok = spravne.length === zvolene.length && spravne.every((s) => zvolene.includes(s))
    odpovez({
      spravne: ok,
      nadpis: ok ? 'Správně' : 'Správná sada je jiná',
      text: vysvetleni,
      poznamka: ok ? undefined : `Správně: ${spravne.join(', ')}`,
    })
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-2.5" role="group" aria-label="Možnosti">
        {zamichane.map((m) => {
          const vybrano = zvolene.includes(m)
          const jeSpravne = spravne.includes(m)
          const stav = !odpovezeno
            ? vybrano
              ? 'border-inkoust'
              : 'border-inkoust-3'
            : jeSpravne
              ? 'border-spravne bg-spravne-bg'
              : vybrano
                ? 'border-oprava bg-oprava-bg'
                : 'border-inkoust-3 opacity-60'
          return (
            <button
              key={m}
              type="button"
              role="checkbox"
              aria-checked={vybrano}
              disabled={odpovezeno}
              onClick={() => prepni(m)}
              className={`flex min-h-[64px] items-center gap-3 rounded-m border-2 bg-papir px-3.5 py-2 text-left text-[18px] font-medium disabled:cursor-default ${stav}`}
            >
              <span
                className={`grid h-7 w-7 flex-none place-items-center rounded-[8px] border-2 ${
                  vybrano ? 'border-inkoust bg-zvyraznovac' : 'border-inkoust-3'
                }`}
                aria-hidden="true"
              >
                {vybrano && <Check className="h-5 w-5 text-inkoust" strokeWidth={3} />}
              </span>
              {cz(m)}
            </button>
          )
        })}
      </div>
      {!odpovezeno && (
        <Button size="lg" className="w-full !text-[18px]" disabled={zvolene.length === 0} onClick={zkontroluj}>
          Zkontrolovat
        </Button>
      )}
    </>
  )
}
