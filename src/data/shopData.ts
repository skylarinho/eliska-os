import type { ShopItem, ShopMission } from '../types/learning'

export const SHOP_ITEMS: ShopItem[] = [
  // Pečivo
  { id: 'rohlik', name: 'Křupavý rohlík', price: 3, emoji: '🥐', category: 'pecivo' },
  { id: 'houska', name: 'Houska s mákem', price: 5, emoji: '🍞', category: 'pecivo' },
  { id: 'kolac', name: 'Tvarohový koláč', price: 24, emoji: '🥧', category: 'pecivo' },
  { id: 'zavin', name: 'Makový závin', price: 35, emoji: '🥮', category: 'pecivo' },

  // Ovoce
  { id: 'jablko', name: 'Červené jablíčko', price: 15, emoji: '🍎', category: 'ovoce' },
  { id: 'banan', name: 'Zralý banán', price: 12, emoji: '🍌', category: 'ovoce' },
  { id: 'jahody', name: 'Košíček jahod', price: 30, emoji: '🍓', category: 'ovoce' },

  // Mlscení
  { id: 'lizatko', name: 'Ovocné lízátko', price: 6, emoji: '🍭', category: 'mlsceni' },
  { id: 'cokolada', name: 'Čokoládová tyčinka', price: 18, emoji: '🍫', category: 'mlsceni' },
  { id: 'zvykacky', name: 'Balíček žvýkaček', price: 14, emoji: '🍬', category: 'mlsceni' },

  // Nápoje
  { id: 'mlicko', name: 'Jahodové mlíčko', price: 16, emoji: '🧃', category: 'napoje' },
  { id: 'most', name: 'Jablečný mošt', price: 25, emoji: '🥤', category: 'napoje' },
  { id: 'voda', name: 'Pramenitá voda', price: 10, emoji: '💧', category: 'napoje' },
]

export const SHOP_MISSIONS: ShopMission[] = [
  {
    id: 'mission-1',
    title: 'Snídaně pro celou rodinu',
    story: 'Maminka poslala Elišku do obchodu: „Kup prosím 2 rohlíky, 1 tvarohový koláč a 1 jablíčko!“',
    cartTargets: [
      { itemId: 'rohlik', count: 2 },
      { itemId: 'kolac', count: 1 },
      { itemId: 'jablko', count: 1 },
    ],
    paidWithBanknote: 100,
    xpReward: 35,
  },
  {
    id: 'mission-2',
    title: 'Vombatí narozeninová oslava',
    story: 'Vombat chystá oslavu pro kamarády: „Potřebuji 4 ovocná lízátka, 2 jahodová mlíčka a 1 makový závin!“',
    cartTargets: [
      { itemId: 'lizatko', count: 4 },
      { itemId: 'mlicko', count: 2 },
      { itemId: 'zavin', count: 1 },
    ],
    paidWithBanknote: 100,
    xpReward: 40,
  },
  {
    id: 'mission-3',
    title: 'Velký balíček na výlet do lesa',
    story: 'Před túrou na hrad Bouzov: „Kup 2 housky, 2 jablečné mošty, 2 čokoládové tyčinky a 2 banány!“',
    cartTargets: [
      { itemId: 'houska', count: 2 },
      { itemId: 'most', count: 2 },
      { itemId: 'cokolada', count: 2 },
      { itemId: 'banan', count: 2 },
    ],
    paidWithBanknote: 200,
    xpReward: 50,
  },
  {
    id: 'mission-4',
    title: 'Sladká odměna po vysvědčení',
    story: 'Školačka Eliška nakupuje dobroty: „Vezmi 1 košíček jahod, 3 lízátka a 2 balíčky žvýkaček!“',
    cartTargets: [
      { itemId: 'jahody', count: 1 },
      { itemId: 'lizatko', count: 3 },
      { itemId: 'zvykacky', count: 2 },
    ],
    paidWithBanknote: 100,
    xpReward: 45,
  },
]
