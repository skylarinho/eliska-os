import { useState, type FC } from 'react'
import { Check, X } from 'lucide-react'
import { cz } from '../../lib/typo'
import { OdpovedTlacitko } from '../OdpovedTlacitko'
import type { PolozkaOvladani } from '../typy'

interface AnoNeProps extends PolozkaOvladani {
  tvrzeni: { text: string; ano: boolean }[]
  vysvetleni: string
}

/** Tvrzení se ukazují po jednom, dítě odpovídá tlačítky Ano / Ne. Za hvězdu se počítá jen úplně správná sada. */
export const AnoNe: FC<AnoNeProps> = ({ tvrzeni, vysvetleni, odpovez }) => {
  const [odpovedi, setOdpovedi] = useState<boolean[]>([])
  const index = odpovedi.length
  const hotovo = index === tvrzeni.length

  const vyber = (ano: boolean) => {
    if (hotovo) return
    const dalsi = [...odpovedi, ano]
    setOdpovedi(dalsi)
    if (dalsi.length < tvrzeni.length) return
    const spatne = tvrzeni.filter((t, i) => t.ano !== dalsi[i])
    odpovez({
      spravne: spatne.length === 0,
      nadpis: spatne.length === 0 ? 'Správně' : 'Ne všechno sedí',
      text: vysvetleni,
      poznamka:
        spatne.length === 0
          ? undefined
          : spatne.map((t) => `„${t.text}“ – správně je ${t.ano ? 'ano' : 'ne'}`).join('. '),
    })
  }

  return (
    <>
      {odpovedi.length > 0 && (
        <ul className="mb-5 flex flex-col gap-2" aria-label="Zodpovězená tvrzení">
          {odpovedi.map((o, i) => {
            const ok = o === tvrzeni[i].ano
            return (
              <li
                key={i}
                className={`flex items-start gap-3 rounded-s border-2 px-3.5 py-2.5 text-[17px] ${
                  ok ? 'border-spravne bg-spravne-bg' : 'border-oprava bg-oprava-bg'
                }`}
              >
                {ok ? (
                  <Check className="mt-0.5 h-5 w-5 flex-none text-spravne" strokeWidth={2.6} aria-label="Správně" />
                ) : (
                  <X className="mt-0.5 h-5 w-5 flex-none text-oprava" strokeWidth={2.6} aria-label="Špatně" />
                )}
                <span>
                  {cz(tvrzeni[i].text)} <b>{o ? 'Ano' : 'Ne'}</b>
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {!hotovo && (
        <>
          <p className="mb-6 text-[24px] leading-[1.4] font-medium">{cz(tvrzeni[index].text)}</p>
          <div className="grid grid-cols-2 gap-2.5">
            <OdpovedTlacitko textClass="text-[24px]" onClick={() => vyber(true)}>
              Ano
            </OdpovedTlacitko>
            <OdpovedTlacitko textClass="text-[24px]" onClick={() => vyber(false)}>
              Ne
            </OdpovedTlacitko>
          </div>
        </>
      )}
    </>
  )
}
