import { describe, expect, it } from 'vitest'
import { dalsiLekceVPredmetu } from './dalsiLekce'
import { naHash, zHashe } from './trasa'

const lekce = [
  { id: 'c1', predmet: 'cestina' },
  { id: 'm1', predmet: 'matematika' },
  { id: 'c2', predmet: 'cestina' },
  { id: 'c3', predmet: 'cestina' },
  { id: 'i1', predmet: 'informatika' },
]

describe('dalsiLekceVPredmetu', () => {
  it('nabídne další lekci ze stejného předmětu', () => {
    expect(dalsiLekceVPredmetu(lekce, 'c1', {})?.id).toBe('c2')
  })
  it('přeskočí lekce se 3 hvězdami a jde dokola', () => {
    expect(dalsiLekceVPredmetu(lekce, 'c2', { c3: 3 })?.id).toBe('c1')
  })
  it('když mají všechny 3 hvězdy, nabídne prostě další', () => {
    expect(dalsiLekceVPredmetu(lekce, 'c3', { c1: 3, c2: 3, c3: 3 })?.id).toBe('c1')
  })
  it('předmět s jedinou lekcí nic nenabídne', () => {
    expect(dalsiLekceVPredmetu(lekce, 'i1', {})).toBeNull()
  })
})

describe('trasa', () => {
  it('převádí hash tam a zpět', () => {
    for (const t of [{ typ: 'domu' }, { typ: 'predmet', predmet: 'cestina' }, { typ: 'lekce', id: 'vlastiveda-doba-zelezna' }] as const)
      expect(zHashe(naHash(t))).toEqual(t)
  })
  it('neznámý hash vede na přehled', () => {
    expect(zHashe('#/predmet/telocvik')).toEqual({ typ: 'domu' })
    expect(zHashe('')).toEqual({ typ: 'domu' })
  })
})
