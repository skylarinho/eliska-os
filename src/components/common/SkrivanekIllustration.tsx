import type { FC } from 'react'
import { motion } from 'framer-motion'

interface SkrivanekIllustrationProps {
  className?: string
  size?: number
}

export const SkrivanekIllustration: FC<SkrivanekIllustrationProps> = ({
  className = '',
  size = 56,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Little musical notes floating from beak */}
      <motion.span
        animate={{ y: [-2, -8, -2], opacity: [0.4, 1, 0.4], x: [0, 3, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute -top-1 -right-2 text-amber-600 text-xs font-bold select-none pointer-events-none"
      >
        🎵
      </motion.span>

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="larkBody" x1="50" y1="30" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c4a482" />
            <stop offset="50%" stopColor="#a37e58" />
            <stop offset="100%" stopColor="#7a5c43" />
          </linearGradient>
          <linearGradient id="larkBelly" x1="60" y1="50" x2="60" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fdfcf9" />
            <stop offset="100%" stopColor="#ebdccb" />
          </linearGradient>
        </defs>

        {/* Tail feathers */}
        <path d="M22 68 L8 76 L25 60 Z" fill="#604430" />
        <path d="M25 64 L12 70 L28 58 Z" fill="#7a5c43" />

        {/* Lark Body */}
        <ellipse cx="48" cy="62" rx="26" ry="20" fill="url(#larkBody)" />

        {/* Crest (Chocholka) on top of head */}
        <path d="M60 25 L64 12 L68 26 Z" fill="#7a5c43" />
        <path d="M66 26 L72 16 L72 28 Z" fill="#8b5a2b" />
        <path d="M57 28 L58 18 L63 28 Z" fill="#a37e58" />

        {/* Lark Head */}
        <circle cx="66" cy="38" r="16" fill="url(#larkBody)" />

        {/* Soft spotted chest / belly */}
        <ellipse cx="56" cy="66" rx="16" ry="13" fill="url(#larkBelly)" />
        {/* Speckles */}
        <circle cx="52" cy="62" r="1.5" fill="#7a5c43" opacity="0.6" />
        <circle cx="58" cy="65" r="1.5" fill="#7a5c43" opacity="0.6" />
        <circle cx="54" cy="70" r="1.2" fill="#7a5c43" opacity="0.6" />

        {/* Wing with feather texture */}
        <ellipse cx="42" cy="60" rx="14" ry="10" transform="rotate(-15 42 60)" fill="#604430" />
        <path d="M34 58 Q44 60 48 68" stroke="#ebdccb" strokeWidth="1.5" strokeLinecap="round" />

        {/* Eye */}
        <circle cx="70" cy="35" r="3.2" fill="#3e2723" />
        <circle cx="71" cy="34" r="1" fill="#ffffff" />

        {/* Singing Open Beak */}
        <path d="M78 36 L92 34 L79 40 Z" fill="#d97706" />
        <path d="M79 40 L88 42 L78 44 Z" fill="#b45309" />

        {/* Little bird feet */}
        <path d="M42 81 L42 90 M42 90 L38 93 M42 90 L46 93" stroke="#7a5c43" strokeWidth="2" strokeLinecap="round" />
        <path d="M54 81 L54 90 M54 90 L50 93 M54 90 L58 93" stroke="#7a5c43" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}
