import { describe, expect, it } from 'vitest'
import { migrujProfily } from './migrace'

const vok = (j: string) => (j === 'Eliška' ? 'Eliško' : j)

describe('migrujProfily', () => {
  it('dokončené lekce dostanou 1 hvězdu, XP a e-mail zmizí, doplní se vokativ', () => {
    const [p] = migrujProfily(
      [{ id: 'x', name: 'Eliška', avatar: 'liska', xp: 500, streakDays: 4, schoolEmail: 'a@b.cz', completedLessons: ['lesson-hw'] }],
      vok,
    )
    expect(p).toEqual({
      id: 'x',
      name: 'Eliška',
      vokativ: 'Eliško',
      avatar: 'liska',
      hvezdy: { 'lesson-hw': 1 },
      dokonceno: {},
      serie: { pocet: 0, posledni: '' },
    })
    expect(p).not.toHaveProperty('xp')
    expect(p).not.toHaveProperty('schoolEmail')
  })

  it('už migrovaný profil nepoškodí', () => {
    const vstup = {
      id: 'x',
      name: 'Eliška',
      vokativ: 'Eliško',
      avatar: 'vombat',
      hvezdy: { a: 3 },
      dokonceno: { a: '2026-10-14' },
      serie: { pocet: 2, posledni: '2026-10-14' },
    }
    expect(migrujProfily([vstup], vok)).toEqual([vstup])
  })

  it('nesmysl vrátí prázdný seznam', () => {
    expect(migrujProfily(undefined, vok)).toEqual([])
  })
})
