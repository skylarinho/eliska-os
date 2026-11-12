import { useEffect, useMemo } from 'react'
import { Sesit } from './components/Sesit'
import { VSECHNY_LEKCE, lekcePodleId } from './data/lekce'
import { NavigaceLekceContext, type NavigaceLekce } from './lekce/navigace'
import { vykresliLekci } from './lekce/registr'
import { dalsiLekceVPredmetu } from './lib/dalsiLekce'
import { useTrasa } from './lib/trasa'
import { Predmet } from './screens/Predmet'
import { Prehled } from './screens/Prehled'
import { useProfileStore } from './store/useProfileStore'

export function App() {
  const { trasa, jdi, zpet, domu } = useTrasa()

  const klic = trasa.typ === 'lekce' ? trasa.id : trasa.typ === 'predmet' ? trasa.predmet : ''
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [trasa.typ, klic])

  const lekceId = trasa.typ === 'lekce' ? trasa.id : null
  const lekce = lekceId ? lekcePodleId(lekceId) : undefined

  // Další lekce se počítá při otevření lekce (ne po každé nové hvězdě), ať nabídka na výsledku neposkakuje.
  const dalsi = useMemo(() => {
    if (!lekceId) return null
    const hvezdy = useProfileStore.getState().getActiveProfile()?.hvezdy ?? {}
    return dalsiLekceVPredmetu(VSECHNY_LEKCE, lekceId, hvezdy)
  }, [lekceId])

  const navigace: NavigaceLekce | null = lekce
    ? {
        dalsi,
        onDalsi: () => dalsi && jdi({ typ: 'lekce', id: dalsi.id }, { nahradit: true }),
        onJinyPredmet: domu,
      }
    : null

  const zavritLekci = () => zpet(lekce ? { typ: 'predmet', predmet: lekce.predmet } : { typ: 'domu' })
  const obsahLekce = lekceId ? vykresliLekci(lekceId, zavritLekci) : null

  let obrazovka
  if (obsahLekce) {
    obrazovka = (
      <NavigaceLekceContext.Provider value={navigace} key={lekceId}>
        {obsahLekce}
      </NavigaceLekceContext.Provider>
    )
  } else if (trasa.typ === 'predmet') {
    obrazovka = (
      <Predmet
        predmet={trasa.predmet}
        onStart={(id) => jdi({ typ: 'lekce', id })}
        onZpet={() => zpet({ typ: 'domu' })}
      />
    )
  } else {
    obrazovka = (
      <Prehled onStart={(id) => jdi({ typ: 'lekce', id })} onPredmet={(predmet) => jdi({ typ: 'predmet', predmet })} />
    )
  }

  return <Sesit>{obrazovka}</Sesit>
}

export default App
