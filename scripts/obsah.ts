/**
 * Převod obsahu pro appku:
 *  - obsah/otazky/*.md  ->  src/content/generated/<id>.json
 *  - kontrola obsah/plan.json
 * Chyby se hlásí česky s cestou k souboru a číslem otázky; build při chybě spadne.
 * Spuštění: `tsx scripts/obsah.ts` (v `prebuild`), v `npm run dev` ho volá plugin ve vite.config.ts.
 */
import matter from 'gray-matter'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { KATALOG } from '../src/data/katalog.ts'
import { plural } from '../src/lib/typo.ts'
import type { BlokVykladu, CastPrikladu, KartaVykladu, ObsahLekce, Otazka, PredmetId } from '../src/content/typy.ts'

const KOREN = fileURLToPath(new URL('..', import.meta.url))
const SLOZKA_OTAZEK = join(KOREN, 'obsah', 'otazky')
const SOUBOR_PLANU = join(KOREN, 'obsah', 'plan.json')
const VYSTUP = join(KOREN, 'src', 'content', 'generated')

const PREDMETY: PredmetId[] = ['cestina', 'matematika', 'anglictina', 'vlastiveda', 'informatika']
const TYPY = ['vyber', 'vice', 'ano-ne', 'razeni', 'prirazeni'] as const
type Typ = (typeof TYPY)[number]

export interface Hlaseni {
  chyby: string[]
  varovani: string[]
}

const ukaz = (t: string) => (t.length > 50 ? `${t.slice(0, 47)}…` : t)

/** Převede jeden markdown soubor na lekci. Chyby a varování zapisuje do `hlaseni`. */
export function parsujLekci(zdroj: string, cesta: string, hlaseni: Hlaseni): ObsahLekce | null {
  const pocatekChyb = hlaseni.chyby.length
  const chyba = (zprava: string, cisloOtazky?: number, nadpis?: string) => {
    const kde = cisloOtazky ? `${cesta}, otázka ${cisloOtazky}${nadpis ? ` („${ukaz(nadpis)}“)` : ''}` : cesta
    hlaseni.chyby.push(`${kde}: ${zprava}`)
  }

  let fm: matter.GrayMatterFile<string>
  try {
    fm = matter(zdroj)
  } catch (e) {
    chyba(`hlavičku mezi --- se nepodařilo přečíst (${e instanceof Error ? e.message.split('\n')[0] : e})`)
    return null
  }
  const data = fm.data as Record<string, unknown>

  const id = typeof data.id === 'string' ? data.id : ''
  const nazev = typeof data.nazev === 'string' ? data.nazev.trim() : ''
  const popis = typeof data.popis === 'string' ? data.popis.trim() : ''
  const predmet = data.predmet as PredmetId

  if (!id) chyba('v hlavičce chybí `id`')
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) chyba(`\`id\` „${id}“ smí obsahovat jen malá písmena bez diakritiky, čísla a pomlčky`)
  if (!nazev) chyba('v hlavičce chybí `nazev`')
  if (!popis) chyba('v hlavičce chybí `popis`')
  if (!PREDMETY.includes(predmet)) chyba(`\`predmet\` musí být jedno z: ${PREDMETY.join(', ')} (je „${String(data.predmet ?? '')}“)`)

  // Výklad (karty `# Nadpis` před první otázkou) a rozdělení na otázky podle `## `
  const radky = fm.content.split(/\r?\n/)
  const karty: { nadpis: string; radky: string[] }[] = []
  const bloky: { nadpis: string; radky: string[] }[] = []
  for (const radek of radky) {
    const h = /^##\s+(.+?)\s*$/.exec(radek)
    const k = /^#\s+(.+?)\s*$/.exec(radek)
    if (h) bloky.push({ nadpis: h[1], radky: [] })
    else if (bloky.length > 0) bloky[bloky.length - 1].radky.push(radek)
    else if (k) karty.push({ nadpis: k[1], radky: [] })
    else if (karty.length > 0) karty[karty.length - 1].radky.push(radek)
    else if (radek.trim() !== '') chyba(`text před první otázkou („${ukaz(radek.trim())}“); otázka začíná řádkem \`## \`, karta výkladu řádkem \`# \``)
  }

  const vyklad: KartaVykladu[] = []
  karty.forEach((karta, index) => {
    const k = parsujKartu(karta.nadpis, karta.radky, (z) => chyba(`karta výkladu ${index + 1} („${ukaz(karta.nadpis)}“): ${z}`))
    if (k) vyklad.push(k)
  })
  if (karty.length > 4) hlaseni.varovani.push(`${cesta}: výklad má ${karty.length} karet, doporučeno je nejvýš 4`)
  if (bloky.length === 0) chyba('lekce nemá žádnou otázku (otázka začíná řádkem `## `)')

  const otazky: Otazka[] = []
  bloky.forEach((blok, index) => {
    const o = parsujOtazku(blok.nadpis, blok.radky, (z) => chyba(z, index + 1, blok.nadpis))
    if (o) otazky.push(o.otazka)
    if (o?.navrh) hlaseni.varovani.push(`${cesta}, otázka ${index + 1} („${ukaz(blok.nadpis)}“)`)
  })

  if (otazky.length > 8) hlaseni.varovani.push(`${cesta}: lekce má ${otazky.length} otázek, doporučeno je 4–6 (pro ano/ne stačí jedna otázka s více tvrzeními)`)

  if (hlaseni.chyby.length > pocatekChyb) return null
  return { id, nazev, popis, predmet, ...(vyklad.length > 0 ? { vyklad } : {}), otazky }
}

/**
 * Karta výkladu: odstavce textu, tipy `- …` a ukázkové příklady `= 34 × 10 = 34[0]`
 * (část v hranatých závorkách se vykreslí jako dopsaná perem).
 */
function parsujKartu(nadpis: string, radky: string[], chyba: (zprava: string) => void): KartaVykladu | null {
  const bloky: BlokVykladu[] = []
  let odstavec: string[] = []
  const uzavriOdstavec = () => {
    if (odstavec.length > 0) bloky.push({ typ: 'text', text: odstavec.join(' ') })
    odstavec = []
  }
  let ok = true
  const selhani = (z: string) => {
    ok = false
    chyba(z)
  }

  for (const surovy of radky) {
    const r = surovy.trim()
    let m: RegExpExecArray | null
    if (r === '') {
      uzavriOdstavec()
    } else if ((m = /^-\s+(.+)$/.exec(r))) {
      uzavriOdstavec()
      const posledni = bloky[bloky.length - 1]
      if (posledni?.typ === 'tipy') posledni.polozky.push(m[1].trim())
      else bloky.push({ typ: 'tipy', polozky: [m[1].trim()] })
    } else if ((m = /^=\s+(.+)$/.exec(r))) {
      uzavriOdstavec()
      const casti: CastPrikladu[] = []
      for (const kus of m[1].trim().split(/(\[[^\]]*\])/)) {
        if (!kus) continue
        if (kus.startsWith('[')) {
          if (kus === '[]') selhani(`prázdné \`[]\` v příkladu „${ukaz(r)}“`)
          casti.push({ text: kus.slice(1, -1), dopsano: true })
        } else {
          if (/[[\]]/.test(kus)) selhani(`v příkladu „${ukaz(r)}“ nesedí hranaté závorky`)
          casti.push({ text: kus })
        }
      }
      bloky.push({ typ: 'priklad', casti })
    } else if (/^#{3,}\s/.test(r)) {
      selhani(`nadpis „${ukaz(r)}“ tu nepatří; karta výkladu začíná \`# \`, otázka \`## \``)
    } else {
      odstavec.push(r)
    }
  }
  uzavriOdstavec()

  if (bloky.length === 0) selhani('karta je prázdná, napiš pod nadpis aspoň jednu větu')
  return ok ? { nadpis, bloky } : null
}

function parsujOtazku(
  nadpis: string,
  radky: string[],
  chyba: (zprava: string) => void,
): { otazka: Otazka; navrh: boolean } | null {
  const meta: Record<string, string> = {}
  const volby: { text: string; spravne: boolean }[] = []
  const tvrzeni: { text: string; ano: boolean }[] = []
  const cislovane: { cislo: number; text: string }[] = []
  const prirazeni: string[] = []
  const vysvetleni: string[] = []
  let ok = true
  const selhani = (z: string) => {
    ok = false
    chyba(z)
  }

  for (const surovy of radky) {
    const r = surovy.trim()
    if (r === '') continue
    let m: RegExpExecArray | null
    if ((m = /^(typ|napoveda|chytak|navrh|moznosti):\s*(.*)$/.exec(r))) {
      if (m[1] in meta) selhani(`řádek \`${m[1]}:\` je tu dvakrát`)
      meta[m[1]] = m[2].trim()
    } else if ((m = /^-\s*\[(ano|ne)\]\s+(.+)$/i.exec(r))) {
      tvrzeni.push({ text: m[2].trim(), ano: m[1].toLowerCase() === 'ano' })
    } else if ((m = /^-\s*\[( |x)\]\s+(.+)$/i.exec(r))) {
      volby.push({ text: m[2].trim(), spravne: m[1].toLowerCase() === 'x' })
    } else if ((m = /^(\d+)\.\s+(.+)$/.exec(r))) {
      cislovane.push({ cislo: Number(m[1]), text: m[2].trim() })
    } else if ((m = /^-\s+(.+)$/.exec(r))) {
      prirazeni.push(m[1].trim())
    } else if ((m = /^>\s?(.*)$/.exec(r))) {
      if (m[1].trim()) vysvetleni.push(m[1].trim())
    } else {
      selhani(`nerozumím řádku „${ukaz(r)}“`)
    }
  }

  const typ = (meta.typ ?? 'vyber') as Typ
  if (!TYPY.includes(typ)) {
    selhani(`neznámý \`typ: ${meta.typ}\` (platné: ${TYPY.join(', ')})`)
    return null
  }
  for (const klic of ['chytak', 'navrh'] as const) {
    if (klic in meta && meta[klic] !== 'ano' && meta[klic] !== 'ne') selhani(`\`${klic}:\` musí být \`ano\`, nebo \`ne\``)
  }

  const text = vysvetleni.join(' ')
  if (!text) selhani('chybí vysvětlení (řádek začínající `> `)')

  const zaklad = {
    otazka: nadpis,
    vysvetleni: text,
    ...(meta.napoveda ? { napoveda: meta.napoveda } : {}),
    ...(meta.chytak === 'ano' ? { chytak: true } : {}),
  }
  const navrh = meta.navrh === 'ano'
  const bezDuplicit = (polozky: string[]) => new Set(polozky.map((p) => p.toLowerCase())).size === polozky.length

  // Každý typ smí mít jen své druhy řádků.
  const pouzite = {
    volby: volby.length > 0,
    tvrzeni: tvrzeni.length > 0,
    cislovane: cislovane.length > 0,
    prirazeni: prirazeni.length > 0,
  }
  const povolene: Record<Typ, (keyof typeof pouzite)[]> = {
    vyber: ['volby'],
    vice: ['volby'],
    'ano-ne': ['tvrzeni'],
    razeni: ['cislovane'],
    prirazeni: ['prirazeni'],
  }
  const popisy = {
    volby: 'možnosti `- [ ]` / `- [x]`',
    tvrzeni: 'tvrzení `- [ano]` / `- [ne]`',
    cislovane: 'číslovaný seznam',
    prirazeni: 'správná odpověď `- …`',
  }
  for (const [druh, jeTam] of Object.entries(pouzite) as [keyof typeof pouzite, boolean][]) {
    if (jeTam && !povolene[typ].includes(druh)) selhani(`u typu „${typ}“ nepatří ${popisy[druh]}`)
  }
  if (typ !== 'prirazeni' && 'moznosti' in meta) selhani('řádek `moznosti:` patří jen k typu `prirazeni`')

  if (!ok) return null

  switch (typ) {
    case 'vyber': {
      const spravne = volby.filter((v) => v.spravne)
      if (volby.length < 2 || volby.length > 4) selhani(`výběr má mít 2–4 možnosti (má ${volby.length})`)
      if (spravne.length !== 1) selhani(`výběr musí mít právě jednu správnou odpověď \`- [x]\` (má ${spravne.length})`)
      if (!bezDuplicit(volby.map((v) => v.text))) selhani('některé dvě možnosti jsou stejné')
      if (!ok) return null
      return { navrh, otazka: { ...zaklad, typ, moznosti: volby.map((v) => v.text), spravna: spravne[0].text } }
    }
    case 'vice': {
      const spravne = volby.filter((v) => v.spravne)
      if (volby.length < 2 || volby.length > 6) selhani(`„vice“ má mít 2–6 možností (má ${volby.length})`)
      if (spravne.length < 1) selhani('„vice“ musí mít aspoň jednu správnou odpověď `- [x]`')
      if (!bezDuplicit(volby.map((v) => v.text))) selhani('některé dvě možnosti jsou stejné')
      if (!ok) return null
      return { navrh, otazka: { ...zaklad, typ, moznosti: volby.map((v) => v.text), spravne: spravne.map((v) => v.text) } }
    }
    case 'ano-ne': {
      if (tvrzeni.length < 1 || tvrzeni.length > 4) selhani(`„ano-ne“ má mít 1–4 tvrzení (má ${tvrzeni.length})`)
      if (!ok) return null
      return { navrh, otazka: { ...zaklad, typ, tvrzeni: tvrzeni.map((t) => ({ text: t.text, ano: t.ano })) } }
    }
    case 'razeni': {
      if (cislovane.length < 2 || cislovane.length > 6) selhani(`řazení má mít 2–6 položek (má ${cislovane.length})`)
      if (cislovane.some((c, i) => c.cislo !== i + 1)) selhani('položky řazení musí být číslované 1., 2., 3. … bez mezer')
      if (!bezDuplicit(cislovane.map((c) => c.text))) selhani('některé dvě položky řazení jsou stejné')
      if (!ok) return null
      return { navrh, otazka: { ...zaklad, typ, polozky: cislovane.map((c) => c.text) } }
    }
    case 'prirazeni': {
      if (prirazeni.length !== 1) selhani(`přiřazení musí mít právě jednu správnou odpověď \`- …\` (má ${prirazeni.length})`)
      if (!meta.moznosti) selhani('přiřazení potřebuje řádek `moznosti:` s nabídkou oddělenou čárkami')
      if (!ok) return null
      const spravna = prirazeni[0]
      const nabidka = meta.moznosti.split(',').map((x) => x.trim()).filter(Boolean)
      const moznosti = nabidka.some((x) => x.toLowerCase() === spravna.toLowerCase()) ? nabidka : [...nabidka, spravna]
      if (moznosti.length < 2 || moznosti.length > 6) selhani(`přiřazení má mít 2–6 možností (má ${moznosti.length})`)
      if (!bezDuplicit(moznosti)) selhani('některé dvě možnosti jsou stejné')
      if (!ok) return null
      return { navrh, otazka: { ...zaklad, typ, spravna, moznosti } }
    }
  }
}

/** Zkontroluje týdenní plán. `znamaId` říká, jestli lekce existuje. */
export function zkontrolujPlan(zdroj: string, cesta: string, znamaId: (id: string) => boolean, vsechnaId: string[]): string[] {
  const chyby: string[] = []
  let plan: unknown
  try {
    plan = JSON.parse(zdroj)
  } catch (e) {
    return [`${cesta}: plán není platný JSON (${e instanceof Error ? e.message : e}). Zkontroluj čárky a uvozovky.`]
  }
  if (typeof plan !== 'object' || plan === null || Array.isArray(plan)) return [`${cesta}: plán musí být objekt s poli od, do a lekce`]
  const p = plan as Record<string, unknown>

  const datum = (klic: 'od' | 'do'): string | null => {
    const v = p[klic]
    if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      chyby.push(`${cesta}: \`${klic}\` musí být datum ve tvaru RRRR-MM-DD, například 2026-10-12 (je ${JSON.stringify(v)})`)
      return null
    }
    const d = new Date(`${v}T00:00:00Z`)
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) {
      chyby.push(`${cesta}: \`${klic}\` „${v}“ není existující datum`)
      return null
    }
    return v
  }
  const od = datum('od')
  const doo = datum('do')
  if (od && doo && od > doo) chyby.push(`${cesta}: \`od\` (${od}) je později než \`do\` (${doo})`)

  if (!Array.isArray(p.lekce) || p.lekce.length === 0 || p.lekce.some((x) => typeof x !== 'string')) {
    chyby.push(`${cesta}: \`lekce\` musí být neprázdný seznam id lekcí, například ["cestina-vyjmenovana-b"]`)
  } else {
    const videno = new Set<string>()
    for (const id of p.lekce as string[]) {
      if (!znamaId(id)) chyby.push(`${cesta}: lekce „${id}“ neexistuje. Existující lekce: ${vsechnaId.join(', ')}`)
      if (videno.has(id)) chyby.push(`${cesta}: lekce „${id}“ je v plánu dvakrát`)
      videno.add(id)
    }
  }
  return chyby
}

/** Přečte obsah, zkontroluje ho a zapíše JSON. Vrací hlášení; zapisuje jen když nejsou chyby. */
export function sestavObsah(): Hlaseni & { lekce: ObsahLekce[] } {
  const hlaseni: Hlaseni = { chyby: [], varovani: [] }
  const lekce: ObsahLekce[] = []
  const cestyLekci: string[] = []
  const rel = (p: string) => relative(KOREN, p).replaceAll('\\', '/')

  const soubory = existsSync(SLOZKA_OTAZEK)
    ? readdirSync(SLOZKA_OTAZEK).filter((s) => s.endsWith('.md')).sort()
    : []
  for (const soubor of soubory) {
    const cesta = join(SLOZKA_OTAZEK, soubor)
    const l = parsujLekci(readFileSync(cesta, 'utf-8'), rel(cesta), hlaseni)
    if (l) {
      lekce.push(l)
      cestyLekci.push(rel(cesta))
    }
  }

  // Unikátní id (vůči ostatním souborům i lekcím v kódu)
  const zKodu = new Set(KATALOG.map((l) => l.id))
  const videno = new Map<string, string>()
  lekce.forEach((l, i) => {
    if (zKodu.has(l.id)) hlaseni.chyby.push(`${cestyLekci[i]}: lekce s id „${l.id}“ už v appce existuje; zvol jiné \`id\``)
    const jiny = videno.get(l.id)
    if (jiny) hlaseni.chyby.push(`${cestyLekci[i]}: id „${l.id}“ už má soubor ${jiny}; id musí být unikátní`)
    videno.set(l.id, cestyLekci[i])
  })

  const vsechnaId = [...KATALOG.map((l) => l.id), ...lekce.map((l) => l.id)]
  if (existsSync(SOUBOR_PLANU)) {
    hlaseni.chyby.push(...zkontrolujPlan(readFileSync(SOUBOR_PLANU, 'utf-8'), rel(SOUBOR_PLANU), (id) => vsechnaId.includes(id), vsechnaId))
  } else {
    hlaseni.varovani.push(`${rel(SOUBOR_PLANU)} neexistuje; appka bude nabízet lekci s nejméně hvězdami`)
  }

  if (hlaseni.chyby.length === 0) {
    rmSync(VYSTUP, { recursive: true, force: true })
    mkdirSync(VYSTUP, { recursive: true })
    for (const l of lekce) writeFileSync(join(VYSTUP, `${l.id}.json`), `${JSON.stringify(l, null, 2)}\n`, 'utf-8')
  }
  return { ...hlaseni, lekce }
}

/** Vypíše hlášení česky; vrací true, když je vše v pořádku. */
export function vypisHlaseni(h: Hlaseni, pocetLekci: number, log: Pick<Console, 'log' | 'warn' | 'error'> = console): boolean {
  const navrhy = h.varovani.filter((v) => /otázka \d+ \(/.test(v))
  const ostatni = h.varovani.filter((v) => !navrhy.includes(v))
  if (navrhy.length > 0) {
    log.warn(`\nVarování: ${navrhy.length} ${plural(navrhy.length, ['otázka čeká', 'otázky čekají', 'otázek čeká'])} na kontrolu (\`navrh: ano\`). Po kontrole smaž řádek \`navrh: ano\`:`)
    for (const v of navrhy) log.warn(`  - ${v}`)
  }
  for (const v of ostatni) log.warn(`Varování: ${v}`)
  if (h.chyby.length > 0) {
    log.error(`\nObsah má ${h.chyby.length} ${plural(h.chyby.length, ['chybu', 'chyby', 'chyb'])}:`)
    for (const c of h.chyby) log.error(`  ✗ ${c}`)
    log.error('\nOprav je v souborech v obsah/ a spusť build znovu.')
    return false
  }
  log.log(`Obsah v pořádku: ${pocetLekci} ${plural(pocetLekci, ['lekce', 'lekce', 'lekcí'])} z markdownu, plán zkontrolován.`)
  return true
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const vysledek = sestavObsah()
  if (!vypisHlaseni(vysledek, vysledek.lekce.length)) process.exit(1)
}
