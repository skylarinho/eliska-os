import type { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WombatPeeker } from './WombatPeeker'
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { playClickSound } from '../../utils/audio'

interface FeedbackModalProps {
  isOpen: boolean
  isCorrect: boolean
  title?: string
  explanation: string
  hint?: string
  xpEarned?: number
  onNext: () => void
  buttonText?: string
}

export const FeedbackModal: FC<FeedbackModalProps> = ({
  isOpen,
  isCorrect,
  title,
  explanation,
  hint,
  xpEarned = 0,
  onNext,
  buttonText = 'Další otázka ➡️',
}) => {
  if (!isOpen) return null

  const handleNextClick = () => {
    playClickSound()
    onNext()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border-2 border-[#ebdccb] overflow-visible pt-8 pb-5 px-4 text-center mt-8"
        >
          {/* Wombat Peeking on the top edge */}
          <div className="-top-14 sm:-top-16 absolute left-1/2 -translate-x-1/2 z-10">
            <WombatPeeker
              expression={isCorrect ? 'success' : 'curious'}
              showStars={isCorrect}
              speechBubble={!isCorrect && hint ? hint : undefined}
              size="md"
            />
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm sm:text-base font-bold tracking-wide uppercase shadow-xs mb-3 ${
              isCorrect
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {title || '✅ SPRÁVNĚ! VÝBORNĚ!'}
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-amber-600" />
                {title || '❌ CHYBIČKA! NEVADÍ!'}
              </>
            )}
          </div>

          {/* XP Badge if won */}
          {isCorrect && xpEarned > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-2 text-xs sm:text-sm font-extrabold text-amber-600 bg-amber-50 rounded-full px-3 py-0.5 inline-block"
            >
              +{xpEarned} XP do vombatího batůžku! 🎒
            </motion.div>
          )}

          {/* Didactic explanation with comfortable font size for 4th graders */}
          <div className="bg-[#f7f5f0] border border-[#ebdccb] rounded-2xl p-3.5 sm:p-4 my-2 text-left shadow-inner">
            <p className="text-[#3e2723] text-[15px] sm:text-[17px] leading-relaxed font-medium">
              {explanation}
            </p>
          </div>

          {/* Action button min 48px high for touch target on iPhone 12 mini */}
          <div className="mt-4 pt-1">
            <button
              onClick={handleNextClick}
              className={`w-full min-h-[48px] px-6 py-3 rounded-2xl font-bold text-white text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform ${
                isCorrect
                  ? 'bg-[#059669] hover:bg-[#047857] shadow-emerald-700/25'
                  : 'bg-[#7a5c43] hover:bg-[#604430] shadow-stone-700/25'
              }`}
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
