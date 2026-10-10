import { useMemo, useState, type FC } from 'react'
import { Volume2 } from 'lucide-react'
import { Button } from '@/components/arc/button/button'
import { ENGLISH_PHRASES } from '../../data/englishData'
import type { EnglishPhrase } from '../../types/learning'
import { michej } from '../../lib/michej'
import { cz } from '../../lib/typo'
import { Lekce } from '../Lekce'
import { SLOVICKA_OKRUHY } from '../skupiny'
import { OdpovedTlacitko } from '../OdpovedTlacitko'
import type { PolozkaOvladani } from '../typy'

function rekni(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const v = new SpeechSynthesisUtterance(text)
  v.lang = 'en-US'
  v.rate = 0.85
  window.speechSynthesis.speak(v)
}

const Uloha: FC<{ slovicko: EnglishPhrase } & PolozkaOvladani> = ({ slovicko: s, odpovez, odpovezeno }) => {
  const [zvoleno, setZvoleno] = useState<string | null>(null)
  const moznosti = useMemo(() => michej(s.options), [s])

  const vyber = (m: string) => {
    if (odpovezeno) return
    setZvoleno(m)
    const spravne = m === s.czech
    odpovez({
      spravne,
      nadpis: spravne ? 'Správně' : `Správně je ${s.czech}`,
      text: `„${s.english}“ znamená „${s.czech}“.`,
      poznamka: `Čteme česky: ${s.phonetic}`,
    })
  }

  return (
    <>
      <p className="mb-1 text-[28px] leading-[1.3] font-medium">{s.english}</p>
      <p className="mb-4 text-[17px] text-inkoust-2">{s.phonetic}</p>
      <Button variant="secondary" size="lg" className="mb-7" onClick={() => rekni(s.english)}>
        <Volume2 className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        Poslechnout
      </Button>
      <div className="flex flex-col gap-2.5">
        {moznosti.map((m) => (
          <OdpovedTlacitko
            key={m}
            textClass="text-[20px]"
            disabled={odpovezeno}
            stav={!odpovezeno ? null : m === s.czech ? 'ok' : m === zvoleno ? 'spatne' : null}
            onClick={() => vyber(m)}
          >
            {cz(m)}
          </OdpovedTlacitko>
        ))}
      </div>
    </>
  )
}

export const Slovicka: FC<{ lekceId: string; onZavrit: () => void }> = ({ lekceId, onZavrit }) => {
  const okruhy = SLOVICKA_OKRUHY[lekceId]
  const polozky = useMemo(
    () => ENGLISH_PHRASES.filter((p) => okruhy?.includes(p.category)),
    [okruhy],
  )
  return (
    <Lekce id={lekceId} zadani="Poslechni si slovo a vyber český překlad" polozky={polozky} onZavrit={onZavrit}>
      {(s, o) => <Uloha slovicko={s} {...o} />}
    </Lekce>
  )
}
