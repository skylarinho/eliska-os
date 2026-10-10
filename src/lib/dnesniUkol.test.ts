import { describe, expect, it } from 'vitest'
import { vyberDnesniUkol, type Plan, type StavLekci } from './dnesniUkol'

const katalog = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
const plan: Plan = { od: '2026-10-12', do: '2026-10-25', lekce: ['a', 'b', 'c'] }
const prazdny: StavLekci = { hvezdy: {}, dokonceno: {} }

describe('vyberDnesniUkol', () => {
  it('uprostřed plánu nabídne první nedokončenou lekci a spočítá postup', () => {
    const stav: StavLekci = { hvezdy: { a: 3 }, dokonceno: { a: '2026-10-13' } }
    expect(vyberDnesniUkol(plan, stav, katalog, '2026-10-14')).toEqual({
      typ: 'ukol',
      lekceId: 'b',
      hotovo: 1,
      celkem: 3,
    })
  })

  it('po dnešní hotové lekci ukáže „na dnes hotovo“ a další lekci nabídne', () => {
    const stav: StavLekci = { hvezdy: { a: 2 }, dokonceno: { a: '2026-10-14' } }
    expect(vyberDnesniUkol(plan, stav, katalog, '2026-10-14')).toEqual({
      typ: 'na-dnes-hotovo',
      dalsiId: 'b',
      hotovo: 1,
      celkem: 3,
    })
  })

  it('lekce dokončená před začátkem plánu se nepočítá', () => {
    const stav: StavLekci = { hvezdy: { a: 3 }, dokonceno: { a: '2026-10-05' } }
    expect(vyberDnesniUkol(plan, stav, katalog, '2026-10-12')).toMatchObject({ typ: 'ukol', lekceId: 'a', hotovo: 0 })
  })

  it('když je vše hotovo, plán je splněn a navrhne lekci s nejméně hvězdami', () => {
    const stav: StavLekci = {
      hvezdy: { a: 3, b: 2, c: 3, d: 1 },
      dokonceno: { a: '2026-10-12', b: '2026-10-13', c: '2026-10-14' },
    }
    expect(vyberDnesniUkol(plan, stav, katalog, '2026-10-15')).toEqual({
      typ: 'plan-splnen',
      navrhId: 'd',
      hotovo: 3,
      celkem: 3,
    })
  })

  it('po datu „do“ vybere lekci s nejméně hvězdami', () => {
    const stav: StavLekci = { hvezdy: { a: 3, b: 1, c: 2, d: 3 }, dokonceno: {} }
    expect(vyberDnesniUkol(plan, stav, katalog, '2026-10-26')).toEqual({ typ: 'volna', navrhId: 'b' })
  })

  it('před začátkem plánu je volná volba', () => {
    expect(vyberDnesniUkol(plan, prazdny, katalog, '2026-10-11')).toMatchObject({ typ: 'volna' })
  })

  it('bez plánu vybere lekci s nejméně hvězdami, při shodě první v katalogu', () => {
    expect(vyberDnesniUkol(null, prazdny, katalog, '2026-10-14')).toEqual({ typ: 'volna', navrhId: 'a' })
  })

  it('neznámé id v plánu přeskočí', () => {
    const p: Plan = { ...plan, lekce: ['x', 'b'] }
    expect(vyberDnesniUkol(p, prazdny, katalog, '2026-10-14')).toMatchObject({ lekceId: 'b', celkem: 1 })
  })
})
