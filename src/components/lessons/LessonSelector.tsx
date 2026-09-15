import { useState, type FC } from 'react'
import { motion } from 'framer-motion'
import { LESSONS_META, type LessonMeta } from '../../data/lessonsData'
import { useProfileStore } from '../../store/useProfileStore'
import { WombatPeeker } from '../common/WombatPeeker'
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { playClickSound } from '../../utils/audio'

interface LessonSelectorProps {
  onSelectLesson: (lessonId: string) => void
}

interface NewGameMeta {
  id: string
  title: string
  shortTitle: string
  subject: string
  icon: string
  description: string
  rewardXp: number
  badge: string
}

const LEARNING_ZONE_GAMES: NewGameMeta[] = [
  {
    id: 'game-shop',
    title: 'Vombatův obchůdek & Slovní úlohy',
    shortTitle: 'Vombatův obchůdek 🛒',
    subject: 'Matematika & Finance',
    icon: '🛒',
    description: 'Nákupní lístek, skládání do košíku a přesné vracení mincí!',
    rewardXp: 45,
    badge: 'Eliščin nejoblíbenější ⭐',
  },
  {
    id: 'game-math',
    title: 'Matematická laboratoř',
    shortTitle: 'Matematická laboratoř 🧪',
    subject: 'Matematika',
    icon: '🧪',
    description: 'Rozklad na desítky/jednotky (48+35) a vizuální násobilková stezka.',
    rewardXp: 35,
    badge: 'Počítání s vombatem',
  },
  {
    id: 'game-czech',
    title: 'Vyjmenovaná slova s Vombatem',
    shortTitle: 'Vyjmenovaná slova B–Z ✍️',
    subject: 'Český jazyk',
    icon: '✍️',
    description: 'Doplňovačka I/Y s výběrem písmen B až Z a vombatím rozborem chytáků.',
    rewardXp: 30,
    badge: 'Rébusy a kořeny slov',
  },
  {
    id: 'game-english',
    title: 'Angličtina pro radost',
    shortTitle: 'Angličtina s poslechem 🇬🇧',
    subject: 'Anglický jazyk',
    icon: '🇬🇧',
    description: 'Slovíčka s českým fonetickým přepisem a hlasovým poslechem 🔊.',
    rewardXp: 30,
    badge: 'Hlasová výslovnost',
  },
]

export const LessonSelector: FC<LessonSelectorProps> = ({ onSelectLesson }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'doucovani' | 'historie'>('all')
  const activeProfile = useProfileStore((state) => state.getActiveProfile())
  const completedLessons = activeProfile?.completedLessons || []

  // Clean vocative greeting for Czech
  const getGreeting = () => {
    const name = activeProfile?.name?.trim() || 'Eliška'
    if (name.toLowerCase() === 'eliška') return 'Ahoj Eliško! 👋'
    if (name.toLowerCase().endsWith('a')) return `Ahoj ${name.slice(0, -1)}o! 👋`
    return `Ahoj ${name}! 👋`
  }

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-3 space-y-3.5">
      {/* Welcome Hero Banner with Peeking Wombat */}
      <div className="relative bg-gradient-to-br from-[#ebdccb] to-[#f7f5f0] border-2 border-[#d8c3ad] rounded-3xl p-4 pt-10 text-center shadow-xs mt-6">
        <div className="-top-12 absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <WombatPeeker expression="happy" size="md" />
        </div>

        <span className="inline-block text-xs font-black px-2.5 py-0.5 rounded-full bg-[#7a5c43] text-[#f7f5f0] uppercase tracking-wider mb-1">
          Školačka {activeProfile?.name || 'Eliška'} 🎒
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-[#3e2723] tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-xs sm:text-sm text-[#7a5c43] font-bold mt-0.5">
          „S vombatem se naučíme všechno hravě! 🐾“
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#ebdccb]/50 rounded-2xl border border-[#d8c3ad]/70">
        <button
          onClick={() => {
            playClickSound()
            setActiveTab('all')
          }}
          className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'all'
              ? 'bg-[#7a5c43] text-white shadow-xs'
              : 'text-[#7a5c43] hover:bg-white/50'
          }`}
        >
          Vše 🌟
        </button>
        <button
          onClick={() => {
            playClickSound()
            setActiveTab('doucovani')
          }}
          className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'doucovani'
              ? 'bg-[#7a5c43] text-white shadow-xs'
              : 'text-[#7a5c43] hover:bg-white/50'
          }`}
        >
          Doučování 🛒
        </button>
        <button
          onClick={() => {
            playClickSound()
            setActiveTab('historie')
          }}
          className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${
            activeTab === 'historie'
              ? 'bg-[#7a5c43] text-white shadow-xs'
              : 'text-[#7a5c43] hover:bg-white/50'
          }`}
        >
          Vlastivěda & PC ⏳
        </button>
      </div>

      {/* SECTION 1: HRAVÁ DOUČOVACÍ ZÓNA (Obchůdek, Matematika, Čeština, Angličtina) */}
      {(activeTab === 'all' || activeTab === 'doucovani') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#7a5c43] flex items-center gap-1.5">
              <span>🛒 Hravá doučovací zóna</span>
              <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.2 rounded-full border border-amber-300 font-bold">
                Doporučeno
              </span>
            </h2>
          </div>

          <div className="space-y-2">
            {LEARNING_ZONE_GAMES.map((game) => (
              <motion.button
                key={game.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playClickSound()
                  onSelectLesson(game.id)
                }}
                className="w-full text-left p-3 rounded-2xl bg-white hover:bg-[#fdfcf9] border-2 border-[#d8c3ad] border-b-[4px] border-b-[#7a5c43] active:border-b-2 active:translate-y-[2px] shadow-xs flex items-center justify-between gap-3 transition-all touch-target cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {game.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-[#ebdccb] text-[#7a5c43]">
                        {game.subject}
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                        {game.badge}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-[#3e2723] truncate mt-0.5">
                      {game.shortTitle}
                    </h3>
                    <p className="text-[11px] text-[#7a5c43] font-medium line-clamp-1">
                      {game.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xl flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    +{game.rewardXp}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#b08968]" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: VLASTIVĚDA & INFORMATIKA */}
      {(activeTab === 'all' || activeTab === 'historie') && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#7a5c43]">
              🏛️ Vlastivěda & Informatika:
            </h2>
            <span className="text-xs font-bold text-[#3e2723]">
              Splněno: {completedLessons.length} / {LESSONS_META.length}
            </span>
          </div>

          <div className="space-y-2">
            {LESSONS_META.map((lesson: LessonMeta) => {
              const isDone = completedLessons.includes(lesson.id)

              return (
                <motion.button
                  key={lesson.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playClickSound()
                    onSelectLesson(lesson.id)
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-white hover:bg-[#fdfcf9] border-2 border-[#ebdccb] active:border-[#7a5c43] shadow-xs flex items-center justify-between gap-3 transition-all touch-target"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#f7f5f0] border border-[#ebdccb] flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      {lesson.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#ebdccb]/60 text-[#7a5c43]">
                          {lesson.subject}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-extrabold text-emerald-700 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Splněno
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-[#3e2723] truncate mt-0.5">
                        {lesson.shortTitle}
                      </h3>
                      <p className="text-[11px] text-[#7a5c43] font-medium line-clamp-1">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xl flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      +{lesson.rewardXp}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#b08968]" />
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
