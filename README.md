# E-liška

Výuková appka pro desetiletou školačku. Česky, hlavně na mobilu.
Vite + React + TypeScript + Tailwind. Zadání a rozhodnutí jsou v `docs/brief.md`, pravidla pro vývoj v `CLAUDE.md`.

## Vývoj

```bash
npm install
npm run dev      # vývojový server
npm run build    # kontrola typů + sestavení do dist/
npm run preview  # náhled sestavené verze
```

## Obsah

- Týdenní plán: `obsah/plan.json` (mění se 1× za 1–2 týdny, jde upravit i z mobilu přes web GitHubu).
- Otázky: `obsah/otazky/*.md`, formát v `docs/format-otazek.md`.

Při `npm run build` i `npm run dev` skript `scripts/obsah.ts` obsah zkontroluje a převede na JSON. Když je plán nebo otázka neplatná, build spadne s českou chybou (soubor, číslo otázky, co opravit). Samotnou kontrolu spustíš příkazem `npm run obsah`. Otázky s `navrh: ano` skript vypíše jako varování.

Po uložení změny na GitHubu Vercel appku sám znovu sestaví a nasadí (zhruba do minuty).

## Nasazení: GitHub → Vercel

Appka běží na https://e-liska.vercel.app (projekt `e-liska` na Vercelu).

1. Kód je na GitHubu ve větvi `main`; projekt na Vercelu je s repozitářem propojený a každý push do `main` nasadí novou verzi do produkce. Ostatní větve dostanou náhledovou adresu.
2. Nastavení sestavení je v `vercel.json` (`npm run build`, výstup `dist`), nic dalšího se v dashboardu nastavovat nemusí. Stejný soubor zajišťuje i SPA přesměrování, takže přímé odkazy fungují.
3. Ruční nasazení z počítače: `vercel deploy --prod` (potřebuje `npm i -g vercel` a přihlášení `vercel login`).

### Soukromí a vyhledávače

Appka není určená pro vyhledávače: `index.html` má `noindex`, `public/robots.txt` zakazuje procházení a `vercel.json` posílá `X-Robots-Tag: noindex`. Kdo zná adresu, appku otevře, ale Google ji nenabídne. Postup dítěte se ukládá jen v jeho prohlížeči (localStorage), na server nic neodchází.

### Vlastní doména

V projektu na Vercelu otevři **Settings → Domains**, přidej doménu a nastav u registrátora záznam, který Vercel ukáže (`CNAME` na `cname.vercel-dns.com`, u kořenové domény `A` záznam).

## Soukromí

V kódu ani v obsahu nesmí být příjmení, škola, e-mail ani jiné osobní údaje dítěte. Commity pište s adresou `…@users.noreply.github.com`.
