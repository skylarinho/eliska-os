import { useRef, type FC } from 'react'
import { BottomSheet } from '@/components/arc/bottom-sheet/bottom-sheet'
import { Button } from '@/components/arc/button/button'
import { cz } from '../lib/typo'
import type { Odpoved } from './typy'

interface ZpetnaVazbaProps {
  odpoved: Odpoved | null
  tlacitko: string
  onDalsi: () => void
}

/** Zpětná vazba po odpovědi: „Správně“ zeleně, „Správně je …“ červeně, vysvětlení a jedno tlačítko. */
export const ZpetnaVazba: FC<ZpetnaVazbaProps> = ({ odpoved, tlacitko, onDalsi }) => {
  // Při zavírání sheet ještě chvíli doznívá, obsah proto držíme z poslední odpovědi.
  const posledni = useRef<Odpoved | null>(null)
  if (odpoved) posledni.current = odpoved
  const zobrazena = posledni.current

  return (
    <BottomSheet
      open={odpoved !== null}
      onOpenChange={(otevreno) => {
        if (!otevreno) onDalsi()
      }}
      title={zobrazena ? cz(zobrazena.nadpis) : ''}
      detents={[0.45]}
      closeLabel="Zavřít a pokračovat"
      className={zobrazena?.spravne ? 'zv-ok' : 'zv-spatne'}
    >
      {zobrazena && (
        <div className="pt-1">
          <p className="mb-[18px] text-[17px] leading-[1.55]">
            {cz(zobrazena.text)}
            {zobrazena.poznamka && (
              <span className="mt-1.5 block text-[15px] text-inkoust-2">{cz(zobrazena.poznamka)}</span>
            )}
          </p>
          <Button size="lg" className="w-full !text-[18px]" onClick={onDalsi} autoFocus>
            {tlacitko}
          </Button>
        </div>
      )}
    </BottomSheet>
  )
}
