import type { FC } from 'react'

interface HardwareIconProps {
  itemId: string
  emojiFallback: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const HardwareIcon: FC<HardwareIconProps> = ({ itemId, emojiFallback, className = '', size = 'md' }) => {
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-6xl' : size === 'sm' ? 'w-8 h-8 text-2xl' : 'w-12 h-12 text-4xl'

  if (itemId === 'flashdisk') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 100 100"
          className={size === 'lg' ? 'w-24 h-24' : size === 'sm' ? 'w-7 h-7' : 'w-12 h-12'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Metal USB Connector */}
          <rect x="36" y="14" width="28" height="26" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="2.5" />
          {/* USB Contact Pins */}
          <rect x="42" y="20" width="5" height="10" rx="1.5" fill="#475569" />
          <rect x="53" y="20" width="5" height="10" rx="1.5" fill="#475569" />

          {/* Flash Drive Plastic/Metal Body */}
          <rect x="28" y="36" width="44" height="48" rx="8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />

          {/* Grip lines / Texture on body */}
          <line x1="36" y1="52" x2="64" y2="52" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="60" x2="64" y2="60" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />

          {/* Small Activity LED */}
          <circle cx="50" cy="70" r="3" fill="#34d399" />

          {/* Keychain Hole at bottom */}
          <ellipse cx="50" cy="80" rx="4" ry="2" fill="#1d4ed8" />
        </svg>
      </div>
    )
  }

  // Other items render clean emojis or symbols
  return (
    <span className={`inline-flex items-center justify-center ${sizeClass} ${className} select-none`}>
      {emojiFallback}
    </span>
  )
}
