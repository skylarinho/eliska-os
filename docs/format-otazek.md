# Formát otázek (markdown)

Jeden soubor = jedna lekce. Ukládej do `obsah/otazky/<predmet>-<tema>.md`.

```md
---
id: vlastiveda-pravek          # unikátní, malá písmena, pomlčky
nazev: Pravěk                  # zobrazí se v seznamu
popis: Lovci mamutů a první zemědělci   # podtitulek v seznamu
predmet: vlastiveda            # cestina | matematika | anglictina | vlastiveda | informatika
---

## Čím lovili pravěcí lidé mamuty?
- [x] Oštěpy a kamennými nástroji
- [ ] Luky s ocelovými hroty
- [ ] Puškami
> Ocel ani střelný prach v pravěku neznali. Nástroje byly z kamene, kostí a dřeva.

## Seřaď od nejstaršího
typ: razeni
1. Pravěk
2. Starověk
3. Středověk
> Pravěk je nejstarší, středověk nejmladší z těchto tří.

## Do kterého období patří parní stroj?
typ: prirazeni
- Novověk
moznosti: Pravěk, Starověk, Středověk, Novověk, Moderní doba
> Parní stroj se rozšířil v 18. století, tedy v novověku.
```

## Výklad a tipy (nepovinné)
Před první otázku můžeš dát krátký výklad. Každý nadpis `# ` je jedna karta (obrazovka), appka je ukáže
před procvičováním a dítě mezi nimi listuje tlačítky Další / Zpět. Doporučeno nejvýš 4 karty.

```md
# Násobení deseti: připiš jednu nulu
Obyčejný řádek je odstavec textu.
- Řádek s pomlčkou je tip.
= 34 × 10 = 34[0]
```

- `= …` je ukázkový příklad velkým písmem; část v `[hranatých závorkách]` se vykreslí jako dopsaná perem.
- Karta musí mít pod nadpisem aspoň jeden řádek. Výklad se ukáže jen při prvním průchodu, „Zkusit znovu“ jde rovnou na otázky.

## Typy otázek
- **výběr** (výchozí, `typ` netřeba): seznam `- [ ]`, právě jedna `- [x]`, 2–4 možnosti.
- **vice** (`typ: vice`): „vyber všechny správné“, aspoň jedna `- [x]`, max. 6 možností. Hvězda jen při úplně správné sadě.
- **ano-ne** (`typ: ano-ne`): 1–4 tvrzení, každé začíná `- [ano]` nebo `- [ne]`. Zobrazí se postupně, odpověď tlačítky Ano / Ne.
- **razeni**: číslovaný seznam ve správném pořadí, appka ho zamíchá.
- **prirazeni**: správná odpověď jako `- …`, ostatní volby v `moznosti:`.

## Pravidla (kontroluje build)
- Každá otázka začíná `## ` a má vysvětlení `> …` (zobrazí se po odpovědi).
- Výběr: právě jedna správná odpověď. Možnosti se v appce zamíchají.
- Otázka může mít volitelně `napoveda: …` a `chytak: ano`.
- `navrh: ano` = možnosti nebo vysvětlení doplnil Claude a rodič je ještě nezkontroloval. Build vypíše **varování** se seznamem těchto otázek. Po kontrole řádek smaž.
- Doporučená délka lekce: 4–6 otázek.
- Typografii (nezlomitelné mezery, uvozovky) řeší appka sama, piš normálně.
