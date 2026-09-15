import type { FC } from 'react'
import { useProfileStore, type AvatarType } from '../../store/useProfileStore'
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react'
import { playClickSound } from '../../utils/audio'

interface HeaderProps {
  onOpenProfile: () => void
  currentView: string
  onBackToDashboard: () => void
  viewProgress?: string
}

const avatarIcons: Record<AvatarType, string> = {
  vombat: '🐾',
  liska: '🦊',
  sovka: '🦉',
  medvidek: '🐻',
}

export const Header: FC<HeaderProps> = ({
  onOpenProfile,
  currentView,
  onBackToDashboard,
  viewProgress,
}) => {
  const { soundEnabled, toggleSound } = useProfileStore()
  const activeProfile = useProfileStore((state) => state.getActiveProfile())
  const isGameActive = currentView !== 'dashboard'

  const handleSoundClick = () => {
    toggleSound()
    playClickSound()
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-[#f7f5f0]/95 backdrop-blur-md border-b border-[#ebdccb] px-3.5 py-2 safe-pt">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* LEFT SECTION */}
        {isGameActive ? (
          /* Active game: Back button */
          <button
            onClick={() => {
              playClickSound()
              onBackToDashboard()
            }}
            className="flex items-center gap-1.5 bg-[#ebdccb] hover:bg-[#d8c3ad] active:scale-95 transition-all px-3 py-1.5 rounded-xl border border-[#b08968] text-xs font-black text-[#3e2723] min-h-[42px] touch-target cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zpět</span>
          </button>
        ) : (
          /* Dashboard: Child Profile Button */
          <button
            onClick={() => {
              playClickSound()
              onOpenProfile()
            }}
            className="flex items-center gap-2 bg-[#ebdccb]/70 hover:bg-[#ebdccb] active:scale-95 transition-all px-2.5 py-1 rounded-2xl border border-[#d8c3ad] min-h-[42px] touch-target"
            aria-label="Profil žáka"
          >
            <span className="text-xl drop-shadow-xs">
              {avatarIcons[activeProfile?.avatar || 'vombat']}
            </span>
            <div className="text-left">
              <span className="text-[10px] font-extrabold text-[#7a5c43] block -mb-0.5">
                Školačka
              </span>
              <span className="text-xs sm:text-sm font-black text-[#3e2723] block truncate max-w-[95px] sm:max-w-[125px]">
                {activeProfile?.name || 'Eliška'}
              </span>
            </div>
          </button>
        )}

        {/* CENTER SECTION: Game progress indicator */}
        {isGameActive && viewProgress && (
          <div className="bg-amber-100/90 text-amber-950 border border-amber-300 px-3 py-1 rounded-full text-xs font-black shadow-2xs">
            {viewProgress}
          </div>
        )}

        {/* RIGHT SECTION: Sound */}
        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={handleSoundClick}
            className="p-2 rounded-xl bg-[#ebdccb]/60 hover:bg-[#ebdccb] text-[#7a5c43] active:scale-90 transition-transform min-w-[38px] min-h-[38px] flex items-center justify-center touch-target cursor-pointer"
            aria-label={soundEnabled ? 'Ztlumit zvuky' : 'Zapnout zvuky'}
            title={soundEnabled ? 'Zvuk zapnutý' : 'Zvuk vypnutý'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#7a5c43]" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
