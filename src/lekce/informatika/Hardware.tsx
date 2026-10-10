import { useMemo, type FC } from 'react'
import { Cpu, Headphones, Keyboard, Mic, Monitor, Mouse, PcCase, Printer, Usb, type LucideIcon } from 'lucide-react'
import { HARDWARE_ITEMS } from '../../data/lessonsData'
import type { HardwareItem } from '../../data/lessonsData'
import { michej } from '../../lib/michej'
import { cz } from '../../lib/typo'
import { Lekce } from '../Lekce'
import { Vyber } from '../mechaniky/Vyber'
import type { PolozkaOvladani } from '../typy'

const IKONY: Record<string, LucideIcon> = {
  kb: Keyboard,
  mouse: Mouse,
  mic: Mic,
  monitor: Monitor,
  printer: Printer,
  headphones: Headphones,
  'pc-case': PcCase,
  flashdisk: Usb,
}

const Uloha: FC<{ vec: HardwareItem } & PolozkaOvladani> = ({ vec, odpovez, odpovezeno }) => {
  const Ikona = IKONY[vec.id] ?? Cpu
  // Dvě náhodné chybné možnosti + správná; Vyber je pak ještě zamíchá.
  const moznosti = useMemo(
    () => [vec.name, ...michej(HARDWARE_ITEMS.filter((h) => h.id !== vec.id)).slice(0, 2).map((h) => h.name)],
    [vec],
  )

  return (
    <>
      <div className="mb-6 grid h-28 w-28 place-items-center rounded-l border-2 border-inkoust-3 bg-papir">
        <Ikona className="h-16 w-16 text-inkoust" strokeWidth={2} role="img" aria-label="Obrázek zařízení" />
      </div>
      <p className="mb-5 text-[17px] text-inkoust-2">Nápověda: {cz(vec.hint)}</p>
      <Vyber
        moznosti={moznosti}
        spravna={vec.name}
        vysvetleni={vec.explanation}
        nadpisSpatne={(s) => `Na obrázku je ${s}`}
        odpovez={odpovez}
        odpovezeno={odpovezeno}
      />
    </>
  )
}

export const Hardware: FC<{ lekceId: string; onZavrit: () => void }> = ({ lekceId, onZavrit }) => (
  <Lekce id={lekceId} zadani="Co je na obrázku?" polozky={HARDWARE_ITEMS} onZavrit={onZavrit}>
    {(v, o) => <Uloha vec={v} {...o} />}
  </Lekce>
)
