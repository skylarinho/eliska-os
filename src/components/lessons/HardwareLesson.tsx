import { useState, useMemo, type FC } from 'react'
import { motion } from 'framer-motion'
import { HARDWARE_ITEMS, type HardwareItem } from '../../data/lessonsData'
import { useProfileStore } from '../../store/useProfileStore'
import { playCorrectSound, playWrongSound, playFanfareSound, playClickSound } from '../../utils/audio'
import { FeedbackModal } from '../common/FeedbackModal'
import { HardwareIcon } from './HardwareIcon'
import { ArrowLeft, RotateCcw, CheckCircle, ChevronRight } from 'lucide-react'
import confetti from 'canvas-confetti'

interface HardwareLessonProps {
  onBack: () => void
}

const OPTION_LETTERS = ['A', 'B', 'C']

export const HardwareLesson: FC<HardwareLessonProps> = ({ onBack }) => {
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
  const currentItem: HardwareItem = HARDWARE_ITEMS[currentIndex]

  // Generate 3 choices (1 correct + 2 distractors) for the current item
  const choices = useMemo(() => {
    if (!currentItem) return []
    const otherItems = HARDWARE_ITEMS.filter((item) => item.id !== currentItem.id)
    const shuffledOthers = [...otherItems].sort(() => Math.random() - 0.5)
    const distractors = shuffledOthers.slice(0, 2)
    const allThree = [currentItem, ...distractors]
    return allThree.sort(() => Math.random() - 0.5)
  }, [currentIndex, currentItem])

  const handleSelectChoice = (selectedItem: HardwareItem) => {
    const isCorrect = selectedItem.id === currentItem.id
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
      title: isCorrect
        ? `✅ SPRÁVNĚ! JE TO ${currentItem.name.toUpperCase()}!`
        : `❌ TĚSNĚ VEDLE! NEVADÍ!`,
      explanation: isCorrect
        ? `Výborně! ${currentItem.explanation}`
        : `Na obrázku je ${currentItem.name}. ${currentItem.explanation}`,
      hint: currentItem.hint,
      xpEarned: xp,
    })
  }

  const handleNextQuestion = () => {
    setFeedback((prev) => ({ ...prev, isOpen: false }))
    if (currentIndex + 1 < HARDWARE_ITEMS.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // Finished entire lesson!
      setLessonFinished(true)
      playFanfareSound()
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
      completeLesson('lesson-hw', 50)
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
            <span className="text-xs font-extrabold text-[#7a5c43] block">Otázka</span>
            <span className="text-xs font-bold text-[#3e2723]">
              {Math.min(currentIndex + 1, HARDWARE_ITEMS.length)} / {HARDWARE_ITEMS.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#ebdccb] h-2.5 rounded-full overflow-hidden">
          <motion.div
            className="bg-[#059669] h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / HARDWARE_ITEMS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {!lessonFinished ? (
        <div className="my-auto py-2 space-y-4">
          {/* Question Exhibit Card (Distinct calm container) */}
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[#fcfaf6] rounded-3xl p-5 border-2 border-[#ebdccb] shadow-xs text-center relative overflow-hidden"
          >
            {/* Question Label */}
            <span className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#ebdccb]/80 text-[#7a5c43] mb-3">
              Úkol pro školačku {activeProfile?.name || 'Elišku'} 🔍
            </span>

            {/* Exhibit Box with HardwareIcon */}
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-3xl mb-3 shadow-inner border-2 border-[#ebdccb]/60">
              <HardwareIcon itemId={currentItem.id} emojiFallback={currentItem.icon} size="lg" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#3e2723] tracking-tight">
              Poznáš, co je na obrázku? 🤔
            </h2>
            <p className="text-xs sm:text-sm text-[#7a5c43] font-semibold mt-1">
              Vyber správné tlačítko ze tří možností dole:
            </p>
          </motion.div>

          {/* Answer Action Buttons (Tactile chunky buttons with 3D bottom border) */}
          <div className="space-y-3 pt-1">
            {choices.map((choice, idx) => (
              <motion.button
                key={choice.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectChoice(choice)}
                className="w-full min-h-[62px] p-3.5 rounded-2xl bg-white hover:bg-amber-50/40 border-2 border-[#d8c3ad] border-b-[5px] border-b-[#7a5c43] active:border-b-2 active:translate-y-[3px] shadow-sm flex items-center justify-between text-left transition-all touch-target cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Badge A, B, C */}
                  <span className="w-8 h-8 rounded-xl bg-[#ebdccb] group-hover:bg-[#d8c3ad] text-[#3e2723] font-black text-sm flex items-center justify-center shrink-0 shadow-2xs transition-colors">
                    {OPTION_LETTERS[idx]}
                  </span>

                  {/* Icon & Name */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <HardwareIcon itemId={choice.id} emojiFallback={choice.icon} size="sm" />
                    <span className="font-black text-[#3e2723] text-base sm:text-lg truncate">
                      {choice.name}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-[#f7f5f0] group-hover:bg-[#ebdccb]/60 flex items-center justify-center shrink-0 text-[#7a5c43] ml-2">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        /* Summary Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto bg-white rounded-3xl p-6 border-2 border-[#ebdccb] shadow-lg text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-[#3e2723]">Všechny součástky poznány! 🎉</h2>
          <p className="text-sm text-[#7a5c43] font-medium">
            Milá {activeProfile?.name || 'Eliško'}, správně jsi poznala <strong className="text-emerald-700 font-extrabold">{correctCount}</strong> z{' '}
            {HARDWARE_ITEMS.length} počítačových pomocníků. Získáváš bonusových <strong className="text-amber-600">+50 XP</strong>!
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
              <span>Zopakovat poznávání</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Instant Feedback Modal with Wombat & Didactic Explanation */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        isCorrect={feedback.isCorrect}
        title={feedback.title}
        explanation={feedback.explanation}
        hint={feedback.hint}
        xpEarned={feedback.xpEarned}
        onNext={handleNextQuestion}
      />
    </div>
  )
}
