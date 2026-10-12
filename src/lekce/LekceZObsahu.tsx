import { useState, type FC } from 'react'
import type { ObsahLekce, Otazka } from '../content/typy'
import { cz } from '../lib/typo'
import { Lekce } from './Lekce'
import { Vyklad } from './Vyklad'
import { AnoNe } from './mechaniky/AnoNe'
import { Razeni } from './mechaniky/Razeni'
import { Vice } from './mechaniky/Vice'
import { Vyber } from './mechaniky/Vyber'
import type { PolozkaOvladani } from './typy'

const ZADANI: Record<Otazka['typ'], string> = {
  vyber: 'Vyber správnou odpověď',
  vice: 'Vyber všechny správné odpovědi',
  'ano-ne': 'Pravda, nebo ne?',
  razeni: 'Seřaď podle pořadí',
  prirazeni: 'Vyber správnou odpověď',
}

const Uloha: FC<{ otazka: Otazka } & PolozkaOvladani> = ({ otazka: o, odpovez, odpovezeno }) => (
  <>
    {o.chytak && (
      <span className="mb-4 inline-block rounded-full border-[1.5px] border-oprava px-2.5 py-px text-[14px] text-oprava">
        Pozor, chyták
      </span>
    )}
    {o.typ !== 'ano-ne' && (
      <p className="mb-3 text-[24px] leading-[1.4] font-medium text-pretty">{cz(o.otazka)}</p>
    )}
    {o.napoveda && <p className="mb-5 text-[16px] text-inkoust-2">Nápověda: {cz(o.napoveda)}</p>}
    {o.typ === 'vyber' || o.typ === 'prirazeni' ? (
      <Vyber
        moznosti={o.moznosti}
        spravna={o.spravna}
        vysvetleni={o.vysvetleni}
        odpovez={odpovez}
        odpovezeno={odpovezeno}
      />
    ) : o.typ === 'vice' ? (
      <Vice
        moznosti={o.moznosti}
        spravne={o.spravne}
        vysvetleni={o.vysvetleni}
        odpovez={odpovez}
        odpovezeno={odpovezeno}
      />
    ) : o.typ === 'ano-ne' ? (
      <AnoNe tvrzeni={o.tvrzeni} vysvetleni={o.vysvetleni} odpovez={odpovez} odpovezeno={odpovezeno} />
    ) : (
      <Razeni
        polozky={o.polozky.map((nazev) => ({ id: nazev, nazev }))}
        vysvetleni={o.vysvetleni}
        odpovez={odpovez}
        odpovezeno={odpovezeno}
      />
    )}
  </>
)

export const LekceZObsahu: FC<{ lekce: ObsahLekce; onZavrit: () => void }> = ({ lekce, onZavrit }) => {
  // Výklad jen poprvé; „Zkusit znovu“ už rovnou začne otázkami.
  const [vykladHotov, setVykladHotov] = useState(!lekce.vyklad)
  if (!vykladHotov && lekce.vyklad) {
    return <Vyklad karty={lekce.vyklad} onHotovo={() => setVykladHotov(true)} onZavrit={onZavrit} />
  }
  return (
    <Lekce id={lekce.id} zadani={(o) => ZADANI[o.typ]} polozky={lekce.otazky} onZavrit={onZavrit}>
      {(o, ovladani) => <Uloha otazka={o} {...ovladani} />}
    </Lekce>
  )
}
