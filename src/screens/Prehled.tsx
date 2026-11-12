import { useRef, useState, type FC } from 'react'
import { Flame, Star } from 'lucide-react'
import { Button } from '@/components/arc/button/button'
import { ProfilSheet } from '../components/ProfilSheet'
import { Vombat } from '../components/Vombat'
import { PREDMETY, type Predmet as PredmetId } from '../data/katalog'
import { VSECHNY_LEKCE, lekcePodleId } from '../data/lekce'
import { PLAN } from '../data/plan'
import { dnesISO } from '../lib/datum'
import { vyberDnesniUkol } from '../lib/dnesniUkol'
import { aktualniSerie } from '../lib/postup'
import { cz, pocet } from '../lib/typo'
import { useProfileStore } from '../store/useProfileStore'

interface PrehledProps {
  onStart: (lekceId: string) => void
  onPredmet: (predmet: PredmetId) => void
}

const zvyraznene =
  'inline px-[0.15em] font-bold [box-decoration-break:clone] [-webkit-box-decoration-break:clone] ' +
  '[background:linear-gradient(100deg,transparent_0.2em,var(--zvyraznovac)_0.2em,var(--zvyraznovac)_calc(100%-0.3em),transparent_calc(100%-0.1em))_0_70%/100%_55%_no-repeat]'

export const Prehled: FC<PrehledProps> = ({ onStart, onPredmet }) => {
  const profil = useProfileStore((s) => s.getActiveProfile())
  const [profilOtevren, setProfilOtevren] = useState(false)
  const tlacitkoProfilu = useRef<HTMLButtonElement>(null)
  const zmenProfilSheet = (otevren: boolean) => {
    setProfilOtevren(otevren)
    // Po zavření vrátíme fokus na kolečko profilu, ať klávesnice nezačíná od začátku stránky.
    if (!otevren) requestAnimationFrame(() => tlacitkoProfilu.current?.focus())
  }

  const dnes = dnesISO()
  const hvezdy = profil?.hvezdy ?? {}
  const ukol = vyberDnesniUkol(PLAN, { hvezdy, dokonceno: profil?.dokonceno ?? {} }, VSECHNY_LEKCE, dnes)

  const serie = profil ? aktualniSerie(profil.serie, dnes) : 0
  const celkemHvezd = Object.values(hvezdy).reduce((a, b) => a + b, 0)
  const iniciala = (profil?.name.trim()[0] ?? '?').toLocaleUpperCase('cs')

  const idDalsi =
    ukol.typ === 'ukol' ? ukol.lekceId : ukol.typ === 'na-dnes-hotovo' ? ukol.dalsiId : ukol.navrhId
  const dalsi = idDalsi ? lekcePodleId(idDalsi) : undefined
  const planRadek =
    ukol.typ === 'volna' ? null : `Plán na týden: ${ukol.hotovo} ze ${ukol.celkem} hotovo`

  const hotovoDnes = ukol.typ === 'na-dnes-hotovo' || ukol.typ === 'plan-splnen'
  const co = ukol.typ === 'volna' ? 'Návrh na dnes' : 'Dnešní úkol'
  const nadpis =
    ukol.typ === 'na-dnes-hotovo'
      ? 'Na dnes hotovo'
      : ukol.typ === 'plan-splnen'
        ? 'Plán splněn'
        : (dalsi?.nazev ?? 'Zatím tu není žádná lekce')
  const meta =
    ukol.typ === 'na-dnes-hotovo'
      ? `Další v plánu: ${dalsi?.nazev}. Nabídne se zítra, ale můžeš pokračovat hned.`
      : ukol.typ === 'plan-splnen'
        ? `Celý plán máš hotový. Zkus ještě lekci s nejméně hvězdami: ${dalsi?.nazev}.`
        : ukol.typ === 'volna'
          ? 'Lekce, ve které máš nejméně hvězd.'
          : (dalsi?.meta ?? '')

  return (
    <div className="pr-5 pt-12 pb-20 min-[700px]:pr-12 min-[700px]:pt-10 min-[700px]:pb-24">
      <header className="mb-7 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[30px] leading-[1.15] font-bold tracking-[-0.01em]">
            {cz(`Ahoj, ${profil?.vokativ ?? 'Eliško'}`)}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-inkoust-2">
            <span className="inline-flex items-center gap-1.5">
              <Flame className="h-[18px] w-[18px] text-vlastiveda" strokeWidth={2} aria-hidden="true" />
              {serie > 0 ? `${pocet(serie, ['den', 'dny', 'dní'])} v řadě` : 'Série začíná dnes'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star
                className="h-[18px] w-[18px] fill-zvyraznovac text-inkoust"
                strokeWidth={2}
                aria-hidden="true"
              />
              {pocet(celkemHvezd, ['hvězda', 'hvězdy', 'hvězd'])}
            </span>
          </div>
        </div>
        <button
          ref={tlacitkoProfilu}
          type="button"
          onClick={() => setProfilOtevren(true)}
          aria-label="Změnit profil"
          className="h-12 w-12 flex-none rounded-full border-2 border-inkoust bg-papir text-[18px] font-bold"
        >
          {iniciala}
        </button>
      </header>

      <section
        aria-labelledby="dnes-nadpis"
        className="relative mt-[52px] mb-10 rounded-l border-2 border-inkoust bg-papir px-5 pt-5 pb-[22px]"
      >
        <Vombat
          stav={hotovoDnes ? 'radost' : 'klid'}
          className="pointer-events-none absolute -top-[51px] right-[18px] h-[61px] w-[76px]"
        />
        <p className="mb-1.5 text-[15px] text-inkoust-2">{co}</p>
        <h2 id="dnes-nadpis" className="mb-1.5 text-[26px] leading-[1.2]">
          <span className={zvyraznene}>{cz(nadpis)}</span>
        </h2>
        <p className="mt-2.5 mb-[18px] text-[15px] text-inkoust-2">
          {cz(meta)}
          {planRadek && (
            <>
              <br />
              <span className="text-[14px]">{cz(planRadek)}</span>
            </>
          )}
        </p>
        {dalsi && (
          <Button
            size="lg"
            variant={ukol.typ === 'na-dnes-hotovo' ? 'secondary' : 'primary'}
            className="w-full !text-[18px]"
            onClick={() => onStart(dalsi.id)}
          >
            {ukol.typ === 'na-dnes-hotovo' ? 'Pokračovat hned' : 'Začít'}
          </Button>
        )}
      </section>

      <section aria-labelledby="predmety-nadpis">
        <h2 id="predmety-nadpis" className="mb-3 text-[15px] font-semibold text-inkoust-2">
          Předměty
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {PREDMETY.map((predmet) => {
            const lekce = VSECHNY_LEKCE.filter((l) => l.predmet === predmet.id)
            if (lekce.length === 0) return null
            const ziskano = lekce.reduce((s, l) => s + (hvezdy[l.id] ?? 0), 0)
            const mozno = lekce.length * 3
            return (
              <button
                key={predmet.id}
                type="button"
                onClick={() => onPredmet(predmet.id)}
                style={{ ['--b' as string]: `var(--${predmet.id})` }}
                className="flex min-h-[120px] flex-col items-start rounded-m border-2 border-b-[5px] border-inkoust-3 bg-papir px-4 pt-4 pb-3.5 text-left active:translate-y-[3px] active:border-b-2"
              >
                <i className="mb-3 block h-1.5 w-[28px] rounded-[3px] bg-[var(--b)]" aria-hidden="true" />
                <b className="block text-[19px] leading-tight font-semibold">{predmet.nazev}</b>
                <small className="mt-1 block text-[14px] text-inkoust-2">
                  {pocet(lekce.length, ['lekce', 'lekce', 'lekcí'])}
                </small>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[14px] text-inkoust-2">
                  <Star className="h-4 w-4 fill-zvyraznovac text-inkoust" strokeWidth={2} aria-hidden="true" />
                  <span aria-hidden="true">
                    {ziskano} / {mozno}
                  </span>
                  <span className="sr-only">{`, ${pocet(ziskano, ['hvězda', 'hvězdy', 'hvězd'])} z ${mozno}`}</span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <ProfilSheet open={profilOtevren} onOpenChange={zmenProfilSheet} />
    </div>
  )
}
