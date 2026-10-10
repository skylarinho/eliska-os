import { useState, type FC } from 'react'
import { Check, Minus, Plus, Undo2 } from 'lucide-react'
import { Button } from '@/components/arc/button/button'
import { SHOP_ITEMS, SHOP_MISSIONS } from '../../data/shopData'
import type { CoinValue, ShopMission } from '../../types/learning'
import { cz } from '../../lib/typo'
import { useProfileStore } from '../../store/useProfileStore'
import { Dopsano } from '../Dopsano'
import { Lekce } from '../Lekce'
import type { PolozkaOvladani } from '../typy'

const MINCE: CoinValue[] = [1, 2, 5, 10, 20, 50]

const SKUPINY: { id: string; nazev: string }[] = [
  { id: 'pecivo', nazev: 'Pečivo' },
  { id: 'ovoce', nazev: 'Ovoce' },
  { id: 'mlsceni', nazev: 'Mlsání' },
  { id: 'napoje', nazev: 'Nápoje' },
]

const cenaPolozky = (id: string) => SHOP_ITEMS.find((i) => i.id === id)?.price ?? 0
const nazevPolozky = (id: string) => SHOP_ITEMS.find((i) => i.id === id)?.name ?? id

const kc = (n: number) => `${n} Kč`

const Uloha: FC<{ mise: ShopMission } & PolozkaOvladani> = ({ mise, odpovez, odpovezeno }) => {
  const jmeno = useProfileStore((st) => st.getActiveProfile()?.name ?? 'Eliška')
  const [faze, setFaze] = useState<'kosik' | 'pokladna'>('kosik')
  const [kosik, setKosik] = useState<Record<string, number>>({})
  const [mince, setMince] = useState<CoinValue[]>([])

  const celkemNakup = mise.cartTargets.reduce((s, t) => s + cenaPolozky(t.itemId) * t.count, 0)
  const vKosiku = Object.entries(kosik).reduce((s, [id, n]) => s + cenaPolozky(id) * n, 0)
  const kosikSedi = mise.cartTargets.every((t) => (kosik[t.itemId] ?? 0) === t.count)
  const kosikPocet = Object.values(kosik).reduce((a, b) => a + b, 0)
  const cilPocet = mise.cartTargets.reduce((a, t) => a + t.count, 0)
  const vraceno = mince.reduce((a, b) => a + b, 0)
  const spravneVratit = mise.paidWithBanknote - celkemNakup

  const zmen = (id: string, rozdil: number) =>
    setKosik((k) => {
      const n = Math.max(0, (k[id] ?? 0) + rozdil)
      const dalsi = { ...k }
      if (n === 0) delete dalsi[id]
      else dalsi[id] = n
      return dalsi
    })

  const zkontroluj = () => {
    const spravne = vraceno === spravneVratit
    const rozdil = Math.abs(vraceno - spravneVratit)
    odpovez({
      spravne,
      nadpis: spravne ? 'Správně' : `Správně je ${kc(spravneVratit)}`,
      text: spravne
        ? `Nákup stál ${kc(celkemNakup)}, zákazník platil ${kc(mise.paidWithBanknote)}. Správně se vrací ${kc(spravneVratit)} (${mise.paidWithBanknote} – ${celkemNakup} = ${spravneVratit}).`
        : `${vraceno < spravneVratit ? `Vráceno ${kc(vraceno)}, chybí ${kc(rozdil)}.` : `Vráceno ${kc(vraceno)}, to je o ${kc(rozdil)} víc.`} Spočítej: ${mise.paidWithBanknote} – ${celkemNakup} = ${spravneVratit}.`,
    })
  }

  return (
    <>
      <h2 className="mb-1 text-[22px] leading-tight font-bold">{cz(mise.title)}</h2>
      <p className="mb-4 text-[17px] text-inkoust-2">{cz(mise.story.replaceAll('{jmeno}', jmeno))}</p>

      <section className="mb-5 rounded-s border-2 border-inkoust-3 bg-papir px-4 py-3" aria-label="Nákupní lístek">
        <p className="mb-1.5 text-[15px] font-semibold text-inkoust-2">Nákupní lístek</p>
        <ul className="space-y-1">
          {mise.cartTargets.map((t) => {
            const hotovo = (kosik[t.itemId] ?? 0) === t.count
            return (
              <li key={t.itemId} className="flex items-center justify-between gap-3 text-[17px]">
                <span>
                  {t.count}&nbsp;× {cz(nazevPolozky(t.itemId))}
                </span>
                {faze === 'kosik' && hotovo && (
                  <Check className="h-5 w-5 flex-none text-spravne" strokeWidth={2.4} aria-label="Hotovo" />
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {faze === 'kosik' ? (
        <>
          <p className="mb-3 text-[16px] text-inkoust-2">Dej do košíku přesně to, co je na lístku.</p>
          {SKUPINY.map((s) => (
            <section key={s.id} className="mb-4" aria-label={s.nazev}>
              <h3 className="mb-1.5 text-[15px] font-semibold text-inkoust-2">{s.nazev}</h3>
              {SHOP_ITEMS.filter((i) => i.category === s.id).map((i) => {
                const n = kosik[i.id] ?? 0
                return (
                  <div
                    key={i.id}
                    className="mb-2 flex min-h-[60px] items-center gap-2 rounded-s border-2 border-inkoust-3 bg-papir py-1.5 pr-1.5 pl-3.5"
                  >
                    <span className="min-w-0 flex-1">
                      <b className="block text-[17px] leading-tight font-semibold">{cz(i.name)}</b>
                      <small className="text-[14px] text-inkoust-2">{kc(i.price)}</small>
                    </span>
                    <button
                      type="button"
                      onClick={() => zmen(i.id, -1)}
                      disabled={n === 0}
                      aria-label={`Ubrat: ${i.name}`}
                      className="grid h-12 w-12 flex-none place-items-center rounded-full border-2 border-inkoust-3 bg-papir disabled:opacity-40"
                    >
                      <Minus className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center text-[20px] font-semibold tabular-nums" aria-live="polite">
                      {n}
                    </span>
                    <button
                      type="button"
                      onClick={() => zmen(i.id, 1)}
                      aria-label={`Přidat: ${i.name}`}
                      className="grid h-12 w-12 flex-none place-items-center rounded-full border-2 border-inkoust bg-papir"
                    >
                      <Plus className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
                    </button>
                  </div>
                )
              })}
            </section>
          ))}
          <div className="sticky bottom-0 -mr-5 -ml-1 flex items-center gap-3 border-t-2 border-inkoust-3 bg-papir py-3 pr-5 pl-1 min-[700px]:-mr-12 min-[700px]:pr-12">
            <p className="flex-1 text-[15px] text-inkoust-2">
              V{' '}košíku: <b className="text-[17px] text-inkoust">{kc(vKosiku)}</b>
              <br />
              {kosikPocet} z {cilPocet} kusů
            </p>
            <Button size="lg" disabled={!kosikSedi} onClick={() => setFaze('pokladna')}>
              K{' '}pokladně
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-1 text-[17px]">
            Nákup stál <b>{kc(celkemNakup)}</b>. Zákazník platí bankovkou <b>{kc(mise.paidWithBanknote)}</b>.
          </p>
          <p className="mb-4 text-[16px] text-inkoust-2">Vrať mu drobné mincemi.</p>

          <p className="mb-1 text-[15px] text-inkoust-2">Vráceno</p>
          <p className="mb-4 min-h-[1.4em] text-[28px] leading-[1.45] font-medium">
            {odpovezeno ? (
              <>
                <Dopsano zvoleno={String(vraceno)} spravne={String(spravneVratit)} />
                &nbsp;Kč
              </>
            ) : (
              kc(vraceno)
            )}
          </p>

          <div className="mb-3 flex min-h-12 flex-wrap items-center gap-1.5" aria-label="Vrácené mince">
            {mince.map((m, k) => (
              <span key={k} className="rounded-full border-2 border-inkoust px-3 py-1 text-[15px] font-semibold">
                {m}
              </span>
            ))}
          </div>

          <div className="mb-3 grid grid-cols-3 gap-2.5">
            {MINCE.map((m) => (
              <button
                key={m}
                type="button"
                disabled={odpovezeno}
                onClick={() => setMince((x) => [...x, m])}
                className="min-h-[60px] rounded-m border-2 border-b-[5px] border-inkoust-3 bg-papir text-[20px] font-semibold enabled:active:translate-y-[3px] enabled:active:border-b-2 disabled:opacity-45"
              >
                {kc(m)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="lg"
              disabled={odpovezeno || mince.length === 0}
              onClick={() => setMince((x) => x.slice(0, -1))}
              aria-label="Vrátit poslední minci"
            >
              <Undo2 className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              className="flex-1 !text-[18px]"
              disabled={odpovezeno || mince.length === 0}
              onClick={zkontroluj}
            >
              Zkontrolovat
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export const Obchudek: FC<{ lekceId: string; onZavrit: () => void }> = ({ lekceId, onZavrit }) => (
  <Lekce id={lekceId} zadani="Nakup podle lístku a vrať drobné" polozky={SHOP_MISSIONS} onZavrit={onZavrit}>
    {(m, o) => <Uloha mise={m} {...o} />}
  </Lekce>
)
