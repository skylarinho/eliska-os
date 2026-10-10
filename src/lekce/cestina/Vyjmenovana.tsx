import { useMemo, useState, type FC } from 'react'
import { CZECH_EXERCISES } from '../../data/czechData'
import type { CzechExercise, LetterGroup } from '../../types/learning'
import { cz } from '../../lib/typo'
import { Dopsano } from '../Dopsano'
import { Lekce } from '../Lekce'
import { OdpovedTlacitko } from '../OdpovedTlacitko'
import type { PolozkaOvladani } from '../typy'

/** Které skupiny písmen patří do které lekce. */
export const VYJMENOVANA_SKUPINY: Record<string, LetterGroup[]> = {
  'cestina-vyjmenovana-b': ['B'],
  'cestina-vyjmenovana-l-m': ['L', 'M'],
  'cestina-vyjmenovana-p-s': ['P', 'S'],
  'cestina-vyjmenovana-v-z': ['V', 'Z'],
}

const MOZNOSTI: { pismeno: CzechExercise['correctAnswer']; popisek: string }[] = [
  { pismeno: 'i', popisek: 'měkké' },
  { pismeno: 'í', popisek: 'měkké' },
  { pismeno: 'y', popisek: 'tvrdé' },
  { pismeno: 'ý', popisek: 'tvrdé' },
]

/** Rozdělí větu s „__“ na text před slovem, slovo s mezerou a text za ním. */
function rozdelVetu(veta: string) {
  const [pred, , po] = cz(veta.replace('__', '_')).split(/(_)/)
  const posledniMezera = Math.max(pred.lastIndexOf(' '), pred.lastIndexOf(' ')) + 1
  const zacatekSlova = pred.slice(posledniMezera)
  const mezera = po.search(/[\s ]/)
  const konec = mezera < 0 ? po.length : mezera
  return {
    pred: pred.slice(0, posledniMezera),
    zacatekSlova,
    konecSlova: po.slice(0, konec),
    zbytek: po.slice(konec),
  }
}

const Uloha: FC<{ cviceni: CzechExercise } & PolozkaOvladani> = ({ cviceni, odpovez, odpovezeno }) => {
  const [zvoleno, setZvoleno] = useState<string | undefined>()
  const v = useMemo(() => rozdelVetu(cviceni.sentence), [cviceni.sentence])

  const vyber = (pismeno: string) => {
    if (odpovezeno) return
    setZvoleno(pismeno)
    const spravne = pismeno === cviceni.correctAnswer
    odpovez({
      spravne,
      nadpis: spravne ? 'Správně' : `Správně je ${cviceni.correctAnswer}`,
      text: cviceni.explanation,
      poznamka: `Kořen: ${cviceni.rootWord}`,
    })
  }

  return (
    <>
      {cviceni.isCatchWord && (
        <span className="mb-4 inline-block rounded-full border-[1.5px] border-oprava px-2.5 py-px text-[14px] text-oprava">
          Pozor, chyták
        </span>
      )}
      <p className="mb-3 min-h-[3em] text-[28px] leading-[1.45] font-medium text-pretty">
        {v.pred}
        <span className="whitespace-nowrap">
          {v.zacatekSlova}
          <Dopsano zvoleno={zvoleno} spravne={cviceni.correctAnswer} />
          {v.konecSlova}
        </span>
        {v.zbytek}
      </p>
      <div className="mt-7 grid grid-cols-4 gap-2.5">
        {MOZNOSTI.map(({ pismeno, popisek }) => (
          <OdpovedTlacitko
            key={pismeno}
            popisek={popisek}
            disabled={odpovezeno}
            stav={
              !odpovezeno
                ? null
                : pismeno === cviceni.correctAnswer
                  ? 'ok'
                  : pismeno === zvoleno
                    ? 'spatne'
                    : null
            }
            onClick={() => vyber(pismeno)}
          >
            {pismeno}
          </OdpovedTlacitko>
        ))}
      </div>
    </>
  )
}

interface VyjmenovanaProps {
  lekceId: string
  onZavrit: () => void
}

export const Vyjmenovana: FC<VyjmenovanaProps> = ({ lekceId, onZavrit }) => {
  const skupiny = VYJMENOVANA_SKUPINY[lekceId] ?? []
  const cviceni = useMemo(
    () => CZECH_EXERCISES.filter((c) => skupiny.includes(c.letterGroup)),
    [lekceId],
  )

  return (
    <Lekce id={lekceId} zadani="Doplň i, í, y, nebo ý" polozky={cviceni} onZavrit={onZavrit}>
      {(c, ovladani) => <Uloha cviceni={c} {...ovladani} />}
    </Lekce>
  )
}
