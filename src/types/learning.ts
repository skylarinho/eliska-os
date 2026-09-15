// TypeScript types for Part 2: Learning Zone (Shop, Math, Czech, English)

// --- 1. SHOP & WORD PROBLEMS ---
export interface ShopItem {
  id: string
  name: string
  price: number
  emoji: string
  category: 'pecivo' | 'mlsceni' | 'napoje' | 'ovoce'
}

export interface CartTarget {
  itemId: string
  count: number
}

export interface ShopMission {
  id: string
  title: string
  story: string
  cartTargets: CartTarget[]
  paidWithBanknote: number // e.g. 100 or 200 or 500 Kč
  xpReward: number
}

export type CoinValue = 1 | 2 | 5 | 10 | 20 | 50
export type BanknoteValue = 100 | 200 | 500

// --- 2. MATH LAB ---
export interface DecompositionStep {
  id: string
  numA: number
  numB: number
  tensA: number
  tensB: number
  onesA: number
  onesB: number
  sumTens: number
  sumOnes: number
  total: number
}

export interface MultiplicationDuel {
  id: string
  factorA: number
  factorB: number
  product: number
  options: number[]
}

// --- 3. CZECH (VYJMENOVANÁ SLOVA) ---
export type LetterGroup = 'B' | 'L' | 'M' | 'P' | 'S' | 'V' | 'Z'

export interface CzechExercise {
  id: string
  letterGroup: LetterGroup
  sentence: string // e.g. "Na louce kvetla léčivá b__linka."
  missingWord: string
  correctAnswer: 'i' | 'í' | 'y' | 'ý'
  explanation: string
  rootWord: string
  isCatchWord?: boolean // Chyták (být vs bít apod.)
}

// --- 4. ENGLISH WITH PHONETICS & SPEECH ---
export type EnglishCategory = 'greetings' | 'animals' | 'food' | 'school' | 'colors' | 'numbers'

export interface EnglishPhrase {
  id: string
  category: EnglishCategory
  english: string
  czech: string
  phonetic: string // e.g. "[ep-l]", "[fenk jů]"
  emoji: string
  options: string[]
}
