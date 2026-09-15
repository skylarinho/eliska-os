import { useState, useMemo, type FC } from 'react'
import { motion } from 'framer-motion'
import { ENGLISH_CATEGORIES, ENGLISH_PHRASES } from '../../../data/englishData'
import type { EnglishPhrase, EnglishCategory } from '../../../types/learning'
import { useProfileStore } from '../../../store/useProfileStore'
import { playClickSound, playCorrectSound, playWrongSound } from '../../../utils/audio'
import { FeedbackModal } from '../../common/FeedbackModal'
import { ArrowLeft, Volume2, ChevronRight } from 'lucide-react'

interface EnglishGameProps {
  onBack: () => void
}

export const EnglishGame: FC<EnglishGameProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<EnglishCategory>('greetings')
  const [phraseIndex, setPhraseIndex] = useState(0)

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

  // Filter phrases by category
  const categoryPhrases = useMemo(() => {
    return ENGLISH_PHRASES.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  const currentPhrase: EnglishPhrase = categoryPhrases[phraseIndex] || categoryPhrases[0]

  // Native Web Speech API speech synthesis
  const speakEnglish = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel() // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85 // Slightly slower and clear for children
      utterance.pitch = 1.1 // Friendly pleasant tone
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleSelectOption = (chosen: string) => {
    const isCorrect = chosen === currentPhrase.czech
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
      title: isCorrect ? '✅ EXCELLENT! SKVĚLÁ ANGLIČTINÁŘKA!' : '❌ ZKUSÍME TO ZNOVU!',
      explanation: isCorrect
        ? `Výborně, milá ${activeProfile?.name || 'Eliško'}! „${currentPhrase.english}“ znamená „${currentPhrase.czech}“. Čteme česky: ${currentPhrase.phonetic}.`
        : `Správný překlad slova „${currentPhrase.english}“ je „${currentPhrase.czech}“. Výslovnost: ${currentPhrase.phonetic}.`,
      hint: `Poslechni si výslovnost: ${currentPhrase.phonetic}.`,
      xpEarned: xp,
    })
  }

  const handleNextPhrase = () => {
    setFeedback((prev) => ({ ...prev, isOpen: false }))
    if (phraseIndex + 1 < categoryPhrases.length) {
      setPhraseIndex((prev) => prev + 1)
    } else {
      setPhraseIndex(0)
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
            Angličtina pro radost 🇬🇧
          </span>
        </div>

        {/* Category Tabs */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7a5c43] block mb-1 px-1">
            Vyber si téma slovíček:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {ENGLISH_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playClickSound()
                  setSelectedCategory(cat.id)
                  setPhraseIndex(0)
                }}
                className={`min-h-[38px] px-3 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all touch-target shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-[#7a5c43] text-white border-[#604430] shadow-sm'
                    : 'bg-white text-[#3e2723] border-[#ebdccb]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Flashcard with Native Speech Voice */}
      {currentPhrase && (
        <div className="my-auto py-2 space-y-4">
          <div className="bg-[#fcfaf6] rounded-3xl p-5 border-2 border-[#ebdccb] shadow-xs text-center space-y-3">
            <span className="text-[11px] font-black text-[#7a5c43] block">
              Karta {phraseIndex + 1} z {categoryPhrases.length}
            </span>

            <span className="text-5xl block select-none">{currentPhrase.emoji}</span>

            {/* Big English Word & Speaker Button */}
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#3e2723] tracking-tight">
                {currentPhrase.english}
              </h2>

              <button
                onClick={() => speakEnglish(currentPhrase.english)}
                className="w-11 h-11 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center shadow-xs active:scale-90 transition-transform touch-target"
                title="Přehrát anglickou výslovnost"
                aria-label="Přehrát výslovnost"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Czech Phonetic Pronunciation Badge in brackets */}
            <div className="inline-block bg-amber-50 border border-amber-300 rounded-full px-4 py-1 text-xs font-black text-amber-900 shadow-2xs">
              Čteme: <span className="text-amber-950 underline">{currentPhrase.phonetic}</span>
            </div>

            <p className="text-xs text-[#7a5c43] font-semibold">
              Co znamená toto slovíčko v češtině?
            </p>
          </div>

          {/* 3 Translation Answer Buttons */}
          <div className="space-y-2.5 pt-1">
            {currentPhrase.options.map((opt) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectOption(opt)}
                className="w-full min-h-[56px] p-3.5 rounded-2xl bg-white hover:bg-amber-50/50 border-2 border-[#d8c3ad] border-b-[5px] border-b-[#7a5c43] active:border-b-2 active:translate-y-[3px] shadow-xs flex items-center justify-between text-left transition-all touch-target cursor-pointer group"
              >
                <span className="text-base sm:text-lg font-black text-[#3e2723]">{opt}</span>
                <div className="w-7 h-7 rounded-lg bg-[#f7f5f0] group-hover:bg-[#ebdccb]/60 flex items-center justify-center shrink-0 text-[#7a5c43]">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Instant Feedback Modal */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        isCorrect={feedback.isCorrect}
        title={feedback.title}
        explanation={feedback.explanation}
        hint={feedback.hint}
        xpEarned={feedback.xpEarned}
        onNext={handleNextPhrase}
        buttonText={feedback.isCorrect ? 'Další slovíčko ➔' : 'Zkusit znovu 🔄'}
      />
    </div>
  )
}
