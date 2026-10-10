import { useState, type FC } from 'react'
import { Button } from '@/components/arc/button/button'
import { NumberField } from '@/components/arc/number-field/number-field'
import { DECOMPOSITION_EXERCISES } from '../../data/mathData'
import type { DecompositionStep } from '../../types/learning'
import { cz } from '../../lib/typo'
import { Dopsano } from '../Dopsano'
import { Lekce } from '../Lekce'
import type { PolozkaOvladani } from '../typy'

const Uloha: FC<{ priklad: DecompositionStep } & PolozkaOvladani> = ({ priklad: p, odpovez, odpovezeno }) => {
  const [desitky, setDesitky] = useState(0)
  const [jednotky, setJednotky] = useState(0)
  const [celkem, setCelkem] = useState(0)

  const zkontroluj = () => {
    const spravne = desitky === p.sumTens && jednotky === p.sumOnes && celkem === p.total
    odpovez({
      spravne,
      nadpis: spravne ? 'Správně' : `Správně je ${p.total}`,
      text: spravne
        ? `${p.numA} + ${p.numB} = (${p.tensA} + ${p.tensB}) + (${p.onesA} + ${p.onesB}) = ${p.sumTens} + ${p.sumOnes} = ${p.total}.`
        : `Desítky: ${p.tensA} + ${p.tensB} = ${p.sumTens}. Jednotky: ${p.onesA} + ${p.onesB} = ${p.sumOnes}. Celkem: ${p.sumTens} + ${p.sumOnes} = ${p.total}.`,
      poznamka: spravne ? undefined : 'Nejdřív sečti celé desítky, potom jednotky.',
    })
  }

  const pole = [
    { label: `Desítky: ${p.tensA} + ${p.tensB}`, hodnota: desitky, nastav: setDesitky },
    { label: `Jednotky: ${p.onesA} + ${p.onesB}`, hodnota: jednotky, nastav: setJednotky },
    { label: `Celkem: ${p.sumTens} + ${p.sumOnes}`, hodnota: celkem, nastav: setCelkem },
  ]

  return (
    <>
      <p className="mb-5 text-[28px] leading-[1.45] font-medium">
        {p.numA} + {p.numB} = ?
      </p>
      <div className="mb-6 flex flex-col gap-4">
        {pole.map((f) => (
          <NumberField
            key={f.label}
            label={cz(f.label)}
            size="lg"
            value={f.hodnota}
            onValueChange={f.nastav}
            min={0}
            max={200}
            disabled={odpovezeno}
          />
        ))}
      </div>
      {odpovezeno && (
        <p className="mb-6 text-[28px] leading-[1.45]" aria-hidden="true">
          <Dopsano zvoleno={String(desitky)} spravne={String(p.sumTens)} /> +{' '}
          <Dopsano zvoleno={String(jednotky)} spravne={String(p.sumOnes)} /> ={' '}
          <Dopsano zvoleno={String(celkem)} spravne={String(p.total)} />
        </p>
      )}
      <Button size="lg" className="w-full !text-[18px]" onClick={zkontroluj} disabled={odpovezeno}>
        Zkontrolovat
      </Button>
    </>
  )
}

export const Rozklad: FC<{ lekceId: string; onZavrit: () => void }> = ({ lekceId, onZavrit }) => (
  <Lekce id={lekceId} zadani="Sečti po desítkách a jednotkách" polozky={DECOMPOSITION_EXERCISES} onZavrit={onZavrit}>
    {(p, o) => <Uloha priklad={p} {...o} />}
  </Lekce>
)
