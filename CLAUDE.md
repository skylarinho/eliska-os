# E-liška – instrukce pro Claude Code

Výuková appka pro desetiletou školačku. Česky, hlavně na mobilu. Minimalistická.
Vzor vzhledu: `mockup/e-liska-mockup.html`. Zadání a rozhodnutí: `docs/brief.md`. Postup: `docs/prompty.md`.

## Obsah a plán (needitovat ručně v kódu)
- Týdenní plán: `obsah/plan.json` (tatínek ho mění 1× za 1–2 týdny, i z mobilu přes GitHub web → Cloudflare znovu sestaví).
- Otázky: `obsah/otazky/*.md` ve formátu z `docs/format-otazek.md`. Skript `scripts/obsah.ts` je při buildu převede do `src/content/generated/*.json`.
- Build **musí spadnout** s čitelnou českou chybou, když je plán nebo otázka neplatná (neznámé id lekce, žádná/dvě správné odpovědi, chybí vysvětlení).

## Stack
- Vite + React + TypeScript + Tailwind + shadcn/ui (zachovat z Lovable/Vercel verze)
- Stav: Zustand + persist (localStorage). Při změně struktury napiš `migrate` (XP → hvězdy, viz brief).
- Hosting: GitHub → Cloudflare Pages (build `npm run build`, výstup `dist`), vlastní doména. SPA fallback: `public/_redirects` → `/* /index.html 200`.
- Interakční komponenty jen z Arc Library (`npx shadcn@latest add @uiarc/<název>`), **vzhled vždy přebarvit na tokeny níže**. Použít: `button`, `bottom-sheet` (zpětná vazba, profily), `progress`/`stepper` (postup lekce), `number-field` (rozklad), `animated-counter` (hvězdy). Nic dalšího bez důvodu.

## Design – pravidla
- Koncept: **školní sešit**. Čtverečkovaný papír (20 px), červený okraj vlevo, text „modrým perem“.
- Jediný výrazný prvek: **žlutý zvýrazňovač** (dnešní úkol, hvězdy). Nikde jinde.
- Tokeny: `src/styles/tokens.css` (kopie `assets/tokens.css`), napojit do `tailwind.config` jako barvy `papir, inkoust, inkoust-2, inkoust-3, linka, okraj, zvyraznovac, spravne, oprava` + předměty `cestina, matematika, anglictina, vlastiveda, informatika`.
- Písmo: Lexend 400/500/600/700 (UI i obsah), Caveat 700 jen pro dopsané písmeno/číslo v úloze. Self-host přes `@fontsource/lexend` a `@fontsource/caveat` (latin-ext).
- Velikosti: tělo 17 px, úloha 28 px, nadpis 30 px. Nic pod 14 px.
- Dotykové cíle ≥ 48 px, odpovědi ≥ 72 px.
- **Žádná emoji v UI**, žádné VERZÁLKY, žádné konfety. Ikony: lucide, tloušťka 2.
- Jedna obrazovka = jeden úkol. Na lekci jen: zavřít, postup, zadání, odpovědi.
- Barva předmětu jen jako proužek (levý okraj řádku, pruh nad nadpisem skupiny).
- Vombat (SVG v `assets/`) jen na úvodu (dnešní úkol) a na výsledku. Nikde jinde.
- Zpětná vazba: bottom sheet, „Správně“ zeleně / „Správně je …“ červeně + vysvětlení + jedno tlačítko.
- Pohyb: jen jako odpověď na akci; respektovat `prefers-reduced-motion`.
- Desktop: list sešitu max 620 px na středu, pozadí stolu `#EDF1F6`.

## Česká typografie (povinně)
- Nezlomitelná mezera (`\u00A0`) po jednopísmenných předložkách a spojkách: v, s, k, z, o, u, a, i (i velkých).
- Mezi číslem a jednotkou: `4 věty`, `35 Kč`, `3 dny` → `\u00A0`.
- Uvozovky „takto“, pomlčka – (en dash) s mezerami, násobení ×, rozsah 1–10 bez mezer.
- Skloňování čísel: helper `plural(n, ['hvězda','hvězdy','hvězd'])`, totéž pro dny, věty, příklady.
- Oslovení 5. pádem z profilu (`vokativ` uložit u profilu, ne generovat: „Eliško“).
- Helper `cz()` v `src/lib/typo.ts`, aplikovat na všechny texty z obsahu.

## Soukromí
- V kódu ani v obsahu **žádné** příjmení, škola, e-mail ani jiné osobní údaje dítěte. Výchozí profil jen `Eliška`.

## Hotovo znamená
- Funguje a vypadá dobře na 390 px i desktopu (zkontrolovat screenshotem).
- Lighthouse přístupnost ≥ 95, viditelný focus, vše ovladatelné klávesnicí.
