import { useEffect, useState } from 'react'
import { Sesit } from './components/Sesit'
import { vykresliLekci } from './lekce/registr'
import { Prehled } from './screens/Prehled'

export function App() {
  const [lekceId, setLekceId] = useState<string | null>(null)
  const domu = () => setLekceId(null)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [lekceId])
  const lekce = lekceId === null ? null : vykresliLekci(lekceId, domu)

  return <Sesit>{lekce ?? <Prehled onStart={setLekceId} />}</Sesit>
}

export default App
