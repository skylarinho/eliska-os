/** Zamíchá pole (Fisher–Yates) a vrátí kopii; původní pole nemění. */
export function michej<T>(pole: readonly T[], nahoda: () => number = Math.random): T[] {
  const kopie = [...pole]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(nahoda() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}
