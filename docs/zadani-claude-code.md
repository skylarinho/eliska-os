# Zadání pro Claude Code (vlož jako první zprávu ve VS Code)

Jsi v repozitáři E-liška, výukové appky pro mou desetiletou dceru (Vite + React + TS + Tailwind + shadcn, původně z Lovable/Vercel). Cíl: minimalistický redesign podle mockupu, přechod na GitHub + Cloudflare Pages a obsah, který zvládnu měnit bez programování.

**Než začneš, přečti:** `CLAUDE.md`, `docs/brief.md`, `docs/format-otazek.md`, `docs/prompty.md` a otevři `mockup/e-liska-mockup.html`.

**Hlavní body:**
1. Vzhled = mockup (školní sešit, zvýrazňovač, vombat jen na úvodu a výsledku). Žádná emoji, verzálky, konfety.
2. XP a úrovně pryč → hvězdy 0–3 za lekci + série dní. Migruj uložený stav.
3. Dnešní úkol z týdenního plánu `obsah/plan.json`, který měním 1× za 1–2 týdny. Jedna lekce denně, jinak volná volba.
4. Otázky píšu v markdownu do `obsah/otazky/`, build je převede a zkontroluje.
5. Česká typografie a soukromí podle CLAUDE.md – žádné osobní údaje dítěte v kódu.

**Jak pracovat:**
- Jdi po krocích z `docs/prompty.md` (0 → 7). Po každém kroku: build, screenshot 390 px a 1280 px, krátké shrnutí, commit. Pak počkej na mé „pokračuj“.
- Nevymýšlej obsah (otázky, fakta, data). Chybí-li, použij viditelně označenou ukázku a zeptej se.
- Arc Library (kuratlielia/arc-library) jen pro interakce, vzhled vždy podle tokenů.
- Odpovídej česky, stručně.

Začni krokem 0 (soukromí) a 1 (repo a hosting).
