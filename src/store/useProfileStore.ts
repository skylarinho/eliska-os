import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AvatarType = 'vombat' | 'liska' | 'sovka' | 'medvidek'

export const getVocativeName = (name?: string): string => {
  if (!name) return 'Eliško'
  const trimmed = name.trim()
  if (trimmed.toLowerCase() === 'eliška') return 'Eliško'
  if (trimmed.toLowerCase().endsWith('a')) return `${trimmed.slice(0, -1)}o`
  return trimmed
}

export interface ChildProfile {
  id: string
  name: string
  vokativ: string
  avatar: AvatarType
  xp: number
  streakDays: number
  lastActiveDate: string // YYYY-MM-DD
  completedLessons: string[]
}

export type LeagueTier = {
  name: string
  icon: string
  minXp: number
  description: string
}

export const LEAGUE_TIERS: LeagueTier[] = [
  { name: 'Bronzová tlapka', icon: '🥉', minXp: 0, description: 'Začínáme naše vombatí dobrodružství!' },
  { name: 'Stříbrná hvězdička', icon: '🥈', minXp: 150, description: 'Už se dostáváme hlouběji do znalostí!' },
  { name: 'Zlatý skřivánek', icon: '🥇', minXp: 350, description: 'Zpíváme radostí jako skřivánek!' },
  { name: 'Diamantový vombat', icon: '💎', minXp: 600, description: 'Pravý mistr všech znalostí!' },
]

interface ProfileStoreState {
  profiles: ChildProfile[]
  activeProfileId: string
  soundEnabled: boolean
  
  // Getters
  getActiveProfile: () => ChildProfile | undefined
  getCurrentLeague: () => LeagueTier
  
  // Actions
  setActiveProfileId: (id: string) => void
  createProfile: (profileData: { name: string; avatar: AvatarType }) => string
  updateProfile: (id: string, updates: Partial<Omit<ChildProfile, 'id'>>) => void
  deleteProfile: (id: string) => void
  addXp: (amount: number) => void
  completeLesson: (lessonId: string, bonusXp?: number) => void
  resetActiveProfileProgress: () => void
  toggleSound: () => void
  setSoundEnabled: (enabled: boolean) => void
  checkAndRecordActivity: () => void
}

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0]
}

const initialProfiles: ChildProfile[] = [
  {
    id: 'eliska-default',
    name: 'Eliška',
    vokativ: 'Eliško',
    avatar: 'vombat',
    xp: 40,
    streakDays: 3,
    lastActiveDate: getTodayDateString(),
    completedLessons: [],
  },
]

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set, get) => ({
      profiles: initialProfiles,
      activeProfileId: 'eliska-default',
      soundEnabled: true,

      getActiveProfile: () => {
        const state = get()
        return state.profiles.find((p) => p.id === state.activeProfileId) || state.profiles[0]
      },

      getCurrentLeague: () => {
        const active = get().getActiveProfile()
        const xp = active?.xp || 0
        for (let i = LEAGUE_TIERS.length - 1; i >= 0; i--) {
          if (xp >= LEAGUE_TIERS[i].minXp) {
            return LEAGUE_TIERS[i]
          }
        }
        return LEAGUE_TIERS[0]
      },

      setActiveProfileId: (id: string) => {
        set({ activeProfileId: id })
        get().checkAndRecordActivity()
      },

      createProfile: ({ name, avatar }) => {
        const newId = 'child-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6)
        const newProfile: ChildProfile = {
          id: newId,
          name: name.trim() || 'Malý objevitel',
          vokativ: getVocativeName(name),
          avatar,
          xp: 0,
          streakDays: 1,
          lastActiveDate: getTodayDateString(),
          completedLessons: [],
        }

        set((state) => ({
          profiles: [...state.profiles, newProfile],
          activeProfileId: newId,
        }))

        return newId
      },

      updateProfile: (id, updates) => {
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
      },

      deleteProfile: (id) => {
        set((state) => {
          const filtered = state.profiles.filter((p) => p.id !== id)
          const newActive = filtered.length > 0 ? filtered[0].id : ''
          return {
            profiles: filtered,
            activeProfileId: state.activeProfileId === id ? newActive : state.activeProfileId,
          }
        })
      },

      addXp: (amount: number) => {
        set((state) => {
          const activeId = state.activeProfileId
          return {
            profiles: state.profiles.map((p) => {
              if (p.id === activeId) {
                return { ...p, xp: Math.max(0, p.xp + amount) }
              }
              return p
            }),
          }
        })
        get().checkAndRecordActivity()
      },

      completeLesson: (lessonId: string, bonusXp = 50) => {
        set((state) => {
          const activeId = state.activeProfileId
          return {
            profiles: state.profiles.map((p) => {
              if (p.id === activeId) {
                const alreadyDone = p.completedLessons.includes(lessonId)
                const newCompleted = alreadyDone ? p.completedLessons : [...p.completedLessons, lessonId]
                return {
                  ...p,
                  xp: p.xp + (alreadyDone ? Math.round(bonusXp / 2) : bonusXp),
                  completedLessons: newCompleted,
                }
              }
              return p
            }),
          }
        })
        get().checkAndRecordActivity()
      },

      resetActiveProfileProgress: () => {
        set((state) => {
          const activeId = state.activeProfileId
          return {
            profiles: state.profiles.map((p) => {
              if (p.id === activeId) {
                return {
                  ...p,
                  xp: 0,
                  streakDays: 1,
                  completedLessons: [],
                  lastActiveDate: getTodayDateString(),
                }
              }
              return p
            }),
          }
        })
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }))
      },

      setSoundEnabled: (enabled: boolean) => {
        set({ soundEnabled: enabled })
      },

      checkAndRecordActivity: () => {
        const today = getTodayDateString()
        set((state) => {
          const activeId = state.activeProfileId
          return {
            profiles: state.profiles.map((p) => {
              if (p.id === activeId) {
                if (p.lastActiveDate === today) {
                  return p
                }
                // Check if last activity was yesterday
                const lastDate = new Date(p.lastActiveDate)
                const nowDate = new Date(today)
                const diffTime = Math.abs(nowDate.getTime() - lastDate.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                const newStreak = diffDays === 1 ? p.streakDays + 1 : 1
                return {
                  ...p,
                  streakDays: newStreak,
                  lastActiveDate: today,
                }
              }
              return p
            }),
          }
        })
      },
    }),
    {
      name: 'e-liska-os-state',
      version: 1,
      // v1: odstraněn školní e-mail (osobní údaj), doplněn vokativ
      migrate: (persisted) => {
        const state = persisted as { profiles?: Array<Record<string, unknown>> }
        state.profiles = (state.profiles ?? []).map((p) => {
          const { schoolEmail: _removed, ...rest } = p
          const name = typeof rest.name === 'string' ? rest.name : ''
          return { ...rest, vokativ: (rest.vokativ as string) || getVocativeName(name) }
        })
        return state as unknown as ProfileStoreState
      },
    }
  )
)
