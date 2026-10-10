import type { ButtonHTMLAttributes, FC, ReactNode } from 'react'

export type StavOdpovedi = 'ok' | 'spatne' | null

interface OdpovedTlacitkoProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  stav?: StavOdpovedi
  children: ReactNode
  /** Drobný popisek pod hlavním obsahem („měkké“, „tvrdé“). */
  popisek?: string
}

const stavy: Record<'ok' | 'spatne' | 'zakladni', string> = {
  zakladni: 'border-inkoust-3 bg-papir disabled:opacity-45',
  ok: 'border-spravne bg-spravne-bg text-spravne disabled:opacity-100',
  spatne: 'border-oprava bg-oprava-bg text-oprava disabled:opacity-100',
}

/** Odpověď k zaťukání: výška aspoň 72 px, dole silnější okraj jako „tlačítko“. */
export const OdpovedTlacitko: FC<OdpovedTlacitkoProps> = ({ stav = null, popisek, children, className = '', ...props }) => (
  <button
    type="button"
    {...props}
    className={`flex min-h-[76px] flex-col items-center justify-center rounded-m border-2 border-b-[5px] text-[30px] leading-none font-semibold enabled:active:translate-y-[3px] enabled:active:border-b-2 ${stavy[stav ?? 'zakladni']} ${className}`}
  >
    {children}
    {popisek && <small className="mt-1.5 text-[14px] font-normal text-inkoust-2">{popisek}</small>}
  </button>
)
