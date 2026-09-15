import { useState, type FC } from 'react'
import { motion } from 'framer-motion'
import { DECOMPOSITION_EXERCISES, MULTIPLICATION_DUELS } from '../../../data/mathData'
import type { DecompositionStep, MultiplicationDuel } from '../../../types/learning'
import { useProfileStore } from '../../../store/useProfileStore'
import {
  playClickSound,
  playCorrectSound,
  playWrongSound,
  playFanfareSound,
} from '../../../utils/audio'
import { FeedbackModal } from '../../common/FeedbackModal'
import { ArrowLeft, Check } from 'lucide-react'
import confetti from 'canvas-confetti'

interface MathLabProps {
  onBack: () => void
}

export const MathLab: FC<MathLabProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'decomp' | 'mult'>('decomp')

  // Decomposition state
  const [decompIndex, setDecompIndex] = useState(0)
  const [userSumTens, setUserSumTens] = useState('')
  const [userSumOnes, setUserSumOnes] = useState('')
  const [userTotal, setUserTotal] = useState('')

  // Multiplication state
  const [multIndex, setMultIndex] = useState(0)

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

  const currentDecomp: DecompositionStep = DECOMPOSITION_EXERCISES[decompIndex]
  const currentMult: MultiplicationDuel = MULTIPLICATION_DUELS[multIndex]

  // Verify Decomposition step
  const handleVerifyDecomp = () => {
    const isTensOk = parseInt(userSumTens, 10) === currentDecomp.sumTens
    const isOnesOk = parseInt(userSumOnes, 10) === currentDecomp.sumOnes
    const isTotalOk = parseInt(userTotal, 10) === currentDecomp.total

    const isAllCorrect = isTensOk && isOnesOk && isTotalOk

    if (isAllCorrect) {
      playCorrectSound()
      addXp(25)
      setFeedback({
        isOpen: true,
        isCorrect: true,
        title: '✅ VÝBORNĚ! ROZKLAD ZVLÁDNUT!',
        explanation: `Skvělá práce, milá ${activeProfile?.name || 'Eliško'}! ${currentDecomp.numA} + ${currentDecomp.numB} = (${currentDecomp.tensA} + ${currentDecomp.tensB}) + (${currentDecomp.onesA} + ${currentDecomp.onesB}) = ${currentDecomp.sumTens} + ${currentDecomp.sumOnes} = ${currentDecomp.total}.`,
        hint: '',
        xpEarned: 25,
      })
    } else {
      playWrongSound()
      setFeedback({
        isOpen: true,
        isCorrect: false,
        title: '❌ ZKONTROLUJEME SOUČET!',
        explanation: `Desítky: ${currentDecomp.tensA} + ${currentDecomp.tensB} = ${currentDecomp.sumTens}. Jednotky: ${currentDecomp.onesA} + ${currentDecomp.onesB} = ${currentDecomp.sumOnes}. Celkem: ${currentDecomp.sumTens} + ${currentDecomp.sumOnes} = ${currentDecomp.total}.`,
        hint: 'Zkus nejdříve sečíst celé desítky a potom jednotky.',
        xpEarned: 0,
      })
    }
  }

  const handleNextDecomp = () => {
    setFeedback((prev) => ({ ...prev, isOpen: false }))
    setUserSumTens('')
    setUserSumOnes('')
    setUserTotal('')
    if (decompIndex + 1 < DECOMPOSITION_EXERCISES.length) {
      setDecompIndex((prev) => prev + 1)
    } else {
      playFanfareSound()
      confetti({ particleCount: 70, spread: 60 })
      setDecompIndex(0)
    }
  }

  // Handle Multiplication choice
  const handleSelectMult = (ans: number) => {
    const isCorrect = ans === currentMult.product

    if (isCorrect) {
      playCorrectSound()
      addXp(20)
      setFeedback({
        isOpen: true,
        isCorrect: true,
        title: '✅ PŘESNÝ ZÁSAH V NÁSOBILCE!',
        explanation: `Správně! ${currentMult.factorA} × ${currentMult.factorB} = ${currentMult.product}. Představ si ${currentMult.factorA} řádků po ${currentMult.factorB} kuličkách.`,
        hint: '',
        xpEarned: 20,
      })
    } else {
      playWrongSound()
      setFeedback({
        isOpen: true,
        isCorrect: false,
        title: '❌ TĚSNĚ VEDLE!',
        explanation: `${currentMult.factorA} × ${currentMult.factorB} je rovno ${currentMult.product}. Zkus spočítat tečky na mřížce!`,
        hint: `Spočítej ${currentMult.factorA} krát číslo ${currentMult.factorB}.`,
        xpEarned: 0,
      })
    }
  }

  const handleNextMult = () => {
    setFeedback((prev) => ({ ...prev, isOpen: false }))
    if (multIndex + 1 < MULTIPLICATION_DUELS.length) {
      setMultIndex((prev) => prev + 1)
    } else {
      playFanfareSound()
      confetti({ particleCount: 70, spread: 60 })
      setMultIndex(0)
    }
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

          <span className="text-xs font-black text-[#3e2723] bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Matematická laboratoř 🧪
          </span>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              playClickSound()
              setActiveTab('decomp')
            }}
            className={`py-2 rounded-2xl font-black text-xs transition-all touch-target ${
              activeTab === 'decomp'
                ? 'bg-[#7a5c43] text-white shadow-md'
                : 'bg-white text-[#7a5c43] border border-[#ebdccb]'
            }`}
          >
            1. Rozklad na desítky 🧩
          </button>
          <button
            onClick={() => {
              playClickSound()
              setActiveTab('mult')
            }}
            className={`py-2 rounded-2xl font-black text-xs transition-all touch-target ${
              activeTab === 'mult'
                ? 'bg-[#7a5c43] text-white shadow-md'
                : 'bg-white text-[#7a5c43] border border-[#ebdccb]'
            }`}
          >
            2. Násobilková stezka ✖️
          </button>
        </div>
      </div>

      {/* TAB 1: DECOMPOSITION */}
      {activeTab === 'decomp' && (
        <div className="my-auto py-2 space-y-3">
          {/* Main Equation Box */}
          <div className="bg-[#fcfaf6] rounded-3xl p-5 border-2 border-[#ebdccb] shadow-xs text-center space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#7a5c43] block">
              Příklad {decompIndex + 1} / {DECOMPOSITION_EXERCISES.length}
            </span>

            <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border-2 border-[#ebdccb] shadow-inner text-2xl sm:text-3xl font-black text-[#3e2723]">
              <span>{currentDecomp.numA}</span>
              <span className="text-[#7a5c43]">+</span>
              <span>{currentDecomp.numB}</span>
              <span className="text-[#7a5c43]">=</span>
              <span className="text-emerald-700">?</span>
            </div>

            {/* Visual breakdown diagram */}
            <div className="bg-white rounded-2xl p-3 border border-[#ebdccb] space-y-2 text-xs">
              <div className="flex items-center justify-center gap-2 font-bold text-[#7a5c43]">
                <span>Rozklad:</span>
                <span className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded-lg border border-blue-200">
                  Desítky: {currentDecomp.tensA} + {currentDecomp.tensB}
                </span>
                <span>+</span>
                <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200">
                  Jednotky: {currentDecomp.onesA} + {currentDecomp.onesB}
                </span>
              </div>

              {/* Input Boxes for Middle Steps */}
              <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-sm font-black">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[#7a5c43]">Desítky:</span>
                  <input
                    type="number"
                    placeholder="70"
                    value={userSumTens}
                    onChange={(e) => setUserSumTens(e.target.value)}
                    className="w-16 min-h-[44px] text-center rounded-xl border-2 border-blue-300 bg-blue-50/50 text-blue-950 font-black text-base focus:outline-none focus:border-blue-600"
                  />
                </div>

                <span className="text-lg font-black text-[#7a5c43]">+</span>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-[#7a5c43]">Jednotky:</span>
                  <input
                    type="number"
                    placeholder="13"
                    value={userSumOnes}
                    onChange={(e) => setUserSumOnes(e.target.value)}
                    className="w-16 min-h-[44px] text-center rounded-xl border-2 border-amber-300 bg-amber-50/50 text-amber-950 font-black text-base focus:outline-none focus:border-amber-600"
                  />
                </div>

                <span className="text-lg font-black text-[#7a5c43]">=</span>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-emerald-800">Celkem:</span>
                  <input
                    type="number"
                    placeholder="83"
                    value={userTotal}
                    onChange={(e) => setUserTotal(e.target.value)}
                    className="w-18 min-h-[44px] text-center rounded-xl border-2 border-emerald-400 bg-emerald-50 text-emerald-950 font-black text-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleVerifyDecomp}
            disabled={!userSumTens || !userSumOnes || !userTotal}
            className={`w-full min-h-[48px] py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-md transition-all touch-target ${
              userSumTens && userSumOnes && userTotal
                ? 'bg-[#059669] hover:bg-[#047857] text-white active:scale-98 shadow-emerald-700/25'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>Zkontrolovat rozklad čísla 🧩</span>
          </button>
        </div>
      )}

      {/* TAB 2: MULTIPLICATION TRAIL */}
      {activeTab === 'mult' && (
        <div className="my-auto py-2 space-y-3">
          {/* Card with dot grid visualizer */}
          <div className="bg-[#fcfaf6] rounded-3xl p-5 border-2 border-[#ebdccb] shadow-xs text-center space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#7a5c43] block">
              Násobilkový duel {multIndex + 1} / {MULTIPLICATION_DUELS.length}
            </span>

            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border-2 border-[#ebdccb] shadow-inner text-3xl font-black text-[#3e2723]">
              <span>{currentMult.factorA}</span>
              <span className="text-amber-600">×</span>
              <span>{currentMult.factorB}</span>
              <span className="text-[#7a5c43]">=</span>
              <span className="text-amber-700">?</span>
            </div>

            {/* Visual dot grid (factorA rows of factorB dots) */}
            <div className="bg-white rounded-2xl p-3 border border-[#ebdccb] max-w-[260px] mx-auto space-y-1">
              <span className="text-[10px] font-bold text-[#7a5c43] block mb-1">
                Vizuální mřížka: {currentMult.factorA} řádků po {currentMult.factorB} tečkách
              </span>
              <div className="flex flex-col items-center gap-1">
                {Array.from({ length: Math.min(currentMult.factorA, 8) }).map((_, rIdx) => (
                  <div key={rIdx} className="flex items-center justify-center gap-1">
                    {Array.from({ length: Math.min(currentMult.factorB, 9) }).map((_, cIdx) => (
                      <span
                        key={cIdx}
                        className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-600 inline-block shadow-2xs"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Large Tactile Answer Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {currentMult.options.map((opt) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSelectMult(opt)}
                className="min-h-[58px] rounded-2xl bg-white hover:bg-amber-50 border-2 border-[#d8c3ad] border-b-[5px] border-b-[#7a5c43] active:border-b-2 active:translate-y-[3px] text-xl font-black text-[#3e2723] flex items-center justify-center shadow-xs touch-target cursor-pointer"
              >
                {opt}
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
        onNext={activeTab === 'decomp' ? handleNextDecomp : handleNextMult}
        buttonText={feedback.isCorrect ? 'Další příklad ➔' : 'Zkusit znovu 🔄'}
      />
    </div>
  )
}
