import { useState, useMemo, type FC } from 'react'
import { motion } from 'framer-motion'
import { CZECH_LETTERS, CZECH_EXERCISES } from '../../../data/czechData'
import type { CzechExercise, LetterGroup } from '../../../types/learning'
import { useProfileStore } from '../../../store/useProfileStore'
import { playClickSound, playCorrectSound, playWrongSound } from '../../../utils/audio'
import { FeedbackModal } from '../../common/FeedbackModal'
import { ArrowLeft } from 'lucide-react'

interface CzechGameProps {
  onBack: () => void
}

const VOWEL_OPTIONS: ('i' | 'í' | 'y' | 'ý')[] = ['i', 'í', 'y', 'ý']

export const CzechGame: FC<CzechGameProps> = ({ onBack }) => {
  const [selectedLetter, setSelectedLetter] = useState<LetterGroup>('B')
  const [exerciseIndex, setExerciseIndex] = useState(0)

  // Feedback modal
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

  const { addXp } = useProfileStore()
  const activeProfile = useProfileStore((state) => state.getActiveProfile())

  // Filter exercises by chosen letter
  const currentLetterExercises = useMemo(() => {
    return CZECH_EXERCISES.filter((ex) => ex.letterGroup === selectedLetter)
  }, [selectedLetter])

  const currentExercise: CzechExercise =
    currentLetterExercises[exerciseIndex] || currentLetterExercises[0]

  const handleSelectVowel = (vowel: 'i' | 'í' | 'y' | 'ý') => {
    const isCorrect = vowel === currentExercise.correctAnswer
    const xp = isCorrect ? 20 : 0

    if (isCorrect) {
      playCorrectSound()
      addXp(20)
    } else {
      playWrongSound()
    }

    setFeedback({
      isOpen: true,
      isCorrect,
      title: isCorrect ? '✅ SPRÁVNĚ! SKVĚLÁ ČEŠTINÁŘKA!' : '❌ POZOR NA CHYTÁK!',
      explanation: isCorrect
        ? `Výborně, milá ${activeProfile?.name || 'Eliško'}! Správně je „${currentExercise.missingWord}“. ${currentExercise.explanation}`
        : `Do věty patří „${currentExercise.missingWord}“ s písmenem ${currentExercise.correctAnswer.toUpperCase()}. ${currentExercise.explanation}`,
      hint: `Kořenové slovo: ${currentExercise.rootWord}.`,
      xpEarned: xp,
    })
  }

  const handleNextExercise = () => {
    setFeedback((prev) => ({ ...prev, isOpen: false }))
    if (exerciseIndex + 1 < currentLetterExercises.length) {
      setExerciseIndex((prev) => prev + 1)
    } else {
      setExerciseIndex(0)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-4 min-h-[calc(100dvh-130px)] flex flex-col justify-between">
      {/* Top Header */}
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

          <span className="text-xs font-black text-[#3e2723] bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Vyjmenovaná slova ✍️
          </span>
        </div>

        {/* Letter Group Selector Tabs (B, L, M, P, S, V, Z) */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7a5c43] block mb-1 px-1">
            Zvol si písmeno ze školy:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {CZECH_LETTERS.map((item) => (
              <button
                key={item.group}
                onClick={() => {
                  playClickSound()
                  setSelectedLetter(item.group)
                  setExerciseIndex(0)
                }}
                className={`min-w-[42px] min-h-[42px] rounded-xl font-black text-xs flex flex-col items-center justify-center transition-all touch-target shrink-0 border ${
                  selectedLetter === item.group
                    ? 'bg-[#7a5c43] text-white border-[#604430] shadow-sm'
                    : 'bg-white text-[#3e2723] border-[#ebdccb]'
                }`}
              >
                <span>{item.group}</span>
                <span className="text-[10px]">{item.icon}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sentence Card */}
      {currentExercise && (
        <div className="my-auto py-2 space-y-4">
          <div className="bg-[#fcfaf6] rounded-3xl p-5 border-2 border-[#ebdccb] shadow-xs text-center space-y-3">
            <div className="flex items-center justify-between border-b border-[#ebdccb] pb-1.5">
              <span className="text-[11px] font-black text-[#7a5c43]">
                Písmeno {selectedLetter} • Úloha {exerciseIndex + 1} z {currentLetterExercises.length}
              </span>
              {currentExercise.isCatchWord && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                  ⚠️ Pozor chyták!
                </span>
              )}
            </div>

            <span className="text-3xl block">📖</span>

            {/* Sentence with highlighted gap */}
            <p className="text-base sm:text-lg font-black text-[#3e2723] leading-relaxed">
              {currentExercise.sentence}
            </p>

            <p className="text-xs text-[#7a5c43] font-semibold">
              Které i / y do slova patří?
            </p>
          </div>

          {/* 4 Big Tactile Vowel Buttons (I / Í / Y / Ý) */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {VOWEL_OPTIONS.map((vowel) => (
              <motion.button
                key={vowel}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSelectVowel(vowel)}
                className="min-h-[58px] rounded-2xl bg-white hover:bg-amber-50/50 border-2 border-[#d8c3ad] border-b-[5px] border-b-[#7a5c43] active:border-b-2 active:translate-y-[3px] shadow-xs flex flex-col items-center justify-center text-2xl font-black text-[#3e2723] touch-target cursor-pointer"
              >
                <span>{vowel.toUpperCase()}</span>
                <span className="text-[10px] font-bold text-[#7a5c43] -mt-1">
                  {vowel === 'i' || vowel === 'í' ? 'měkké' : 'tvrdé'}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Instant Feedback Modal with Wombat Root Word Analysis */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        isCorrect={feedback.isCorrect}
        title={feedback.title}
        explanation={feedback.explanation}
        hint={feedback.hint}
        xpEarned={feedback.xpEarned}
        onNext={handleNextExercise}
        buttonText={feedback.isCorrect ? 'Další věta ➔' : 'Zkusit znovu 🔄'}
      />
    </div>
  )
}
