import { describe, expect, it } from 'vitest'
import { aktualniSerie, spocitejHvezdy, zapisDokonceni } from './postup'

describe('spocitejHvezdy', () => {
  it('3 bez chyby, 2 s jednou chybou, 1 s více', () => {
    expect(spocitejHvezdy(0)).toBe(3)
    expect(spocitejHvezdy(1)).toBe(2)
    expect(spocitejHvezdy(2)).toBe(1)
    expect(spocitejHvezdy(9)).toBe(1)
  })
})

describe('série dní', () => {
  it('první lekce začne sérii na 1', () => {
    expect(zapisDokonceni({ pocet: 0, posledni: '' }, '2026-10-14')).toEqual({ pocet: 1, posledni: '2026-10-14' })
  })
  it('druhá lekce v týž den sérii nezvyšuje', () => {
    const s = { pocet: 3, posledni: '2026-10-14' }
    expect(zapisDokonceni(s, '2026-10-14')).toBe(s)
  })
  it('lekce další den sérii zvýší, i přes hranici měsíce', () => {
    expect(zapisDokonceni({ pocet: 3, posledni: '2026-10-31' }, '2026-11-01')).toEqual({ pocet: 4, posledni: '2026-11-01' })
  })
  it('vynechaný den sérii restartuje', () => {
    expect(zapisDokonceni({ pocet: 5, posledni: '2026-10-12' }, '2026-10-14')).toEqual({ pocet: 1, posledni: '2026-10-14' })
  })
  it('zobrazená série je 0, když dítě přeskočilo den', () => {
    expect(aktualniSerie({ pocet: 5, posledni: '2026-10-13' }, '2026-10-14')).toBe(5)
    expect(aktualniSerie({ pocet: 5, posledni: '2026-10-12' }, '2026-10-14')).toBe(0)
  })
})
