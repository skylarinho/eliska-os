/**
 * Kresba hřibu „modrým perem“ (viewBox 0 0 320 280) a texty k jeho částem.
 * Části se dají ťuknout; plodnice = všechno nad zemí (klobouk, rourky a třeň).
 */

export type CastHouby = 'klobouk' | 'rourky' | 'tren' | 'podhoubi'
export type CilHouby = CastHouby | 'plodnice'

export const NAD_ZEMI: CastHouby[] = ['klobouk', 'rourky', 'tren']

/** Patří ťuknutá část k cíli? U plodnice stačí kterákoli část nad zemí. */
export const patri = (cast: CastHouby, cil: CilHouby) => (cil === 'plodnice' ? NAD_ZEMI.includes(cast) : cast === cil)

export const NAZVY: Record<CilHouby, string> = {
  klobouk: 'Klobouk',
  rourky: 'Rourky s výtrusy',
  tren: 'Třeň',
  podhoubi: 'Podhoubí',
  plodnice: 'Plodnice',
}

/** 4. pád pro „Ťukni na …“. */
export const AKUZATIV: Record<CilHouby, string> = {
  klobouk: 'klobouk',
  rourky: 'rourky s výtrusy',
  tren: 'třeň',
  podhoubi: 'podhoubí',
  plodnice: 'plodnici',
}

export const VYKLAD: Record<CilHouby, string> = {
  klobouk: 'Klobouk je vrchní část houby. Chrání spodní stranu, kde se tvoří výtrusy.',
  rourky:
    'Hřib má na spodní straně klobouku rourky, jiné houby tam mají lupeny. Tvoří se v nich výtrusy – drobounká zrnka, ze kterých vyroste nová houba. Jsou tak malé, že je roznáší vítr.',
  tren: 'Třeň je noha houby. Drží klobouk nad zemí, aby vítr mohl výtrusy roznést daleko.',
  podhoubi:
    'Podhoubí jsou tenounká vlákna v zemi. Je to hlavní část houby a žije i mnoho let. Saje z půdy vodu a živiny.',
  plodnice:
    'Plodnice je všechno, co z houby vidíme nad zemí: klobouk, rourky a třeň. Vyroste jen na pár dní, aby se houba rozmnožila výtrusy. Když houbu utrhneme, podhoubí v zemi žije dál.',
}
