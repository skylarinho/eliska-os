import { useState, type FC } from 'react'
import { SkrivanekIllustration } from './SkrivanekIllustration'
import { RotateCcw, UserCheck, AlertTriangle } from 'lucide-react'
import { useProfileStore } from '../../store/useProfileStore'
import { playClickSound } from '../../utils/audio'

interface FooterProps {
  onOpenProfileSelector: () => void
}

export const Footer: FC<FooterProps> = ({ onOpenProfileSelector }) => {
  const resetActiveProfileProgress = useProfileStore((state) => state.resetActiveProfileProgress)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleReset = () => {
    playClickSound()
    resetActiveProfileProgress()
    setConfirmReset(false)
  }

  return (
    <footer className="w-full bg-[#ebdccb]/40 border-t border-[#ebdccb] px-3.5 py-6 mt-8 safe-pb text-center text-[#3e2723]">
      <div className="max-w-md mx-auto flex flex-col items-center gap-3">
        {/* Singing Lark illustration */}
        <div className="flex items-center justify-center -mb-1">
          <SkrivanekIllustration size={64} />
        </div>

        {/* Loving Father dedication */}
        <div className="space-y-0.5">
          <p className="text-sm sm:text-base font-bold text-[#3e2723]">
            Aplikaci vytvořil s láskou tatínek ❤️
          </p>
          <p className="text-xs text-[#7a5c43] font-medium">
            Pro nejchytřejší a nejšikovnější školačku Elišku
          </p>
        </div>

        {/* Action Buttons: Reset & Change Child Profile */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {confirmReset ? (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-300 rounded-2xl p-2 animate-fadeIn">
              <span className="text-xs text-rose-800 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Vážně vynulovat body?
              </span>
              <button
                onClick={handleReset}
                className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-xl active:scale-95 touch-target min-h-[36px]"
              >
                Ano
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1 bg-stone-200 text-stone-800 text-xs font-bold rounded-xl active:scale-95 touch-target min-h-[36px]"
              >
                Ne
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                playClickSound()
                setConfirmReset(true)
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-semibold text-[#7a5c43] border border-[#d8c3ad] shadow-xs active:scale-95 transition-all touch-target"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Vynulovat výsledky 🔄</span>
            </button>
          )}

          <button
            onClick={() => {
              playClickSound()
              onOpenProfileSelector()
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-semibold text-[#3e2723] border border-[#d8c3ad] shadow-xs active:scale-95 transition-all touch-target"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Odhlásit / Změnit žáka 🔒</span>
          </button>
        </div>

        {/* Tech Credits */}
        <div className="pt-2 text-[11px] text-[#7a5c43]/80 leading-relaxed max-w-xs">
          <p>Postaveno na GitHubu • Běží na Vercelu • S láskou a kódem pomohla Gemini ✨</p>
        </div>
      </div>
    </footer>
  )
}
