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

Po uložení změny na GitHubu Cloudflare Pages appku sám znovu sestaví a nasadí (zhruba do minuty).

## Nasazení: GitHub → Cloudflare Pages

1. Kód musí být v GitHub repozitáři (větev `main`).
2. V [Cloudflare dashboardu](https://dash.cloudflare.com) otevři **Workers & Pages → Create → Pages → Connect to Git**, vyber repozitář a povol přístup.
3. Nastavení sestavení:
   - Framework preset: **Vite** (nebo None)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Proměnná prostředí `NODE_VERSION` = `22`
4. **Save and Deploy**. Appka poběží na adrese `<projekt>.pages.dev`.
5. Každý push do `main` spustí nové nasazení, ostatní větve dostanou náhledovou adresu.
6. SPA fallback zajišťuje `public/_redirects` (`/*  /index.html  200`), takže přímé odkazy fungují.

### Vlastní doména

1. V projektu Pages otevři **Custom domains → Set up a custom domain** a zadej doménu (např. `eliska.example.cz`).
2. Je-li doména v Cloudflare DNS, záznam se přidá sám. Jinak u registrátora nastav `CNAME` z `eliska` na `<projekt>.pages.dev`.
3. Počkej na vystavení certifikátu (obvykle pár minut); HTTPS je automaticky.

### Přechod z Vercelu

Až bude nová adresa v provozu, smaž starý projekt na Vercelu, aby nezůstala dostupná stará verze.

## Soukromí

V kódu ani v obsahu nesmí být příjmení, škola, e-mail ani jiné osobní údaje dítěte.
