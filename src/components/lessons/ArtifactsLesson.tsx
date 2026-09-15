import { useState, type FC } from 'react'
import { motion } from 'framer-motion'
import { HISTORY_ARTIFACTS, TIMELINE_EPOCHS, type HistoryArtifact } from '../../data/lessonsData'
import { useProfileStore } from '../../store/useProfileStore'
import { playCorrectSound, playWrongSound, playFanfareSound, playClickSound } from '../../utils/audio'
import { FeedbackModal } from '../common/FeedbackModal'
import { ArrowLeft, RotateCcw, CheckCircle, ChevronRight } from 'lucide-react'
import confetti from 'canvas-confetti'

interface ArtifactsLessonProps {
  onBack: () => void
}

export const ArtifactsLesson: FC<ArtifactsLessonProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<{
    isOpen: boolean
    isCorrect: boolean
    title: string
    explanation: string
    hint: string
    xpEarned: number
  }>({
    isOpen: false,
    isCorrect: false,
    title: '',
    explanation: '',
    hint: '',
    xpEarned: 0,
  })
  const [lessonFinished, setLessonFinished] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const { addXp, completeLesson } = useProfileStore()
  const activeProfile = useProfileStore((state) => state.getActiveProfile())
  const currentArtifact: HistoryArtifact = HISTORY_ARTIFACTS[currentIndex]

  const handleSelectEpoch = (epochId: string) => {
    const isCorrect =
      currentArtifact.correctEpochId === epochId ||
      (currentArtifact.id === 'art-candle' && (epochId === 'stredovek' || epochId === 'novovek'))

    const xp = isCorrect ? 20 : 0

    if (isCorrect) {
      playCorrectSound()
      addXp(20)
      setCorrectCount((prev) => prev + 1)
    } else {
      playWrongSound()
    }

    setFeedback({
      isOpen: true,
      isCorrect,
      title: isCorrect ? '✅ SPRÁVNĚ! VÝBORNĚ!' : '❌ TĚSNĚ VEDLE! NEVADÍ!',
      explanation: isCorrect
        ? `Správně! ${currentArtifact.didacticExplanation}`
        : `Pozor! Tento předmět patří do: ${currentArtifact.epochName}. ${currentArtifact.didacticExplanation}`,
      hint: currentArtifact.hint,
      xpEarned: xp,
    })
  }

  const handleNextArtifact = () => {
    setFeedback((prev) => ({ ...prev, isOpen: false }))
    if (currentIndex + 1 < HISTORY_ARTIFACTS.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setLessonFinished(true)
      playFanfareSound()
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } })
      completeLesson('lesson-artifacts', 60)
    }
  }

  const restartLesson = () => {
    playClickSound()
    setCurrentIndex(0)
    setCorrectCount(0)
    setLessonFinished(false)
  }

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-4 min-h-[calc(100dvh-130px)] flex flex-col justify-between">
      {/* Header bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              playClickSound()
              onBack()
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ebdccb]/80 hover:bg-[#ebdccb] text-xs font-bold text-[#7a5c43] touch-target"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zpět</span>
          </button>
          <div className="text-right">
            <span className="text-xs font-extrabold text-[#7a5c43] block">Artefakt</span>
            <span className="text-xs font-bold text-[#3e2723]">
              {Math.min(currentIndex + 1, HISTORY_ARTIFACTS.length)} / {HISTORY_ARTIFACTS.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#ebdccb] h-2.5 rounded-full overflow-hidden">
          <motion.div
            className="bg-[#059669] h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / HISTORY_ARTIFACTS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {!lessonFinished ? (
        <div className="my-auto py-2 space-y-3">
          {/* Question Exhibit Card (Distinct calm container) */}
          <motion.div
            key={currentArtifact.id}
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[#fcfaf6] rounded-3xl p-5 border-2 border-[#ebdccb] shadow-xs text-center"
          >
            <span className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#ebdccb]/80 text-[#7a5c43] mb-2.5">
              Historický artefakt pro {activeProfile?.name || 'Elišku'} 🏛️
            </span>

            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-2 text-6xl shadow-inner border-2 border-[#ebdccb]/60">
              {currentArtifact.icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#3e2723] tracking-tight">
              {currentArtifact.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#7a5c43] font-semibold mt-1">
              Do kterého z těchto 5 období patří?
            </p>
          </motion.div>

          {/* Epoch Action Buttons (Tactile chunky buttons with 3D bottom border) */}
          <div className="space-y-2 pt-1">
            {TIMELINE_EPOCHS.map((epoch) => (
              <motion.button
                key={epoch.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectEpoch(epoch.id)}
                className="w-full min-h-[52px] p-2.5 px-3.5 rounded-2xl bg-white hover:bg-amber-50/40 border-2 border-[#d8c3ad] border-b-[4px] border-b-[#7a5c43] active:border-b-2 active:translate-y-[2px] shadow-xs flex items-center justify-between text-left transition-all touch-target cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-[#ebdccb] group-hover:bg-[#d8c3ad] text-[#3e2723] font-black text-xs flex items-center justify-center shrink-0">
                    {epoch.order}.
                  </span>
                  <span className="text-2xl shrink-0">{epoch.icon}</span>
                  <div>
                    <span className="font-black text-[#3e2723] text-sm sm:text-base block leading-tight">
                      {epoch.name}
                    </span>
                    <span className="text-[10px] text-[#7a5c43] font-medium block">
                      {epoch.shortPeriod}
                    </span>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-[#f7f5f0] group-hover:bg-[#ebdccb]/60 flex items-center justify-center shrink-0 text-[#7a5c43]">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        /* Summary Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto bg-white rounded-3xl p-6 border-2 border-[#ebdccb] shadow-lg text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-[#3e2723]">Lekce splněna! 🪓</h2>
          <p className="text-sm text-[#7a5c43] font-medium">
            Milá {activeProfile?.name || 'Eliško'}, správně jsi určila <strong className="text-emerald-700 font-extrabold">{correctCount}</strong> z{' '}
            {HISTORY_ARTIFACTS.length} historických artefaktů. Získáváš <strong className="text-amber-600">+60 XP</strong>!
          </p>

          <div className="flex flex-col gap-2 pt-3">
            <button
              onClick={() => {
                playClickSound()
                onBack()
              }}
              className="w-full min-h-[48px] py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-base shadow-md active:scale-95 transition-transform"
            >
              Pokračovat na přehled lekcí 🐾
            </button>
            <button
              onClick={restartLesson}
              className="w-full min-h-[44px] py-2.5 rounded-2xl bg-[#ebdccb]/70 hover:bg-[#ebdccb] text-[#7a5c43] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Zopakovat lekci</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Instant Feedback modal with Wombat */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        isCorrect={feedback.isCorrect}
        title={feedback.title}
        explanation={feedback.explanation}
        hint={feedback.hint}
        xpEarned={feedback.xpEarned}
        onNext={handleNextArtifact}
      />
    </div>
  )
}
