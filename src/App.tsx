import { useState } from 'react'
import { X } from 'lucide-react'
import { Sesit } from './components/Sesit'
import { Prehled } from './screens/Prehled'
import { HardwareLesson } from './components/lessons/HardwareLesson'
import { TimelineLesson } from './components/lessons/TimelineLesson'
import { ArtifactsLesson } from './components/lessons/ArtifactsLesson'
import { ShopGame } from './components/games/shop/ShopGame'
import { MathLab } from './components/games/math/MathLab'
import { CzechGame } from './components/games/czech/CzechGame'
import { EnglishGame } from './components/games/english/EnglishGame'

export function App() {
  const [lekceId, setLekceId] = useState<string | null>(null)
  const domu = () => setLekceId(null)

  return (
    <Sesit>
      {lekceId === null ? (
        <Prehled onStart={setLekceId} />
      ) : (
        <div className="pr-5 pt-12 pb-20 min-[700px]:pr-12 min-[700px]:pt-10">
          {/* Dočasná lišta, než vznikne společná kostra lekce (krok 5). */}
          <button
            type="button"
            onClick={domu}
            aria-label="Ukončit lekci"
            className="mb-6 grid h-12 w-12 place-items-center rounded-full border-2 border-inkoust-3 bg-papir"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={2.6} aria-hidden="true" />
          </button>
          {lekceId === 'lesson-hw' && <HardwareLesson onBack={domu} />}
          {lekceId === 'lesson-timeline' && <TimelineLesson onBack={domu} />}
          {lekceId === 'lesson-artifacts' && <ArtifactsLesson onBack={domu} />}
          {lekceId === 'game-shop' && <ShopGame onBack={domu} />}
          {lekceId === 'game-math' && <MathLab onBack={domu} />}
          {lekceId === 'game-czech' && <CzechGame onBack={domu} />}
          {lekceId === 'game-english' && <EnglishGame onBack={domu} />}
        </div>
      )}
    </Sesit>
  )
}

export default App
