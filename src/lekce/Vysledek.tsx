import type { FC } from 'react'
import { Button } from '@/components/arc/button/button'
import { Hvezda } from '../components/Hvezdy'
import { Vombat } from '../components/Vombat'
import { dnesISO } from '../lib/datum'
import { aktualniSerie } from '../lib/postup'
import { cz, pocet } from '../lib/typo'
import { useProfileStore } from '../store/useProfileStore'

interface VysledekProps {
  spravne: number
  celkem: number
  /** Hvězdy získané právě teď (0–3). */
  hvezdy: number
  onDomu: () => void
  onZnovu: () => void
}

export const Vysledek: FC<VysledekProps> = ({ spravne, celkem, hvezdy, onDomu, onZnovu }) => {
  const profil = useProfileStore((s) => s.getActiveProfile())
  const serie = profil ? aktualniSerie(profil.serie, dnesISO()) : 0

  return (
    <div className="pt-10 text-center">
      <Vombat stav="radost" className="mx-auto mb-2.5 block w-[130px]" />
      <h1 className="mb-1.5 text-[32px] leading-tight font-bold">{cz(`Hotovo, ${profil?.vokativ ?? 'Eliško'}`)}</h1>
      <p className="mb-[26px] text-inkoust-2">{cz(`${spravne} ze ${celkem} správně`)}</p>
      <div
        className="mb-[30px] flex justify-center gap-3"
        role="img"
        aria-label={`${hvezdy} ze 3 hvězd`}
      >
        {[0, 1, 2].map((k) => (
          <Hvezda key={k} plna={k < hvezdy} className={`h-[58px] w-[58px] ${k < hvezdy ? 'hvezda-zap' : ''}`} />
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        <Button size="lg" className="w-full !text-[18px]" onClick={onDomu}>
          Zpět na přehled
        </Button>
        <Button size="lg" variant="secondary" className="w-full !text-[18px]" onClick={onZnovu}>
          Zkusit znovu
        </Button>
      </div>
      {serie > 0 && (
        <p className="mt-[22px] text-[15px] text-inkoust-2">
          Série: {pocet(serie, ['den', 'dny', 'dní'])} v{' '}řadě
        </p>
      )}
    </div>
  )
}
