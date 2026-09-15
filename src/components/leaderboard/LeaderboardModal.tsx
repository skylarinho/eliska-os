import type { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfileStore, TRAINING_BOTS, type AvatarType } from '../../store/useProfileStore'
import { X, Trophy, Flame, Sparkles } from 'lucide-react'
import { playClickSound } from '../../utils/audio'

interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
}

const avatarIcons: Record<AvatarType, string> = {
  vombat: '🐾',
  liska: '🦊',
  sovka: '🦉',
  medvidek: '🐻',
}

export const LeaderboardModal: FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { profiles, activeProfileId, getCurrentLeague } = useProfileStore()
  const activeProfile = useProfileStore((state) => state.getActiveProfile())
  const currentLeague = getCurrentLeague()

  if (!isOpen) return null

  // Combine active user profiles + training bots, sort by XP descending
  const userEntries = profiles.map((p) => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    xp: p.xp,
    streak: p.streakDays,
    isBot: false,
    isActive: p.id === activeProfileId,
    badge: p.id === activeProfileId ? 'Ty! ⭐' : 'Školák 🎒',
  }))

  const botEntries = TRAINING_BOTS.map((b) => ({
    id: b.id,
    name: b.name,
    avatar: b.avatar,
    xp: b.xp,
    streak: 3,
    isBot: true,
    isActive: false,
    badge: b.badge,
  }))

  const allEntries = [...userEntries, ...botEntries].sort((a, b) => b.xp - a.xp)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/45 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border-2 border-[#ebdccb] overflow-hidden flex flex-col max-h-[90dvh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#ebdccb] to-[#f7f5f0] p-4 border-b border-[#ebdccb] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl shadow-xs">
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#3e2723]">Vombatí žebříček</h3>
                <span className="text-xs text-[#7a5c43] font-bold flex items-center gap-1">
                  <span>Liga: {currentLeague.icon} {currentLeague.name}</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                playClickSound()
                onClose()
              }}
              className="w-9 h-9 rounded-xl bg-white/70 hover:bg-white text-[#7a5c43] flex items-center justify-center active:scale-90 transition-transform touch-target"
              aria-label="Zavřít žebříček"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* League progression banner */}
          <div className="bg-amber-50/70 border-b border-amber-200/60 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{currentLeague.icon}</span>
              <p className="text-xs text-amber-900 font-medium">
                {currentLeague.description}
              </p>
            </div>
            <span className="text-xs font-black text-amber-800 shrink-0 ml-2">
              {activeProfile?.xp || 0} XP
            </span>
          </div>

          {/* Leaderboard entries list */}
          <div className="p-3.5 space-y-2 overflow-y-auto flex-1">
            {allEntries.map((entry, index) => {
              const rank = index + 1
              const rankBadge =
                rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`

              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border-2 transition-all ${
                    entry.isActive
                      ? 'bg-amber-50/80 border-amber-400 shadow-sm ring-2 ring-amber-300'
                      : entry.isBot
                      ? 'bg-stone-50/60 border-[#ebdccb]/60'
                      : 'bg-white border-[#ebdccb]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Rank */}
                    <span className="w-7 text-center font-black text-sm text-[#7a5c43]">
                      {rankBadge}
                    </span>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-2xl bg-[#ebdccb]/50 border border-[#d8c3ad] flex items-center justify-center text-xl shrink-0">
                      {avatarIcons[entry.avatar]}
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-sm font-black truncate ${
                            entry.isActive ? 'text-amber-950 font-black' : 'text-[#3e2723]'
                          }`}
                        >
                          {entry.name}
                        </span>
                        {entry.isActive && (
                          <span className="text-[10px] font-black px-1.5 py-0.2 bg-amber-500 text-white rounded-md">
                            TY
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#7a5c43] font-medium block truncate">
                        {entry.badge}
                      </span>
                    </div>
                  </div>

                  {/* XP & Streak */}
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-emerald-800 block">
                      {entry.xp} XP
                    </span>
                    <span className="text-[10px] text-[#7a5c43] font-semibold flex items-center justify-end gap-0.5">
                      <Flame className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
                      {entry.streak} d.
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-[#f7f5f0] border-t border-[#ebdccb] text-center">
            <p className="text-xs text-[#7a5c43] font-medium flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Liga se vyhodnocuje každou neděli! Uč se dál!
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
