import { describe, expect, it } from 'vitest'
import { CZECH_EXERCISES } from './czechData'
import { VYJMENOVANA_SLOVA, jeSpravne, rozdelZvratne } from './vyjmenovanaSlova'

describe('věty k doplnění', () => {
  it('mají unikátní id', () => {
    const id = CZECH_EXERCISES.map((c) => c.id)
    expect(new Set(id).size).toBe(id.length)
  })

  it.each(CZECH_EXERCISES.map((c) => [c.id, c] as const))('%s: po doplnění vznikne chybějící slovo', (_, c) => {
    expect(c.sentence.split('__')).toHaveLength(2)
    expect(c.sentence.replace('__', c.correctAnswer)).toContain(c.missingWord)
  })

  it('každá skupina má aspoň 8 vět', () => {
    for (const g of ['B', 'L', 'M', 'P', 'S', 'V', 'Z'] as const) {
      const n = CZECH_EXERCISES.filter((c) => c.letterGroup === g).length
      expect(n, `skupina ${g}`).toBeGreaterThanOrEqual(g === 'Z' ? 6 : 8)
    }
  })
})

describe('slova k napsání', () => {
  it('každé obsahuje tvrdé y nebo ý a začíná se nebo obsahuje písmeno skupiny', () => {
    for (const s of VYJMENOVANA_SLOVA) {
      expect(s.slovo, s.slovo).toMatch(/[yý]/)
      expect(s.slovo.toLowerCase(), s.slovo).toContain(s.skupina.toLowerCase())
    }
  })

  it('nejsou duplicitní', () => {
    const slova = VYJMENOVANA_SLOVA.map((s) => s.slovo)
    expect(new Set(slova).size).toBe(slova.length)
  })
})

describe('jeSpravne', () => {
  const bylina = { skupina: 'B' as const, slovo: 'bylina', napoveda: '' }
  const blyskat = { skupina: 'L' as const, slovo: 'blýskat se', napoveda: '' }
  const myslit = { skupina: 'M' as const, slovo: 'myslit', napoveda: '', takeSpravne: ['myslet'] }
  const ruzyne = { skupina: 'Z' as const, slovo: 'Ruzyně', napoveda: '' }

  it('uzná slovo s mezerami okolo a velkým písmenem', () => {
    expect(jeSpravne('  Bylina ', bylina)).toBe(true)
    expect(jeSpravne('ruzyně', ruzyne)).toBe(true)
  })

  it('neuzná slovo s měkkým i ani bez čárky', () => {
    expect(jeSpravne('bilina', bylina)).toBe(false)
    expect(jeSpravne('ruzyne', ruzyne)).toBe(false)
    expect(jeSpravne('blyskat', blyskat)).toBe(false)
  })

  it('zvratné se je nepovinné', () => {
    expect(jeSpravne('blýskat', blyskat)).toBe(true)
    expect(jeSpravne('blýskat  se', blyskat)).toBe(true)
  })

  it('uzná i jiný povolený tvar', () => {
    expect(jeSpravne('myslet', myslit)).toBe(true)
  })

  it('uzná rozložené znaky z klávesnice (NFD)', () => {
    expect(jeSpravne('ruzyně'.normalize('NFD'), ruzyne)).toBe(true)
  })

  it('rozdelZvratne', () => {
    expect(rozdelZvratne('nazývat se')).toEqual({ zaklad: 'nazývat', zvratne: 'se' })
    expect(rozdelZvratne('syn')).toEqual({ zaklad: 'syn' })
  })
})
