import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dnesISO } from '../lib/datum'
import { spocitejHvezdy, zapisDokonceni, type Hvezdy } from '../lib/postup'
import { migrujProfily, type UlozenyProfil } from './migrace'

export type AvatarType = 'vombat' | 'liska' | 'sovka' | 'medvidek'

export const getVocativeName = (name?: string): string => {
  if (!name) return 'Eliško'
  const trimmed = name.trim()
  if (trimmed.toLowerCase() === 'eliška') return 'Eliško'
  if (trimmed.toLowerCase().endsWith('a')) return `${trimmed.slice(0, -1)}o`
  return trimmed
}

export interface ChildProfile extends Omit<UlozenyProfil, 'avatar'> {
  avatar: AvatarType
}

interface ProfileStoreState {
  profiles: ChildProfile[]
  activeProfileId: string
  soundEnabled: boolean

  getActiveProfile: () => ChildProfile | undefined

  setActiveProfileId: (id: string) => void
  createProfile: (profileData: { name: string; avatar: AvatarType }) => string
  updateProfile: (id: string, updates: Partial<Omit<ChildProfile, 'id'>>) => void
  deleteProfile: (id: string) => void
  /** Zapíše dokončenou lekci: nejlepší výsledek, datum a sérii. Vrací získané hvězdy. */
  dokonciLekci: (lessonId: string, chyby: number) => Hvezdy
  resetActiveProfileProgress: () => void
  toggleSound: () => void
  setSoundEnabled: (enabled: boolean) => void
}

const prazdnaSerie = { pocet: 0, posledni: '' }

const initialProfiles: ChildProfile[] = [
  {
    id: 'eliska-default',
    name: 'Eliška',
    vokativ: 'Eliško',
    avatar: 'vombat',
    hvezdy: {},
    dokonceno: {},
    serie: prazdnaSerie,
  },
]

/** Změní profil právě aktivního dítěte. */
const upravAktivni =
  (fn: (p: ChildProfile) => ChildProfile) =>
  (state: ProfileStoreState): Partial<ProfileStoreState> => ({
    profiles: state.profiles.map((p) => (p.id === state.activeProfileId ? fn(p) : p)),
  })

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

      setActiveProfileId: (id: string) => {
        set({ activeProfileId: id })
      },

      createProfile: ({ name, avatar }) => {
        const newId = 'child-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6)
        const jmeno = name.trim() || 'Malý objevitel'
        const newProfile: ChildProfile = {
          id: newId,
          name: jmeno,
          vokativ: getVocativeName(jmeno),
          avatar,
          hvezdy: {},
          dokonceno: {},
          serie: prazdnaSerie,
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

      dokonciLekci: (lessonId, chyby) => {
        const dnes = dnesISO()
        const ziskane = spocitejHvezdy(chyby)
        set(
          upravAktivni((p) => ({
            ...p,
            hvezdy: { ...p.hvezdy, [lessonId]: Math.max(p.hvezdy[lessonId] ?? 0, ziskane) },
            dokonceno: { ...p.dokonceno, [lessonId]: dnes },
            serie: zapisDokonceni(p.serie, dnes),
          })),
        )
        return ziskane
      },

      resetActiveProfileProgress: () => {
        set(upravAktivni((p) => ({ ...p, hvezdy: {}, dokonceno: {}, serie: prazdnaSerie })))
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }))
      },

      setSoundEnabled: (enabled: boolean) => {
        set({ soundEnabled: enabled })
      },
    }),
    {
      name: 'e-liska-os-state',
      version: 2,
      // v1: odstraněn školní e-mail, doplněn vokativ
      // v2: XP a úrovně pryč, hvězdy za lekci (0–3) a série dní
      migrate: (persisted) => {
        const stav = (persisted ?? {}) as Partial<ProfileStoreState>
        return {
          ...stav,
          profiles: migrujProfily(stav.profiles, getVocativeName),
        } as ProfileStoreState
      },
    },
  ),
)
