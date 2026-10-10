import { useState, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfileStore, type AvatarType } from '../../store/useProfileStore'
import { WombatPeeker } from '../common/WombatPeeker'
import { X, UserPlus, Check } from 'lucide-react'
import { pocet } from '../../lib/typo'
import { playClickSound, playCorrectSound } from '../../utils/audio'

interface ProfileSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

const AVATAR_OPTIONS: { type: AvatarType; label: string; icon: string }[] = [
  { type: 'vombat', label: 'Vombat', icon: '' },
  { type: 'liska', label: 'Liška', icon: '' },
  { type: 'sovka', label: 'Sovička', icon: '' },
  { type: 'medvidek', label: 'Medvídek', icon: '' },
]

export const ProfileSelectorModal: FC<ProfileSelectorModalProps> = ({ isOpen, onClose }) => {
  const { profiles, activeProfileId, setActiveProfileId, createProfile } = useProfileStore()
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Form state for new child
  const [newName, setNewName] = useState('')
  const [newAvatar, setNewAvatar] = useState<AvatarType>('liska')

  if (!isOpen) return null

  const handleSelectProfile = (id: string) => {
    playClickSound()
    setActiveProfileId(id)
    onClose()
  }

  const handleCreateNewChild = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    playCorrectSound()
    createProfile({
      name: newName.trim(),
      avatar: newAvatar,
    })
    setIsAddingNew(false)
    setNewName('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/45 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border-2 border-[#ebdccb] overflow-visible pt-10 pb-5 px-4 mt-6"
        >
          {/* Wombat Peeker resting on the top edge of login card */}
          <div className="-top-14 sm:-top-16 absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <WombatPeeker expression="happy" size="md" />
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              playClickSound()
              onClose()
            }}
            className="absolute right-3 top-3 w-8 h-8 rounded-xl bg-[#ebdccb]/60 hover:bg-[#ebdccb] text-[#7a5c43] flex items-center justify-center active:scale-90 transition-transform touch-target"
            aria-label="Zavřít výběr žáka"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Mode 1: Regular Profile Switcher */}
          {!isAddingNew && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-black text-[#3e2723]">Kdo se bude dnes učit? </h3>
                <p className="text-xs text-[#7a5c43] mt-0.5">
                  Vyber svůj profil nebo přidej sourozence a kamaráda
                </p>
              </div>

              {/* Profiles grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[48vh] overflow-y-auto p-1">
                {profiles.map((p) => {
                  const isSelected = p.id === activeProfileId
                  const avatarIcon = AVATAR_OPTIONS.find((a) => a.type === p.avatar)?.icon || ''

                  return (
                    <motion.button
                      key={p.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleSelectProfile(p.id)}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all touch-target ${
                        isSelected
                          ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-300'
                          : 'bg-white hover:bg-[#f7f5f0] border-[#ebdccb]'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#ebdccb]/60 flex items-center justify-center text-2xl shrink-0">
                        {avatarIcon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-[#3e2723] block truncate">
                            {p.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </div>
                        <span className="text-xs font-black text-emerald-800 block">
                          {pocet(Object.values(p.hvezdy).reduce((a, b) => a + b, 0), ['hvězda', 'hvězdy', 'hvězd'])} 
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#ebdccb]">
                <button
                  onClick={() => {
                    playClickSound()
                    setIsAddingNew(true)
                  }}
                  className="w-full min-h-[44px] py-2.5 rounded-2xl bg-[#ebdccb]/70 hover:bg-[#ebdccb] text-[#7a5c43] font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform touch-target"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Přidat dalšího školáka</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: Add New Child Profile */}
          {isAddingNew && (
            <form onSubmit={handleCreateNewChild} className="space-y-3">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-black text-[#3e2723]">Přidat nového školáka </h3>
                <p className="text-xs text-[#7a5c43]">Vyplň jméno a vyber zvířátko</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7a5c43] mb-1">Jméno dítěte:</label>
                <input
                  type="text"
                  required
                  placeholder="např. Tomášek, Eliška..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border-2 border-[#ebdccb] text-sm text-[#3e2723] focus:border-[#7a5c43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7a5c43] mb-1">Vyber maskota:</label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_OPTIONS.map((a) => (
                    <button
                      key={a.type}
                      type="button"
                      onClick={() => setNewAvatar(a.type)}
                      className={`p-2 rounded-xl border-2 text-center transition-all ${
                        newAvatar === a.type
                          ? 'border-amber-500 bg-amber-50 shadow-xs'
                          : 'border-[#ebdccb] bg-[#f7f5f0]'
                      }`}
                    >
                      <span className="text-2xl block">{a.icon}</span>
                      <span className="text-[10px] font-bold text-[#7a5c43] block mt-0.5">
                        {a.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 min-h-[44px] py-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs"
                >
                  Zpět
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-md"
                >
                  Uložit profil 
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
