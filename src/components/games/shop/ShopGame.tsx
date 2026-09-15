import { useState, type FC } from 'react'
import { motion } from 'framer-motion'
import { SHOP_ITEMS, SHOP_MISSIONS } from '../../../data/shopData'
import type { ShopItem, ShopMission, CoinValue } from '../../../types/learning'
import { useProfileStore } from '../../../store/useProfileStore'
import {
  playClickSound,
  playCoinSound,
  playCashRegisterSound,
  playWrongSound,
} from '../../../utils/audio'
import { FeedbackModal } from '../../common/FeedbackModal'
import {
  ArrowLeft,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  Receipt,
  MinusCircle,
  PlusCircle,
  Check,
  Undo2,
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface ShopGameProps {
  onBack: () => void
}

const COIN_VALUES: CoinValue[] = [50, 20, 10, 5, 2, 1]

export const ShopGame: FC<ShopGameProps> = ({ onBack }) => {
  const [missionIndex, setMissionIndex] = useState(0)
  const [phase, setPhase] = useState<'cart' | 'checkout' | 'completed'>('cart')
  const [cart, setCart] = useState<{ [itemId: string]: number }>({})
  const [returnedCoins, setReturnedCoins] = useState<CoinValue[]>([])
  const [feedback, setFeedback] = useState<{
    isOpen: boolean
    isCorrect: boolean
    title: string
    explanation: string
    hint: string
    xpEarned: number
  }>({
    isOpen: false,
    isCorrect: false,
    title: '',
    explanation: '',
    hint: '',
    xpEarned: 0,
  })

  const { addXp } = useProfileStore()
  const activeProfile = useProfileStore((state) => state.getActiveProfile())
  const currentMission: ShopMission = SHOP_MISSIONS[missionIndex]

  // Calculate current cart total
  const cartTotal = Object.entries(cart).reduce((sum, [itemId, count]) => {
    const item = SHOP_ITEMS.find((i) => i.id === itemId)
    return sum + (item ? item.price * count : 0)
  }, 0)

  // Target cart total
  const targetTotal = currentMission.cartTargets.reduce((sum, target) => {
    const item = SHOP_ITEMS.find((i) => i.id === target.itemId)
    return sum + (item ? item.price * target.count : 0)
  }, 0)

  // Calculate change sum
  const returnedTotal = returnedCoins.reduce((sum, coin) => sum + coin, 0)
  const expectedChange = currentMission.paidWithBanknote - targetTotal

  // Check if cart contains all items from shopping list
  const isCartComplete = currentMission.cartTargets.every(
    (target) => (cart[target.itemId] || 0) === target.count
  )

  const handleAddToCart = (item: ShopItem) => {
    playClickSound()
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }))
  }

  const handleRemoveFromCart = (item: ShopItem) => {
    playClickSound()
    setCart((prev) => {
      const current = prev[item.id] || 0
      if (current <= 1) {
        const next = { ...prev }
        delete next[item.id]
        return next
      }
      return { ...prev, [item.id]: current - 1 }
    })
  }

  const handleAddCoin = (coin: CoinValue) => {
    playCoinSound()
    setReturnedCoins((prev) => [...prev, coin])
  }

  const handleUndoCoin = () => {
    playClickSound()
    setReturnedCoins((prev) => prev.slice(0, -1))
  }

  const handleProceedToCheckout = () => {
    playClickSound()
    setPhase('checkout')
  }

  const handleVerifyChange = () => {
    const isCorrect = returnedTotal === expectedChange

    if (isCorrect) {
      playCashRegisterSound()
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
      addXp(currentMission.xpReward)

      setFeedback({
        isOpen: true,
        isCorrect: true,
        title: '✅ POKLADNA CINKLA! PŘESNĚ!',
        explanation: `Výborně, milá ${activeProfile?.name || 'Eliško'}! Nákup stál ${targetTotal} Kč, zákazník platil bankovkou ${currentMission.paidWithBanknote} Kč. Vrátila jsi přesně ${expectedChange} Kč (${currentMission.paidWithBanknote} – ${targetTotal} = ${expectedChange} Kč).`,
        hint: '',
        xpEarned: currentMission.xpReward,
      })
    } else {
      playWrongSound()
      const diff = Math.abs(returnedTotal - expectedChange)
      setFeedback({
        isOpen: true,
        isCorrect: false,
        title: '❌ POZOR U POKLADNY!',
        explanation:
          returnedTotal < expectedChange
            ? `Vrátila jsi ${returnedTotal} Kč, ale správně máš vrátit ${expectedChange} Kč. Chybí ti ještě ${diff} Kč!`
            : `Vrátila jsi ${returnedTotal} Kč, to je moc! Správně máš vrátit ${expectedChange} Kč (vracíš o ${diff} Kč více).`,
        hint: `Spočítej: ${currentMission.paidWithBanknote} Kč (bankovka) mínus ${targetTotal} Kč (cena nákupu) = ${expectedChange} Kč.`,
        xpEarned: 0,
      })
    }
  }

  const handleNextMission = () => {
    setFeedback((prev) => ({ ...prev, isOpen: false }))
    if (missionIndex + 1 < SHOP_MISSIONS.length) {
      setMissionIndex((prev) => prev + 1)
      setCart({})
      setReturnedCoins([])
      setPhase('cart')
    } else {
      setPhase('completed')
    }
  }

  const restartAllMissions = () => {
    playClickSound()
    setMissionIndex(0)
    setCart({})
    setReturnedCoins([])
    setPhase('cart')
  }

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-4 min-h-[calc(100dvh-130px)] flex flex-col justify-between">
      {/* Header bar */}
      <div className="space-y-2">
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

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-[#7a5c43]">Nákup</span>
            <span className="text-xs font-black text-[#3e2723] bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              {missionIndex + 1} / {SHOP_MISSIONS.length}
            </span>
          </div>
        </div>

        {/* Phase progress indicator */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-black">
          <div
            className={`py-1 rounded-xl border ${
              phase === 'cart'
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            1. Vložit do košíku 🛒
          </div>
          <div
            className={`py-1 rounded-xl border ${
              phase === 'checkout'
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
          >
            2. Pokladna & Vrácení 💰
          </div>
        </div>
      </div>

      {/* PHASE 1: FILLING THE CART */}
      {phase === 'cart' && (
        <div className="my-auto py-2 space-y-3">
          {/* Shopping List Card */}
          <div className="bg-[#fcfaf6] rounded-3xl p-4 border-2 border-[#ebdccb] shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-[#ebdccb] pb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#3e2723]">
                <Receipt className="w-4 h-4 text-amber-700" />
                <span>Nákupní lístek: {currentMission.title}</span>
              </div>
              <span className="text-xs font-black text-amber-700">+{currentMission.xpReward} XP</span>
            </div>

            <p className="text-xs text-[#7a5c43] font-medium italic">{currentMission.story}</p>

            {/* Target Items list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {currentMission.cartTargets.map((target) => {
                const item = SHOP_ITEMS.find((i) => i.id === target.itemId)
                const currentCount = cart[target.itemId] || 0
                const isItemDone = currentCount === target.count

                return (
                  <div
                    key={target.itemId}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                      isItemDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-white border-[#ebdccb] text-[#3e2723]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-lg">{item?.emoji}</span>
                      <span className="truncate">{item?.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`px-1.5 py-0.5 rounded-md ${
                          isItemDone ? 'bg-emerald-200 text-emerald-900 font-black' : 'bg-stone-100'
                        }`}
                      >
                        {currentCount} / {target.count} ks
                      </span>
                      {isItemDone && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Shop Shelf with Items to Tap */}
          <div>
            <div className="flex items-center justify-between px-1 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#7a5c43]">
                Regál s dobrotami (klepni pro přidání):
              </span>
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                Košík: {cartTotal} Kč
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[38vh] overflow-y-auto p-0.5">
              {SHOP_ITEMS.map((item) => {
                const countInCart = cart[item.id] || 0

                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-2xl bg-white border-2 border-[#d8c3ad] border-b-[4px] border-b-[#7a5c43] flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-[#3e2723] block truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] font-black text-emerald-800 block">
                          {item.price} Kč
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-2 pt-1 border-t border-[#ebdccb]">
                      {countInCart > 0 ? (
                        <button
                          onClick={() => handleRemoveFromCart(item)}
                          className="p-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 touch-target min-w-[32px] min-h-[32px] flex items-center justify-center"
                          title="Odebrat z košíku"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-400">0 ks</span>
                      )}

                      <span className="text-xs font-black text-[#3e2723] px-1.5">
                        {countInCart} ks
                      </span>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="p-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 touch-target min-w-[32px] min-h-[32px] flex items-center justify-center font-black text-xs"
                        title="Přidat do košíku"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Proceed to Checkout Button */}
          <button
            disabled={!isCartComplete}
            onClick={handleProceedToCheckout}
            className={`w-full min-h-[48px] py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-md transition-all touch-target ${
              isCartComplete
                ? 'bg-[#059669] hover:bg-[#047857] text-white active:scale-98 shadow-emerald-700/25'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>
              {isCartComplete
                ? `K pokladně (Nákup za ${cartTotal} Kč) ➔`
                : 'Doplň přesný nákup podle lístku'}
            </span>
          </button>
        </div>
      )}

      {/* PHASE 2: CHECKOUT & RETURNING CHANGE */}
      {phase === 'checkout' && (
        <div className="my-auto py-2 space-y-3">
          {/* Bill & Banknote Info Card */}
          <div className="bg-[#fcfaf6] rounded-3xl p-4 border-2 border-[#ebdccb] shadow-xs text-center space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#7a5c43] block">
              Placení u pokladny 🛒
            </span>

            <div className="flex items-center justify-center gap-3">
              <div className="p-2.5 bg-white rounded-2xl border border-[#ebdccb] text-center shadow-2xs">
                <span className="text-[11px] text-[#7a5c43] font-bold block">Cena nákupu:</span>
                <span className="text-xl font-black text-emerald-800">{targetTotal} Kč</span>
              </div>

              <div className="text-xl font-black text-[#7a5c43]">+</div>

              <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-300 text-center shadow-2xs">
                <span className="text-[11px] text-amber-800 font-bold block">Zákazník dává:</span>
                <span className="text-xl font-black text-amber-900">
                  💵 {currentMission.paidWithBanknote} Kč
                </span>
              </div>
            </div>

            <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-2.5 text-xs text-amber-950 font-bold">
              ❓ Úkol pro pokladní {activeProfile?.name || 'Elišku'}: Kolik korun musíš zákazníkovi
              vrátit nazpět?
            </div>
          </div>

          {/* Returned Coins Tray */}
          <div className="bg-white rounded-2xl p-3 border-2 border-[#ebdccb] shadow-inner space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#7a5c43]">
                Peníze na pultu k vrácení:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  Vracíš: {returnedTotal} Kč
                </span>
                {returnedCoins.length > 0 && (
                  <button
                    onClick={handleUndoCoin}
                    className="p-1 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#7a5c43] flex items-center gap-1 touch-target"
                    title="Vrátit minci zpět"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Zpět</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visual list of dropped coins */}
            <div className="min-h-[50px] p-2 bg-[#f7f5f0] rounded-xl border border-dashed border-[#d8c3ad] flex flex-wrap items-center gap-1.5">
              {returnedCoins.length === 0 ? (
                <span className="text-xs text-stone-400 italic mx-auto">
                  Zatím jsi na pult nevydala žádné mince. Klepni na mince níže! 👇
                </span>
              ) : (
                returnedCoins.map((coin, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 border-2 border-amber-600 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs select-none"
                  >
                    {coin}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Clickable Coins Drawer (Tactile min 48x48px touch target) */}
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#7a5c43] block px-1 mb-1.5">
              Klikací mince v pokladně:
            </span>
            <div className="grid grid-cols-6 gap-1.5">
              {COIN_VALUES.map((coin) => (
                <motion.button
                  key={coin}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleAddCoin(coin)}
                  className="min-h-[52px] rounded-2xl bg-gradient-to-b from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border-2 border-b-[4px] border-[#b08968] active:border-b-2 active:translate-y-[2px] flex flex-col items-center justify-center shadow-xs touch-target cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-black text-amber-950">{coin}</span>
                  <span className="text-[9px] font-extrabold text-amber-800 -mt-1">Kč</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Verify Change Button */}
          <div className="pt-2">
            <button
              onClick={handleVerifyChange}
              className="w-full min-h-[50px] py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-base flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform touch-target shadow-emerald-700/25"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Zkontrolovat vrácené peníze ({returnedTotal} Kč) 💰</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: COMPLETED ALL MISSIONS */}
      {phase === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto bg-white rounded-3xl p-6 border-2 border-[#ebdccb] shadow-lg text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-[#3e2723]">
            Všechny nákupy spočítány! 🎉
          </h2>
          <p className="text-sm text-[#7a5c43] font-medium">
            Milá {activeProfile?.name || 'Eliško'}, jsi fantastická pokladní! Všechny nákupy i
            vrácené peníze jsi spočítala na jedničku.
          </p>

          <div className="flex flex-col gap-2 pt-3">
            <button
              onClick={() => {
                playClickSound()
                onBack()
              }}
              className="w-full min-h-[48px] py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-base shadow-md active:scale-95 transition-transform"
            >
              Zpět na přehled doučování 🐾
            </button>
            <button
              onClick={restartAllMissions}
              className="w-full min-h-[44px] py-2.5 rounded-2xl bg-[#ebdccb]/70 hover:bg-[#ebdccb] text-[#7a5c43] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Hrát znovu od 1. nákupu</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Instant Feedback Modal */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        isCorrect={feedback.isCorrect}
        title={feedback.title}
        explanation={feedback.explanation}
        hint={feedback.hint}
        xpEarned={feedback.xpEarned}
        onNext={handleNextMission}
        buttonText={feedback.isCorrect ? 'Další nákup 🛒 ➔' : 'Zkusit spočítat znovu 🔄'}
      />
    </div>
  )
}
