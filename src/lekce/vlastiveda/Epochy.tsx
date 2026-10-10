import type { FC } from 'react'
import { HISTORY_ARTIFACTS, TIMELINE_EPOCHS } from '../../data/lessonsData'
import type { HistoryArtifact } from '../../data/lessonsData'
import { cz } from '../../lib/typo'
import { Lekce } from '../Lekce'
import { Vyber } from '../mechaniky/Vyber'
import type { PolozkaOvladani } from '../typy'

const NAZVY = TIMELINE_EPOCHS.map((e) => e.name)

const Uloha: FC<{ predmet: HistoryArtifact } & PolozkaOvladani> = ({ predmet, odpovez, odpovezeno }) => {
  const spravna = TIMELINE_EPOCHS.find((e) => e.id === predmet.correctEpochId)?.name ?? predmet.epochName
  return (
    <>
      <p className="mb-2 text-[28px] leading-[1.3] font-medium">{cz(predmet.name)}</p>
      <p className="mb-6 text-[17px] text-inkoust-2">Nápověda: {cz(predmet.hint)}</p>
      <Vyber
        moznosti={NAZVY}
        spravna={spravna}
        vysvetleni={predmet.didacticExplanation}
        dalsiSpravne={predmet.id === 'art-candle' ? ['Starověk', 'Novověk'] : []}
        nadpisSpatne={(s) => `Správně je ${s}`}
        odpovez={odpovez}
        odpovezeno={odpovezeno}
      />
    </>
  )
}

export const Epochy: FC<{ lekceId: string; onZavrit: () => void }> = ({ lekceId, onZavrit }) => (
  <Lekce id={lekceId} zadani="Do které epochy předmět patří?" polozky={HISTORY_ARTIFACTS} onZavrit={onZavrit}>
    {(p, o) => <Uloha predmet={p} {...o} />}
  </Lekce>
)
