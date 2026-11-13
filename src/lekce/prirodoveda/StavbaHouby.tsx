import { useState, type FC } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/arc/button/button'
import { Progress } from '@/components/arc/progress/progress'
import { cz } from '../../lib/typo'
import { Lekce } from '../Lekce'
import { Vyber } from '../mechaniky/Vyber'
import type { PolozkaOvladani } from '../typy'
import { KresbaHouby, type StavCasti } from './KresbaHouby'
import { NAD_ZEMI, NAZVY, VYKLAD, patri, type CastHouby, type CilHouby } from './houba'

type Polozka =
  | { typ: 'tukni'; cil: CilHouby; otazka: string }
  | { typ: 'pojmenuj'; cil: CilHouby; moznosti: CilHouby[] }

const POLOZKY: Polozka[] = [
  { typ: 'tukni', cil: 'klobouk', otazka: 'Ťukni na klobouk.' },
  { typ: 'pojmenuj', cil: 'tren', moznosti: ['tren', 'klobouk', 'podhoubi'] },
  { typ: 'tukni', cil: 'rourky', otazka: 'Kde se tvoří výtrusy?' },
  { typ: 'pojmenuj', cil: 'podhoubi', moznosti: ['podhoubi', 'tren', 'rourky'] },
  { typ: 'tukni', cil: 'plodnice', otazka: 'Ťukni na plodnici.' },
  { typ: 'pojmenuj', cil: 'rourky', moznosti: ['rourky', 'klobouk', 'podhoubi'] },
  { typ: 'tukni', cil: 'podhoubi', otazka: 'Kde je hlavní část houby, která žije i mnoho let?' },
  { typ: 'pojmenuj', cil: 'plodnice', moznosti: ['plodnice', 'podhoubi', 'tren'] },
]

const CASTI: CastHouby[] = ['klobouk', 'rourky', 'tren', 'podhoubi']

/** Vyšrafuje cíl; plodnice = všechny části nad zemí. */
const vyznac = (cil: CilHouby, s: StavCasti): Partial<Record<CastHouby, StavCasti>> =>
  Object.fromEntries((cil === 'plodnice' ? NAD_ZEMI : [cil]).map((c) => [c, s]))

const tady = (c: CastHouby) => `Tady ${c === 'rourky' ? 'jsou' : 'je'} ${NAZVY[c].toLowerCase()}`

const Tukni: FC<{ cil: CilHouby; otazka: string } & PolozkaOvladani> = ({ cil, otazka, odpovez, odpovezeno }) => {
  const [tuknuto, setTuknuto] = useState<CastHouby | null>(null)
  const tukni = (c: CastHouby) => {
    if (odpovezeno) return
    setTuknuto(c)
    const ok = patri(c, cil)
    odpovez({
      spravne: ok,
      nadpis: ok ? 'Správně' : tady(c),
      text: ok ? VYKLAD[cil] : `Správné místo je teď vyznačené zeleně. ${VYKLAD[cil]}`,
    })
  }
  const stav = odpovezeno && tuknuto ? { ...(patri(tuknuto, cil) ? {} : { [tuknuto]: 'spatne' as const }), ...vyznac(cil, 'ok') } : {}

  return (
    <>
      <p className="mb-4 text-[24px] leading-[1.4] font-medium text-pretty">{cz(otazka)}</p>
      <KresbaHouby stav={stav} onTukni={odpovezeno ? undefined : tukni} />
    </>
  )
}

const Pojmenuj: FC<{ cil: CilHouby; moznosti: CilHouby[] } & PolozkaOvladani> = ({ cil, moznosti, odpovez, odpovezeno }) => (
  <>
    <div className="mb-5">
      <KresbaHouby stav={vyznac(cil, 'srafa')} popis="Kresba hřibu, jedna jeho část je vyšrafovaná." />
    </div>
    <Vyber
      moznosti={moznosti.map((m) => NAZVY[m])}
      spravna={NAZVY[cil]}
      vysvetleni={VYKLAD[cil]}
      odpovez={odpovez}
      odpovezeno={odpovezeno}
    />
  </>
)

/** Průzkum před procvičováním: dítě ťuká na části a čte, k čemu jsou. Nakonec plodnice. */
const Pruzkum: FC<{ onHotovo: () => void; onZavrit: () => void }> = ({ onHotovo, onZavrit }) => {
  const [vybrano, setVybrano] = useState<CilHouby | null>(null)
  const [videno, setVideno] = useState<CastHouby[]>([])
  const vse = videno.length === CASTI.length
  const naPlodnici = vybrano === 'plodnice'

  const tukni = (c: CastHouby) => {
    setVybrano(c)
    setVideno((v) => (v.includes(c) ? v : [...v, c]))
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
          aria-label="Postup v průzkumu"
          aria-valuetext={`Prozkoumáno ${videno.length} z ${CASTI.length}`}
          value={videno.length + (naPlodnici ? 1 : 0)}
          max={CASTI.length + 1}
        />
      </div>

      <p className="mb-3.5 text-[16px] text-inkoust-2">Než začneš</p>
      <h1 className="mb-2 text-[30px] leading-tight font-bold text-balance">{naPlodnici ? 'Co je plodnice' : 'Prozkoumej houbu'}</h1>
      <p className="mb-5 text-[17px] text-inkoust-2">
        {naPlodnici ? cz('Plodnice je vyšrafovaná.') : cz('Ťukni postupně na všechny čtyři části houby.')}
      </p>

      <KresbaHouby
        stav={vybrano ? vyznac(vybrano, 'srafa') : {}}
        onTukni={naPlodnici ? undefined : tukni}
        popis="Kresba hřibu, celá část nad zemí je vyšrafovaná."
      />

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Prozkoumané části">
        {CASTI.map((c) => (
          <li
            key={c}
            className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-[15px] ${videno.includes(c) ? 'border-inkoust text-inkoust' : 'border-inkoust-3 text-inkoust-2'}`}
          >
            {videno.includes(c) ? <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" /> : null}
            {videno.includes(c) ? NAZVY[c] : '?'}
            <span className="sr-only">{videno.includes(c) ? ', prozkoumáno' : 'Zatím neprozkoumaná část'}</span>
          </li>
        ))}
      </ul>

      <section aria-live="polite" className="mt-5 min-h-[120px]">
        {vybrano && (
          <div className="rounded-m border-2 border-inkoust-3 bg-papir px-4 py-3.5">
            <h2 className="mb-1.5 text-[22px] font-semibold">{NAZVY[vybrano]}</h2>
            <p className="text-[17px] leading-[1.6] text-pretty">{cz(VYKLAD[vybrano])}</p>
          </div>
        )}
      </section>

      {vse && (
        <div className="mt-6">
          {naPlodnici ? (
            <Button size="lg" className="w-full !text-[18px]" onClick={onHotovo}>
              Jdu procvičovat
            </Button>
          ) : (
            <Button size="lg" className="w-full !text-[18px]" onClick={() => setVybrano('plodnice')}>
              Co je plodnice?
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export const StavbaHouby: FC<{ lekceId: string; onZavrit: () => void }> = ({ lekceId, onZavrit }) => {
  // Průzkum jen poprvé; „Zkusit znovu“ už jde rovnou na úlohy.
  const [pruzkumHotov, setPruzkumHotov] = useState(false)
  if (!pruzkumHotov) return <Pruzkum onHotovo={() => setPruzkumHotov(true)} onZavrit={onZavrit} />

  return (
    <Lekce
      id={lekceId}
      zadani={(p) => (p.typ === 'tukni' ? 'Ťukni na správnou část houby' : 'Jak se jmenuje vyšrafovaná část?')}
      polozky={POLOZKY}
      onZavrit={onZavrit}
    >
      {(p, o) => (p.typ === 'tukni' ? <Tukni cil={p.cil} otazka={p.otazka} {...o} /> : <Pojmenuj cil={p.cil} moznosti={p.moznosti} {...o} />)}
    </Lekce>
  )
}
