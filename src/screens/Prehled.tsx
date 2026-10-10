import { useRef, useState, type FC } from 'react'
import { Flame, Star } from 'lucide-react'
import { Button } from '@/components/arc/button/button'
import { Hvezdy } from '../components/Hvezdy'
import { ProfilSheet } from '../components/ProfilSheet'
import { Vombat } from '../components/Vombat'
import { PREDMETY } from '../data/katalog'
import { VSECHNY_LEKCE, lekcePodleId } from '../data/lekce'
import { PLAN } from '../data/plan'
import { dnesISO } from '../lib/datum'
import { vyberDnesniUkol } from '../lib/dnesniUkol'
import { aktualniSerie } from '../lib/postup'
import { cz, pocet } from '../lib/typo'
import { useProfileStore } from '../store/useProfileStore'

interface PrehledProps {
  onStart: (lekceId: string) => void
}

const zvyraznene =
  'inline px-[0.15em] font-bold [box-decoration-break:clone] [-webkit-box-decoration-break:clone] ' +
  '[background:linear-gradient(100deg,transparent_0.2em,var(--zvyraznovac)_0.2em,var(--zvyraznovac)_calc(100%-0.3em),transparent_calc(100%-0.1em))_0_70%/100%_55%_no-repeat]'

export const Prehled: FC<PrehledProps> = ({ onStart }) => {
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

      {PREDMETY.map((predmet) => {
        const lekce = VSECHNY_LEKCE.filter((l) => l.predmet === predmet.id)
        if (lekce.length === 0) return null
        return (
          <section
            key={predmet.id}
            aria-labelledby={`predmet-${predmet.id}`}
            className="mb-[26px]"
            style={{ ['--b' as string]: `var(--${predmet.id})` }}
          >
            <h3
              id={`predmet-${predmet.id}`}
              className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-inkoust-2"
            >
              <i className="h-1.5 w-[22px] rounded-[3px] bg-[var(--b)]" aria-hidden="true" />
              {predmet.nazev}
            </h3>
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
          </section>
        )
      })}

      <ProfilSheet open={profilOtevren} onOpenChange={zmenProfilSheet} />
    </div>
  )
}
