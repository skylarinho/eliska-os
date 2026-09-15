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
import { Smartphone, Monitor } from 'lucide-react'

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

  // Desktop helper: preview as iPhone 12 mini (375x812) or responsive width
  const [isPhoneFrame, setIsPhoneFrame] = useState(false)

  const checkAndRecordActivity = useProfileStore((state) => state.checkAndRecordActivity)

  useEffect(() => {
    checkAndRecordActivity()
  }, [checkAndRecordActivity])

  return (
    <div
      className={`min-h-[100dvh] w-full bg-[#f7f5f0] text-[#3e2723] flex flex-col items-center selection:bg-[#ebdccb] ${
        isPhoneFrame ? 'py-4 sm:py-8 bg-stone-300' : ''
      }`}
    >
      {/* Optional Desktop Preview Bar (visible on wider screens) */}
      <div className="hidden md:flex items-center gap-2 mb-3 bg-white/90 border border-[#d8c3ad] px-3 py-1.5 rounded-full shadow-xs text-xs font-semibold text-[#7a5c43]">
        <span>Pohled:</span>
        <button
          onClick={() => setIsPhoneFrame(false)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
            !isPhoneFrame ? 'bg-[#7a5c43] text-white' : 'hover:bg-stone-100 text-[#3e2723]'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Responzivní</span>
        </button>
        <button
          onClick={() => setIsPhoneFrame(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
            isPhoneFrame ? 'bg-[#7a5c43] text-white' : 'hover:bg-stone-100 text-[#3e2723]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iPhone 12 mini (375 × 812)</span>
        </button>
      </div>

      {/* Main Container: Tuned strictly for iPhone 12 mini (375px width base) */}
      <div
        className={`w-full bg-[#f7f5f0] flex flex-col justify-between transition-all ${
          isPhoneFrame
            ? 'max-w-[375px] min-h-[812px] h-[812px] rounded-[44px] shadow-2xl border-8 border-stone-800 overflow-y-auto relative'
            : 'max-w-md min-h-[100dvh]'
        }`}
      >
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
    </div>
  )
}

export default App
