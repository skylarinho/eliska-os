import type { FC, ReactNode } from 'react'

interface SesitProps {
  children: ReactNode
  className?: string
}

/** List školního sešitu: čtverečkovaný papír, červený okraj, na desktopu max. 620 px na stole. */
export const Sesit: FC<SesitProps> = ({ children, className = '' }) => (
  <div className="stul min-h-[100dvh] bg-stul">
    <main className={`sesit ${className}`}>{children}</main>
  </div>
)
