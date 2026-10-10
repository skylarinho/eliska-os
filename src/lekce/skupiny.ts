import type { EnglishCategory, LetterGroup } from '../types/learning'

/** Které skupiny vyjmenovaných slov patří do které lekce. */
export const VYJMENOVANA_SKUPINY: Record<string, LetterGroup[]> = {
  'cestina-vyjmenovana-b': ['B'],
  'cestina-vyjmenovana-l-m': ['L', 'M'],
  'cestina-vyjmenovana-p-s': ['P', 'S'],
  'cestina-vyjmenovana-v-z': ['V', 'Z'],
}

/** Které okruhy anglických slovíček patří do které lekce. */
export const SLOVICKA_OKRUHY: Record<string, EnglishCategory[]> = {
  'anglictina-pozdravy': ['greetings'],
  'anglictina-zviratka': ['animals'],
  'anglictina-jidlo-skola': ['food', 'school'],
  'anglictina-barvy-cisla': ['colors', 'numbers'],
}
