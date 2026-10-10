# Prompty pro Claude Code (pořadí)

> Každý prompt spusť zvlášť. Po každém kroku: `npm run build`, screenshot 390 px + 1280 px, commit.

## 0 – Soukromí (hned)
Odstraň z kódu a výchozích dat všechny osobní údaje dítěte (příjmení, e-mail, škola). Výchozí profil = jen `{ name: "Eliška", vokativ: "Eliško" }`. Prohledej celý repozitář včetně textů úloh. Vypiš, co jsi změnil.

## 1 – Repo a hosting
Přečti CLAUDE.md. Připrav projekt pro GitHub + Cloudflare Pages: `.gitignore`, `public/_redirects` pro SPA, odstraň závislosti na Lovable/Vercel (lovable-tagger, vercel.json), ověř `npm run build` → `dist`. Napiš do README postup napojení Cloudflare Pages a vlastní domény.

## 2 – Základ designu
Podle CLAUDE.md a `assets/tokens.css`: tokeny do Tailwindu, self-host fontů (Lexend, Caveat, latin-ext), komponenta `<Sesit>` (čtverečkovaný list, červený okraj, desktop list 620 px na stole), `src/lib/typo.ts` (`cz()`, `plural()`), vombat SVG jako komponenta se stavy `klid | radost`. Odstraň konfety, emoji a VERZÁLKY z UI.

## 3 – Model postupu
Nahraď XP a úrovně hvězdami (0–3 na lekci, nejlepší výsledek) a sérií dní. Pravidla v docs/brief.md. Napiš `migrate` pro uložený stav v Zustand persist. Přidej `obsah/plan.json` a výběr dnešního úkolu z týdenního plánu podle docs/brief.md (jedna lekce denně, stav „Na dnes hotovo“, „Plán splněn“, fallback lekce s nejméně hvězdami). Napiš testy (Vitest) pro výběr úkolu: uprostřed plánu, vše hotovo, plán vypršel, žádný plán.

## 4 – Přehled
Postav obrazovku Přehled přesně podle mockupu (`mockup/e-liska-mockup.html`): pozdrav vokativem, série + hvězdy s českým skloňováním, karta Dnešní úkol, seznam podle předmětů. Profily přes Arc `bottom-sheet`, přebarvit na tokeny.

## 5 – Kostra lekce
Společný layout lekce: zavřít, postup (Arc `progress`/`stepper`), zadání, oblast úlohy, zpětná vazba v Arc `bottom-sheet` („Správně“ / „Správně je …“ + vysvětlení + jedno tlačítko), obrazovka Výsledek s hvězdami. Dopsané odpovědi písmem Caveat (zeleně / červeně přeškrtnuté + správně).

## 6 – Převod cvičení
Převeď do nové kostry postupně: vyjmenovaná slova → násobilka → rozklad (Arc `number-field`) → obchůdek → angličtina → časová osa → epochy → hardware. Texty jen typograficky učesat přes `cz()`. Po každém cvičení screenshot 390 px.

## 6b – Obsah z markdownu
Podle `docs/format-otazek.md` napiš `scripts/obsah.ts` (gray-matter + vlastní parser, bez těžkých závislostí), spouštěný v `prebuild` i v `dev` (watch). Validuj podle pravidel ve formátu; chybu hlas česky s cestou k souboru a číslem otázky. Napoj 3 hotové lekce `obsah/otazky/vlastiveda-*.md` (starší doba kamenná, mladší doba kamenná, doba bronzová). Mechaniky: výběr, vice (zaškrtávací, tlačítko Zkontrolovat), ano-ne (tvrzení po jednom, tlačítka Ano / Ne), řazení, přiřazení. Otázky s `navrh: ano` vypiš při buildu jako varování. Možnosti míchej, správnou odpověď nikdy nedávej vždy na stejné místo.

## 7 – Kontrola
Projdi všechny obrazovky na 390 px a 1280 px, klávesnicí a s `prefers-reduced-motion`. Zkontroluj českou typografii (nezlomitelné mezery, uvozovky, skloňování). Lighthouse přístupnost ≥ 95.
