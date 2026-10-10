import type { FC } from 'react'
import { TIMELINE_EPOCHS } from '../../data/lessonsData'
import { Lekce } from '../Lekce'
import { Razeni } from '../mechaniky/Razeni'

const EPOCHY = [...TIMELINE_EPOCHS]
  .sort((a, b) => a.order - b.order)
  .map((e) => ({ id: e.id, nazev: e.name, popis: e.shortPeriod }))

export const CasovaOsa: FC<{ lekceId: string; onZavrit: () => void }> = ({ lekceId, onZavrit }) => (
  <Lekce id={lekceId} zadani="Seřaď epochy od nejstarší po nejmladší" polozky={[EPOCHY]} onZavrit={onZavrit}>
    {(polozky, o) => (
      <Razeni
        polozky={polozky}
        vysvetleni="Nejstarší je pravěk, nejmladší moderní doba."
        odpovez={o.odpovez}
        odpovezeno={o.odpovezeno}
      />
    )}
  </Lekce>
)
