import { describe, expect, it } from 'vitest'
import { parsujLekci, zkontrolujPlan, type Hlaseni } from './obsah.ts'

const hlavicka = `---
id: test-lekce
nazev: Zkouška
popis: Zkušební lekce
predmet: vlastiveda
---
`

function pokus(telo: string, hlavickaTextu = hlavicka) {
  const h: Hlaseni = { chyby: [], varovani: [] }
  const lekce = parsujLekci(hlavickaTextu + telo, 'obsah/otazky/test.md', h)
  return { lekce, ...h }
}

describe('parsujLekci', () => {
  it('přečte všech pět typů otázek', () => {
    const { lekce, chyby } = pokus(`
## Výběr?
- [x] Správně
- [ ] Špatně
> Vysvětlení výběru.

## Více?
typ: vice
- [x] A
- [x] B
- [ ] C
> Vysvětlení více.

## Pravda, nebo ne?
typ: ano-ne
- [ano] Voda je mokrá.
- [ne] Slunce je čtverec.
> Vysvětlení.

## Seřaď
typ: razeni
1. První
2. Druhý
3. Třetí
> Vysvětlení řazení.

## Kam patří parní stroj?
typ: prirazeni
- Novověk
moznosti: Pravěk, Starověk, Středověk
> Vysvětlení přiřazení.
`)
    expect(chyby).toEqual([])
    expect(lekce?.otazky.map((o) => o.typ)).toEqual(['vyber', 'vice', 'ano-ne', 'razeni', 'prirazeni'])
    const prirazeni = lekce?.otazky[4]
    expect(prirazeni).toMatchObject({ spravna: 'Novověk', moznosti: ['Pravěk', 'Starověk', 'Středověk', 'Novověk'] })
    expect(lekce?.otazky[2]).toMatchObject({ tvrzeni: [{ ano: true }, { ano: false }] })
  })

  it('výběr bez správné odpovědi hlásí českou chybu s cestou a číslem otázky', () => {
    const { lekce, chyby } = pokus(`
## Dobrá otázka?
- [x] Ano
- [ ] Ne
> Ok.

## Otázka bez správné odpovědi
- [ ] Jedna
- [ ] Dvě
> Vysvětlení.
`)
    expect(lekce).toBeNull()
    expect(chyby).toEqual([
      'obsah/otazky/test.md, otázka 2 („Otázka bez správné odpovědi“): výběr musí mít právě jednu správnou odpověď `- [x]` (má 0)',
    ])
  })

  it('výběr se dvěma správnými odpověďmi je chyba', () => {
    const { chyby } = pokus('\n## Otázka\n- [x] A\n- [x] B\n- [ ] C\n> Vysvětlení.\n')
    expect(chyby[0]).toContain('právě jednu správnou odpověď')
    expect(chyby[0]).toContain('(má 2)')
  })

  it('chybějící vysvětlení je chyba', () => {
    const { chyby } = pokus('\n## Otázka\n- [x] A\n- [ ] B\n')
    expect(chyby).toEqual(['obsah/otazky/test.md, otázka 1 („Otázka“): chybí vysvětlení (řádek začínající `> `)'])
  })

  it('hlásí všechny chyby najednou', () => {
    const { chyby } = pokus('\n## A\n- [x] a\n- [ ] b\n\n## B\n- [x] a\n- [ ] b\n')
    expect(chyby).toHaveLength(2)
  })

  it('neplatný předmět a chybějící pole v hlavičce', () => {
    const { chyby } = pokus('\n## A\n- [x] a\n- [ ] b\n> Ok.\n', '---\nid: Zlé ID\npredmet: dejepis\n---\n')
    expect(chyby.join('\n')).toContain('`id` „Zlé ID“')
    expect(chyby.join('\n')).toContain('chybí `nazev`')
    expect(chyby.join('\n')).toContain('`predmet` musí být jedno z')
  })

  it('nerozumí-li řádku, řekne to', () => {
    const { chyby } = pokus('\n## A\n- [x] a\n- [ ] b\nnáhodný text\n> Ok.\n')
    expect(chyby[0]).toContain('nerozumím řádku „náhodný text“')
  })

  it('ano-ne bez tvrzení, řazení s dírou v číslování a přiřazení bez možností', () => {
    expect(pokus('\n## A\ntyp: ano-ne\n> Ok.\n').chyby[0]).toContain('1–4 tvrzení')
    expect(pokus('\n## A\ntyp: razeni\n1. a\n3. b\n> Ok.\n').chyby[0]).toContain('číslované 1., 2., 3.')
    expect(pokus('\n## A\ntyp: prirazeni\n- a\n> Ok.\n').chyby[0]).toContain('`moznosti:`')
  })

  it('typ s cizími řádky je chyba', () => {
    expect(pokus('\n## A\ntyp: razeni\n- [x] a\n1. b\n2. c\n> Ok.\n').chyby[0]).toContain('u typu „razeni“ nepatří')
  })

  it('„vice“ povolí víc správných a hlídá maximum 6 možností', () => {
    const sedm = Array.from({ length: 7 }, (_, i) => `- [${i === 0 ? 'x' : ' '}] M${i}`).join('\n')
    expect(pokus(`\n## A\ntyp: vice\n${sedm}\n> Ok.\n`).chyby[0]).toContain('2–6 možností')
  })

  it('`navrh: ano` vyvolá varování, ne chybu', () => {
    const { lekce, chyby, varovani } = pokus('\n## Návrh\nnavrh: ano\n- [x] a\n- [ ] b\n> Ok.\n')
    expect(chyby).toEqual([])
    expect(lekce).not.toBeNull()
    expect(varovani).toEqual(['obsah/otazky/test.md, otázka 1 („Návrh“)'])
  })

  it('nepovinné napoveda a chytak se uloží', () => {
    const { lekce } = pokus('\n## A\nnapoveda: Zkus to\nchytak: ano\n- [x] a\n- [ ] b\n> Ok.\n')
    expect(lekce?.otazky[0]).toMatchObject({ napoveda: 'Zkus to', chytak: true })
  })

  it('přečte výklad před otázkami: text, tipy a příklad s dopsanou částí', () => {
    const { lekce, chyby } = pokus(`
# Násobení deseti
Připiš jednu nulu.
- Deset má jednu nulu.
- Sto má dvě.
= 7 × 10 = 7[0]

## Otázka?
- [x] Ano
- [ ] Ne
> Vysvětlení.
`)
    expect(chyby).toEqual([])
    expect(lekce?.vyklad).toEqual([
      {
        nadpis: 'Násobení deseti',
        bloky: [
          { typ: 'text', text: 'Připiš jednu nulu.' },
          { typ: 'tipy', polozky: ['Deset má jednu nulu.', 'Sto má dvě.'] },
          { typ: 'priklad', casti: [{ text: '7 × 10 = 7' }, { text: '0', dopsano: true }] },
        ],
      },
    ])
  })

  it('prázdná karta výkladu je chyba, lekce bez výkladu ho nemá', () => {
    const { chyby } = pokus(`
# Prázdná

## Otázka?
- [x] Ano
- [ ] Ne
> Vysvětlení.
`)
    expect(chyby).toEqual(['obsah/otazky/test.md: karta výkladu 1 („Prázdná“): karta je prázdná, napiš pod nadpis aspoň jednu větu'])
    expect(pokus('\n## Otázka?\n- [x] Ano\n- [ ] Ne\n> V.\n').lekce?.vyklad).toBeUndefined()
  })
})

describe('zkontrolujPlan', () => {
  const zna = (id: string) => ['a', 'b'].includes(id)
  const plan = (o: object) => JSON.stringify({ od: '2026-10-12', do: '2026-10-25', lekce: ['a'], ...o })

  it('platný plán projde', () => {
    expect(zkontrolujPlan(plan({}), 'obsah/plan.json', zna, ['a', 'b'])).toEqual([])
  })
  it('neznámé id lekce vypíše, jaké existují', () => {
    const chyby = zkontrolujPlan(plan({ lekce: ['a', 'neni'] }), 'obsah/plan.json', zna, ['a', 'b'])
    expect(chyby).toEqual(['obsah/plan.json: lekce „neni“ neexistuje. Existující lekce: a, b'])
  })
  it('špatné datum, obrácené pořadí dat a rozbitý JSON', () => {
    expect(zkontrolujPlan(plan({ od: '12.10.2026' }), 'p', zna, [])[0]).toContain('RRRR-MM-DD')
    expect(zkontrolujPlan(plan({ od: '2026-02-30' }), 'p', zna, [])[0]).toContain('není existující datum')
    expect(zkontrolujPlan(plan({ od: '2026-11-01' }), 'p', zna, [])[0]).toContain('je později než')
    expect(zkontrolujPlan('{ "od": ', 'p', zna, [])[0]).toContain('není platný JSON')
  })
  it('prázdné lekce a duplicity', () => {
    expect(zkontrolujPlan(plan({ lekce: [] }), 'p', zna, [])[0]).toContain('neprázdný seznam')
    expect(zkontrolujPlan(plan({ lekce: ['a', 'a'] }), 'p', zna, [])[0]).toContain('dvakrát')
  })
})
