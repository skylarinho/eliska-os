import { useState, useEffect } from 'react'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { LessonSelector } from './components/lessons/LessonSelector'
import { HardwareLesson } from './components/lessons/HardwareLesson'
import { TimelineLesson } from './components/lessons/TimelineLesson'
import { ArtifactsLesson } from './components/lessons/ArtifactsLesson'
import { ShopGame } from './components/games/shop/ShopGame'
import { MathLab } from './components/games/math/MathLab'
import { CzechGame } from './components/games/czech/CzechGame'
import { EnglishGame } from './components/games/english/EnglishGame'
import { ProfileSelectorModal } from './components/profile/ProfileSelectorModal'
import { useProfileStore } from './store/useProfileStore'
import { Sesit } from './components/Sesit'

type AppView =
  | 'dashboard'
  | 'lesson-hw'
  | 'lesson-timeline'
  | 'lesson-artifacts'
  | 'game-shop'
  | 'game-math'
  | 'game-czech'
  | 'game-english'

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)


  const checkAndRecordActivity = useProfileStore((state) => state.checkAndRecordActivity)

  useEffect(() => {
    checkAndRecordActivity()
  }, [checkAndRecordActivity])

  return (
    <Sesit>
      <div className="flex min-h-[100dvh] flex-col justify-between">
        {/* Header */}
        <Header
          onOpenProfile={() => setIsProfileModalOpen(true)}
          currentView={currentView}
          onBackToDashboard={() => setCurrentView('dashboard')}
          viewProgress={
            currentView === 'lesson-hw'
              ? 'Hardware'
              : currentView === 'lesson-timeline'
              ? 'Časová osa'
              : currentView === 'lesson-artifacts'
              ? 'Artefakty'
              : currentView === 'game-shop'
              ? 'Obchůdek'
              : currentView === 'game-math'
              ? 'Matematika'
              : currentView === 'game-czech'
              ? 'Čeština'
              : currentView === 'game-english'
              ? 'Angličtina'
              : undefined
          }
        />

        {/* View Routing */}
        <main className="flex-1 flex flex-col justify-start">
          {currentView === 'dashboard' && (
            <LessonSelector onSelectLesson={(id) => setCurrentView(id as AppView)} />
          )}

          {/* 1. Etapa: Informatika & Vlastivěda */}
          {currentView === 'lesson-hw' && (
            <HardwareLesson onBack={() => setCurrentView('dashboard')} />
          )}

          {currentView === 'lesson-timeline' && (
            <TimelineLesson onBack={() => setCurrentView('dashboard')} />
          )}

          {currentView === 'lesson-artifacts' && (
            <ArtifactsLesson onBack={() => setCurrentView('dashboard')} />
          )}

          {/* 2. Etapa: Hravá doučovací zóna */}
          {currentView === 'game-shop' && (
            <ShopGame onBack={() => setCurrentView('dashboard')} />
          )}

          {currentView === 'game-math' && (
            <MathLab onBack={() => setCurrentView('dashboard')} />
          )}

          {currentView === 'game-czech' && (
            <CzechGame onBack={() => setCurrentView('dashboard')} />
          )}

          {currentView === 'game-english' && (
            <EnglishGame onBack={() => setCurrentView('dashboard')} />
          )}
        </main>

        {/* Personal Footer */}
        <Footer onOpenProfileSelector={() => setIsProfileModalOpen(true)} />

        {/* Modals */}
        <ProfileSelectorModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />

      </div>
    </Sesit>
  )
}

export default App
