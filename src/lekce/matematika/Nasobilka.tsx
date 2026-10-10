import { useMemo, useState, type FC } from 'react'
import { MULTIPLICATION_DUELS } from '../../data/mathData'
import type { MultiplicationDuel } from '../../types/learning'
import { michej } from '../../lib/michej'
import { Lekce } from '../Lekce'
import { OdpovedTlacitko } from '../OdpovedTlacitko'
import type { PolozkaOvladani } from '../typy'

const Uloha: FC<{ priklad: MultiplicationDuel } & PolozkaOvladani> = ({ priklad, odpovez, odpovezeno }) => {
  const [zvoleno, setZvoleno] = useState<number | null>(null)
  const moznosti = useMemo(() => michej(priklad.options), [priklad])
  const { factorA: a, factorB: b, product } = priklad

  const vyber = (cislo: number) => {
    if (odpovezeno) return
    setZvoleno(cislo)
    const spravne = cislo === product
    odpovez({
      spravne,
      nadpis: spravne ? 'Správně' : `Správně je ${product}`,
      text: spravne
        ? `${a} × ${b} = ${product}. Představ si ${a} řádků po ${b} tečkách.`
        : `${a} × ${b} = ${product}. Zkus spočítat tečky v mřížce.`,
    })
  }

  return (
    <>
      <p className="mb-5 text-[28px] leading-[1.45] font-medium">
        {a} × {b} ={' '}
        <span className="font-ruka text-[1.35em] leading-[0.9] font-bold">
          {odpovezeno ? (
            zvoleno === product ? (
              <span className="text-spravne">{product}</span>
            ) : (
              <>
                <s className="mr-[0.1em] text-oprava opacity-70">{zvoleno}</s>
                <span className="text-spravne">{product}</span>
              </>
            )
          ) : (
            '?'
          )}
        </span>
      </p>

      <div className="mb-7 flex flex-col gap-1.5" role="img" aria-label={`Mřížka: ${a} řádků po ${b} tečkách`}>
        {Array.from({ length: a }, (_, r) => (
          <div key={r} className="flex gap-1.5">
            {Array.from({ length: b }, (_, c) => (
              <span key={c} className="h-4 w-4 rounded-full border-2 border-inkoust bg-papir" />
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {moznosti.map((cislo) => (
          <OdpovedTlacitko
            key={cislo}
            disabled={odpovezeno}
            stav={!odpovezeno ? null : cislo === product ? 'ok' : cislo === zvoleno ? 'spatne' : null}
            onClick={() => vyber(cislo)}
          >
            {cislo}
          </OdpovedTlacitko>
        ))}
      </div>
    </>
  )
}

export const Nasobilka: FC<{ lekceId: string; onZavrit: () => void }> = ({ lekceId, onZavrit }) => (
  <Lekce id={lekceId} zadani="Vyber správný výsledek" polozky={MULTIPLICATION_DUELS} onZavrit={onZavrit}>
    {(p, o) => <Uloha priklad={p} {...o} />}
  </Lekce>
)
