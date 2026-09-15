import type { FC } from 'react'
import { motion } from 'framer-motion'

export type WombatExpression = 'happy' | 'thinking' | 'success' | 'curious'

interface WombatPeekerProps {
  expression?: WombatExpression
  speechBubble?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showStars?: boolean
}

export const WombatPeeker: FC<WombatPeekerProps> = ({
  expression = 'happy',
  speechBubble,
  className = '',
  size = 'md',
  showStars = false,
}) => {
  const sizeMap = {
    sm: 'w-20 h-16',
    md: 'w-28 h-22 sm:w-32 sm:h-24',
    lg: 'w-36 h-28 sm:w-44 sm:h-34',
  }

  const isSuccess = expression === 'success' || showStars
  const isCurious = expression === 'curious' || expression === 'thinking'

  return (
    <div className={`relative flex flex-col items-center justify-end pointer-events-none select-none ${className}`}>
      {/* Speech bubble if provided */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute -top-12 z-20 max-w-[210px] bg-white border-2 border-[#b08968] rounded-2xl px-3 py-1.5 shadow-md text-xs text-[#3e2723] font-medium text-center"
        >
          {speechBubble}
          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#b08968]" />
        </motion.div>
      )}

      {/* Sparkles / Stars when correct */}
      {isSuccess && (
        <div className="absolute inset-0 -top-6 overflow-visible pointer-events-none">
          <motion.span
            animate={{ scale: [0.8, 1.3, 0.9], rotate: [0, 25, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="absolute -top-2 left-2 text-amber-400 text-lg sm:text-xl drop-shadow"
          >
            ✨
          </motion.span>
          <motion.span
            animate={{ scale: [1, 1.4, 1], rotate: [0, -20, 0], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.4, delay: 0.3 }}
            className="absolute -top-4 right-3 text-amber-400 text-lg sm:text-xl drop-shadow"
          >
            ⭐
          </motion.span>
          <motion.span
            animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.6 }}
            className="absolute top-2 -right-4 text-emerald-500 text-sm drop-shadow"
          >
            🌟
          </motion.span>
        </div>
      )}

      {/* Handcrafted Vector Wombat Peeking Over Edge with Paws */}
      <motion.div
        animate={
          isCurious
            ? { rotate: [-2, 2, -2], y: [0, -3, 0] }
            : isSuccess
            ? { y: [0, -6, 0] }
            : { y: [0, -2, 0] }
        }
        transition={{ repeat: Infinity, duration: isCurious ? 2.5 : 2, ease: 'easeInOut' }}
        className={`${sizeMap[size]} relative overflow-visible`}
      >
        <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            {/* Fur gradient */}
            <linearGradient id="wombatFur" x1="80" y1="10" x2="80" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9c7a5b" />
              <stop offset="60%" stopColor="#7a5c43" />
              <stop offset="100%" stopColor="#604430" />
            </linearGradient>
            {/* Muzzle gradient */}
            <linearGradient id="wombatSnout" x1="80" y1="50" x2="80" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ebdccb" />
              <stop offset="100%" stopColor="#d8c3ad" />
            </linearGradient>
          </defs>

          {/* Left Ear */}
          <ellipse cx="42" cy="36" rx="14" ry="16" transform="rotate(-15 42 36)" fill="#7a5c43" />
          <ellipse cx="43" cy="36" rx="8" ry="10" transform="rotate(-15 43 36)" fill="#d8c3ad" />

          {/* Right Ear */}
          <ellipse cx="118" cy="36" rx="14" ry="16" transform="rotate(15 118 36)" fill="#7a5c43" />
          <ellipse cx="117" cy="36" rx="8" ry="10" transform="rotate(15 117 36)" fill="#d8c3ad" />

          {/* Chubby Wombat Head */}
          <ellipse cx="80" cy="65" rx="52" ry="46" fill="url(#wombatFur)" />

          {/* Cheeks blush */}
          <ellipse cx="48" cy="74" rx="10" ry="6" fill="#f87171" opacity="0.35" />
          <ellipse cx="112" cy="74" rx="10" ry="6" fill="#f87171" opacity="0.35" />

          {/* Snout / Muzzle */}
          <ellipse cx="80" cy="78" rx="28" ry="22" fill="url(#wombatSnout)" />

          {/* Big Wombat Nose */}
          <ellipse cx="80" cy="70" rx="14" ry="9" fill="#3e2723" />
          <ellipse cx="76" cy="68" rx="4" ry="2" fill="#7a5c43" opacity="0.6" />

          {/* Mouth */}
          {isSuccess ? (
            // Big happy smile
            <path d="M72 82 Q80 92 88 82" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" fill="#e11d48" />
          ) : isCurious ? (
            // Curious slight 'o' mouth
            <ellipse cx="80" cy="85" rx="3.5" ry="4.5" fill="#3e2723" />
          ) : (
            // Friendly calm smile
            <path d="M73 82 Q80 88 87 82" stroke="#3e2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}

          {/* Eyes */}
          {isSuccess ? (
            // Happy closed crescent eyes
            <>
              <path d="M53 58 Q60 50 67 58" stroke="#3e2723" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M93 58 Q100 50 107 58" stroke="#3e2723" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            // Open twinkling dark eyes
            <>
              <circle cx="60" cy="56" r="6" fill="#3e2723" />
              <circle cx="58" cy="54" r="2.2" fill="#ffffff" />
              <circle cx="100" cy="56" r="6" fill="#3e2723" />
              <circle cx="98" cy="54" r="2.2" fill="#ffffff" />
              {/* Eyebrows */}
              <path
                d={isCurious ? 'M54 48 Q60 45 66 49' : 'M54 47 Q60 45 66 47'}
                stroke="#604430"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={isCurious ? 'M94 49 Q100 43 106 46' : 'M94 47 Q100 45 106 47'}
                stroke="#604430"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* Paws Resting on the Horizontal Ledge (Bottom border) */}
          {/* Left Paw */}
          <g>
            <ellipse cx="44" cy="112" rx="16" ry="10" fill="#7a5c43" stroke="#604430" strokeWidth="1.5" />
            {/* Claws gripping */}
            <circle cx="35" cy="116" r="2.5" fill="#3e2723" />
            <circle cx="43" cy="118" r="2.5" fill="#3e2723" />
            <circle cx="51" cy="117" r="2.5" fill="#3e2723" />
          </g>

          {/* Right Paw */}
          <g>
            <ellipse cx="116" cy="112" rx="16" ry="10" fill="#7a5c43" stroke="#604430" strokeWidth="1.5" />
            {/* Claws gripping */}
            <circle cx="109" cy="117" r="2.5" fill="#3e2723" />
            <circle cx="117" cy="118" r="2.5" fill="#3e2723" />
            <circle cx="125" cy="116" r="2.5" fill="#3e2723" />
          </g>
        </svg>
      </motion.div>
    </div>
  )
}
