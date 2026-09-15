import { useState, useEffect, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TIMELINE_EPOCHS, type TimelineEpoch } from '../../data/lessonsData'
import { useProfileStore } from '../../store/useProfileStore'
import { playCorrectSound, playWrongSound, playFanfareSound, playClickSound } from '../../utils/audio'
import { FeedbackModal } from '../common/FeedbackModal'
import { ArrowLeft, RotateCcw, Undo2, Check } from 'lucide-react'
import confetti from 'canvas-confetti'

interface TimelineLessonProps {
  onBack: () => void
}

export const TimelineLesson: FC<TimelineLessonProps> = ({ onBack }) => {
  // Pool of unplaced epochs
  const [availableEpochs, setAvailableEpochs] = useState<TimelineEpoch[]>([])
  // Slots on the timeline [0..4]
  const [placedEpochs, setPlacedEpochs] = useState<(TimelineEpoch | null)[]>([null, null, null, null, null])
  // Validation status
  const [isEvaluated, setIsEvaluated] = useState(false)
  const [feedback, setFeedback] = useState<{
    isOpen: boolean
    isCorrect: boolean
    explanation: string
    hint: string
    xpEarned: number
  }>({
    isOpen: false,
    isCorrect: false,
    explanation: '',
    hint: '',
    xpEarned: 0,
  })
  const [isCompleted, setIsCompleted] = useState(false)

  const { addXp, completeLesson } = useProfileStore()

  // Shuffle available epochs initially
  useEffect(() => {
    resetTimeline()
  }, [])

  const resetTimeline = () => {
    const shuffled = [...TIMELINE_EPOCHS].sort(() => Math.random() - 0.5)
    setAvailableEpochs(shuffled)
    setPlacedEpochs([null, null, null, null, null])
    setIsEvaluated(false)
    setIsCompleted(false)
  }

  // Place epoch into first free slot
  const handlePlaceEpoch = (epoch: TimelineEpoch) => {
    playClickSound()
    setIsEvaluated(false)
    const firstEmptyIndex = placedEpochs.findIndex((slot) => slot === null)
    if (firstEmptyIndex !== -1) {
      const nextPlaced = [...placedEpochs]
      nextPlaced[firstEmptyIndex] = epoch
      setPlacedEpochs(nextPlaced)
      setAvailableEpochs((prev) => prev.filter((e) => e.id !== epoch.id))
    }
  }

  // Return specific epoch back to drawer with ↩️
  const handleReturnEpoch = (index: number) => {
    playClickSound()
    setIsEvaluated(false)
    const epochToReturn = placedEpochs[index]
    if (epochToReturn) {
      const nextPlaced = [...placedEpochs]
      nextPlaced[index] = null
      setPlacedEpochs(nextPlaced)
      setAvailableEpochs((prev) => [...prev, epochToReturn])
    }
  }

  // Undo the last placed epoch
  const handleUndoLast = () => {
    playClickSound()
    setIsEvaluated(false)
    // Find last non-null index
    let lastIndex = -1
    for (let i = placedEpochs.length - 1; i >= 0; i--) {
      if (placedEpochs[i] !== null) {
        lastIndex = i
        break
      }
    }
    if (lastIndex !== -1) {
      handleReturnEpoch(lastIndex)
    }
  }

  // Check timeline order
  const handleEvaluate = () => {
    const isAllPlaced = placedEpochs.every((slot) => slot !== null)
    if (!isAllPlaced) return

    const correctOrderIds = ['pravek', 'starovek', 'stredovek', 'novovek', 'moderni']
    const currentOrderIds = placedEpochs.map((e) => e?.id)
    const isCorrect = currentOrderIds.every((id, idx) => id === correctOrderIds[idx])

    setIsEvaluated(true)

    if (isCorrect) {
      playCorrectSound()
      playFanfareSound()
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.55 } })
      addXp(50)
      completeLesson('lesson-timeline', 50)
      setIsCompleted(true)
      setFeedback({
        isOpen: true,
        isCorrect: true,
        explanation:
          'Fantastické! Poskládal(a) jsi celou historii přesně: 1. Pravěk ➔ 2. Starověk ➔ 3. Středověk ➔ 4. Novověk ➔ 5. Moderní doba. Vombat tě chválí!',
        hint: '',
        xpEarned: 50,
      })
    } else {
      playWrongSound()
      setFeedback({
        isOpen: true,
        isCorrect: false,
        explanation:
          'Některé epochy se nám trochu pomíchaly! Pamatuj na správné pořadí: Nejstarší je Pravěk (lovci mamutů), pak Starověk (Egypt & pyramidy), Středověk (rytíři), Novověk (páry & motory) a nakonec Moderní doba (dnešek). Klikni na ↩️ u chybných kartiček a zkus to napravit!',
        hint: 'Klikni na tlačítko ↩️ u kartičky a vrať ji zpátky do nabídky.',
        xpEarned: 0,
      })
    }
  }

  const allFilled = placedEpochs.every((slot) => slot !== null)
  const anyPlaced = placedEpochs.some((slot) => slot !== null)

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-4 min-h-[calc(100dvh-130px)] flex flex-col justify-between">
      {/* Header Bar */}
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

          <div className="flex items-center gap-1.5">
            {anyPlaced && !isCompleted && (
              <button
                onClick={handleUndoLast}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 border border-amber-200 touch-target"
                title="Vrátit poslední krok"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>↩️ Krok zpět</span>
              </button>
            )}
            <button
              onClick={() => {
                playClickSound()
                resetTimeline()
              }}
              className="p-1.5 rounded-xl bg-[#ebdccb]/60 hover:bg-[#ebdccb] text-[#7a5c43] touch-target"
              title="Začít znovu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/90 border border-[#ebdccb] rounded-2xl p-3 shadow-xs text-center">
          <h2 className="text-base sm:text-lg font-black text-[#3e2723]">
            Časová osa: Seřaď 5 epoch dějin ⏳
          </h2>
          <p className="text-xs text-[#7a5c43] mt-0.5">
            Klepni na období dole a umísti ho na osu. Tlačítkem <strong className="text-[#3e2723]">↩️</strong> můžeš kartu kdykoliv vrátit zpět!
          </p>
        </div>
      </div>

      {/* Timeline Slots Container */}
      <div className="my-3 space-y-2">
        <div className="relative border-l-4 border-[#b08968] ml-4 pl-3 space-y-2 py-1">
          {placedEpochs.map((slot, index) => {
            const expectedOrder = index + 1
            const isSlotCorrect = isEvaluated && slot && slot.order === expectedOrder
            const isSlotWrong = isEvaluated && slot && slot.order !== expectedOrder

            return (
              <div key={index} className="relative flex items-center gap-2">
                {/* Timeline connector dot */}
                <div
                  className={`-left-[21px] absolute w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black ${
                    slot ? 'bg-[#7a5c43] text-white' : 'bg-[#ebdccb] text-[#7a5c43]'
                  }`}
                >
                  {expectedOrder}
                </div>

                {slot ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex-1 min-h-[52px] p-2.5 rounded-2xl border-2 shadow-xs flex items-center justify-between transition-all ${
                      isSlotCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                        : isSlotWrong
                        ? 'bg-rose-50 border-rose-400 text-rose-950'
                        : 'bg-white border-[#ebdccb] text-[#3e2723]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{slot.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-[#7a5c43]">
                            {index + 1}. epocha:
                          </span>
                          <span className="text-sm font-black text-[#3e2723]">
                            {slot.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#7a5c43] font-medium block">
                          {slot.shortPeriod}
                        </span>
                      </div>
                    </div>

                    {/* Return to pool button ↩️ */}
                    {!isCompleted && (
                      <button
                        onClick={() => handleReturnEpoch(index)}
                        className="p-1.5 px-2 bg-[#ebdccb]/70 hover:bg-[#ebdccb] text-xs font-extrabold text-[#7a5c43] rounded-xl border border-[#d8c3ad] active:scale-90 transition-transform flex items-center gap-1 touch-target"
                        title="Vrátit období do osudí"
                        aria-label={`Vrátit ${slot.name} zpět`}
                      >
                        <span className="text-sm">↩️</span>
                        <span className="text-[10px] hidden xs:inline">Vrátit</span>
                      </button>
                    )}
                  </motion.div>
                ) : (
                  /* Empty Slot */
                  <div className="flex-1 min-h-[52px] border-2 border-dashed border-[#d8c3ad] rounded-2xl bg-[#f7f5f0]/70 flex items-center px-3.5 text-xs font-semibold text-[#7a5c43]/70">
                    <span>{expectedOrder}. epocha (klepni na období níže...)</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Drawer / Pool of Available Epochs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-[#7a5c43] uppercase tracking-wider">
            Osudí s epochami ({availableEpochs.length} zbývá):
          </span>
          {availableEpochs.length === 0 && !isCompleted && (
            <span className="text-xs font-bold text-emerald-700 animate-bounce">
              Vše na svém místě! Zkontroluj to 👇
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <AnimatePresence>
            {availableEpochs.map((epoch) => (
              <motion.button
                key={epoch.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlaceEpoch(epoch)}
                className="p-2.5 bg-white hover:bg-[#f7f5f0] border-2 border-[#ebdccb] rounded-2xl text-left shadow-xs flex items-center gap-2 touch-target"
              >
                <span className="text-2xl">{epoch.icon}</span>
                <div className="truncate">
                  <span className="text-xs font-black text-[#3e2723] block truncate">
                    {epoch.name}
                  </span>
                  <span className="text-[10px] text-[#7a5c43] font-medium block truncate">
                    {epoch.shortPeriod}
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Action Button: Evaluate or Continue */}
        <div className="pt-2">
          {!isCompleted ? (
            <button
              disabled={!allFilled}
              onClick={handleEvaluate}
              className={`w-full min-h-[48px] py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all touch-target ${
                allFilled
                  ? 'bg-[#059669] hover:bg-[#047857] text-white active:scale-98 shadow-emerald-700/25'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5" />
              <span>{allFilled ? 'Ověřit časovou osu! 🧭' : 'Doplň všechna období'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound()
                onBack()
              }}
              className="w-full min-h-[48px] py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-base shadow-md active:scale-98 transition-transform"
            >
              Zpět na přehled lekcí 🐾
            </button>
          )}
        </div>
      </div>

      {/* Feedback modal */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        isCorrect={feedback.isCorrect}
        explanation={feedback.explanation}
        hint={feedback.hint}
        xpEarned={feedback.xpEarned}
        onNext={() => setFeedback((prev) => ({ ...prev, isOpen: false }))}
        buttonText={feedback.isCorrect ? 'Skvělé, rozumím! 🎉' : 'Upravit kartičky ↩️'}
      />
    </div>
  )
}
