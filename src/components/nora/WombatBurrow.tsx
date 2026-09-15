import { useState, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BURROW_LAYERS, type BurrowLayer } from '../../data/lessonsData'
import { useProfileStore } from '../../store/useProfileStore'
import { WombatPeeker } from '../common/WombatPeeker'
import { ArrowLeft, Pickaxe, Info, Sparkles, CheckCircle2, Lock } from 'lucide-react'
import { playClickSound } from '../../utils/audio'

interface WombatBurrowProps {
  onBack: () => void
  onGoToLessons: () => void
}

export const WombatBurrow: FC<WombatBurrowProps> = ({ onBack, onGoToLessons }) => {
  const activeProfile = useProfileStore((state) => state.getActiveProfile())
  const completedCount = activeProfile?.completedLessons.length || 0

  // Active burrow depth: 0 = surface, up to 3 = deepest
  const unlockedDepth = Math.min(completedCount, 3)
  const [selectedLayer, setSelectedLayer] = useState<BurrowLayer>(BURROW_LAYERS[unlockedDepth])

  const handleSelectLayer = (layer: BurrowLayer) => {
    playClickSound()
    setSelectedLayer(layer)
  }

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-4 min-h-[calc(100dvh-130px)] flex flex-col justify-between">
      {/* Top Header */}
      <div className="space-y-3">
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
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-950 px-3.5 py-1.5 rounded-full text-xs font-black border border-amber-300 shadow-2xs">
            <Pickaxe className="w-3.5 h-3.5 text-amber-700" />
            <span>Hloubka: {BURROW_LAYERS[unlockedDepth].depthMeters}</span>
          </div>
        </div>

        {/* Clean Title Banner with Wombat */}
        <div className="relative bg-[#fcfaf6] border-2 border-[#ebdccb] rounded-3xl p-4 pt-10 text-center shadow-xs mt-6">
          <div className="-top-12 absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <WombatPeeker expression="happy" size="md" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#7a5c43] block">
            Archeologická expedice
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#3e2723] tracking-tight">
            Vombatí nora času 🐾
          </h1>
          <p className="text-xs text-[#7a5c43] font-medium mt-0.5">
            Klepni na patro a prozkoumej, co se ukrývá pod zemí!
          </p>
        </div>
      </div>

      {/* Clean Interactive Burrow Cross-Section */}
      <div className="my-3 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#7a5c43]">
            Zemské vrstvy (od povrchu do hloubky):
          </span>
          <span className="text-xs font-bold text-[#3e2723]">
            {unlockedDepth + 1} / 4 odemčeno
          </span>
        </div>

        <div className="space-y-2">
          {BURROW_LAYERS.map((layer) => {
            const isUnlocked = layer.level <= unlockedDepth
            const isCurrentWombatLevel = layer.level === unlockedDepth
            const isSelected = selectedLayer.level === layer.level

            return (
              <motion.button
                key={layer.level}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectLayer(layer)}
                className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-2.5 touch-target cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#7a5c43] shadow-md ring-2 ring-[#7a5c43]/20'
                    : isUnlocked
                    ? 'bg-white/80 hover:bg-white border-[#ebdccb] shadow-2xs'
                    : 'bg-[#f7f5f0]/60 border-[#d8c3ad]/50 opacity-75'
                }`}
              >
                {/* Left: Depth & Icon */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 font-black border ${
                      isUnlocked
                        ? 'bg-[#ebdccb]/60 border-[#d8c3ad] text-[#3e2723]'
                        : 'bg-stone-200 border-stone-300 text-stone-400'
                    }`}
                  >
                    {layer.level === 0 ? '🌱' : layer.level === 1 ? '🚂' : layer.level === 2 ? '🏰' : '🪓'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#ebdccb]/70 text-[#7a5c43]">
                        {layer.depthMeters}
                      </span>
                      <h3 className="text-sm font-black text-[#3e2723] truncate">
                        {layer.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-[#7a5c43] font-medium truncate mt-0.5">
                      Nálezy: {layer.artifacts.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Right: Status / Wombat badge */}
                <div className="shrink-0 flex items-center">
                  {isCurrentWombatLevel ? (
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-amber-500 text-white shadow-2xs flex items-center gap-1 animate-pulse">
                      <span>Kope zde ⛏️</span>
                    </span>
                  ) : isUnlocked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-stone-400" />
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Selected Layer Details Card (Clean & uncluttered) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLayer.level}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-[#fcfaf6] rounded-3xl p-4 border-2 border-[#ebdccb] shadow-xs space-y-3 mt-2"
          >
            <div className="flex items-center justify-between border-b border-[#ebdccb] pb-2">
              <div>
                <h4 className="text-sm font-black text-[#3e2723]">
                  {selectedLayer.title}
                </h4>
                <span className="text-[11px] text-[#7a5c43] font-bold">
                  Hloubka v zemi: {selectedLayer.depthMeters}
                </span>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-[#ebdccb] text-[#7a5c43]">
                Patro {selectedLayer.level}
              </span>
            </div>

            {/* Artifacts pills */}
            <div className="grid grid-cols-3 gap-1.5">
              {selectedLayer.artifacts.map((art, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white rounded-xl border border-[#ebdccb] text-center shadow-2xs"
                >
                  <span className="text-2xl block mb-0.5">{art.icon}</span>
                  <span className="text-xs font-black text-[#3e2723] block truncate">
                    {art.name}
                  </span>
                  <span className="text-[10px] text-[#7a5c43] block truncate">
                    {art.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Child-friendly 1-sentence scientific reason */}
            <div className="bg-white rounded-2xl p-2.5 border border-[#ebdccb] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#7a5c43] shrink-0 mt-0.5" />
              <p className="text-xs text-[#7a5c43] leading-relaxed font-medium">
                <strong className="text-[#3e2723]">Proč je to tak hluboko?</strong>{' '}
                {selectedLayer.archaeologyFact}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-2">
        {unlockedDepth < 3 ? (
          <button
            onClick={() => {
              playClickSound()
              onGoToLessons()
            }}
            className="w-full min-h-[48px] py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-base flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
          >
            <Pickaxe className="w-5 h-5" />
            <span>Splň další lekci a prokopej se hlouběji! 🐾</span>
          </button>
        ) : (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-center">
            <span className="text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Gratulujeme! Prokopali jste se až na dno pravěké jeskyně! 🪓
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
