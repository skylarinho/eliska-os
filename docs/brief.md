# Brief – redesign E-liška

## Účel a hlavní akce
Domácí procvičování učiva pro desetiletou školačku. **Hlavní akce: spustit dnešní úkol.** Vedlejší: vybrat si cvičení sama.

## Typy obsahu (převzato z existující appky, nic nového)
| Předmět | Cvičení | Mechanika |
|---|---|---|
| Čeština | Vyjmenovaná slova (B, L, M, P, S, V, Z) | doplň i/í/y/ý, chytáky |
| Matematika | Obchůdek | košík podle lístku → vracení mincemi |
| Matematika | Rozklad na desítky | 3 číselná pole |
| Matematika | Násobilka | výběr ze 3, mřížka teček |
| Angličtina | Slovíčka s poslechem (6 témat) | poslech + výběr překladu |
| Vlastivěda | Časová osa | seřazení 5 epoch |
| Vlastivěda | Předměty a epochy | přiřazení k epoše |
| Informatika | Co je na obrázku | výběr ze 3 |

Texty úloh převzít, jen typograficky učesat (bez VERZÁLEK, bez emoji, méně vykřičníků).

## Rozhodnutí (Petr, 9. 10. 2026)
- **Herní prvky zjednodušit:** XP a úrovně pryč. Zůstávají **hvězdy za lekci (0–3)** a **série dní**.
  - 3★ vše správně napoprvé, 2★ max. 1 chyba, 1★ dokončeno. Ukládá se nejlepší výsledek.
  - Série = počet dní po sobě s alespoň 1 dokončenou lekcí.
  - Migrace: `completedLessons` → 1★, XP zahodit.
- **Vombat jen drobně:** úvod (dnešní úkol) a výsledek lekce.
- **Výběr: dnešní úkol + volná volba.** Rodič připraví **týdenní plán** 1× za 1–2 týdny (`obsah/plan.json`):
  ```json
  { "od": "2026-10-12", "do": "2026-10-25",
    "lekce": ["cestina-vyjmenovana-b", "vlastiveda-pravek", "matematika-nasobilka"] }
  ```
  - Dnešní úkol = první lekce z plánu, která ještě nebyla dokončena od data `od`. Jedna denně; když ji dodělá, karta ukáže „Na dnes hotovo“ a další se nabídne zítra (dobrovolně lze pokračovat hned).
  - Všechno splněno → „Plán splněn“ + návrh lekce s nejméně hvězdami.
  - Po datu `do` nebo bez plánu → automaticky lekce s nejméně hvězdami.
  - Na kartě: „Plán na týden: 1 ze 4 hotovo“.
- Profily (sourozenec/kamarád) zachovat, schovat za kolečko s iniciálou.

## Nový obsah
Otázky píše rodič v markdownu (`obsah/otazky/*.md`), formát v `docs/format-otazek.md`. První dávka hotová: vlastivěda – Pravěk na našem území, 3 lekce (16 otázek).

## Obrazovky
1. **Přehled:** pozdrav, série + hvězdy, karta Dnešní úkol (zvýrazňovač, vombat, Začít), seznam podle předmětů s hvězdami.
2. **Lekce:** ×, postup, zadání, úloha, odpovědi. Zpětná vazba v bottom sheetu.
3. **Výsledek:** vombat, „Hotovo, Eliško“, skóre, hvězdy, Zpět na přehled / Zkusit znovu.
4. **Profily:** bottom sheet.

## Design systém
- Barvy: papír #FFFFFF, inkoust #1D3170, inkoust-2 #55628F, inkoust-3 #C9D2E6, linka #E2E9F3, okraj #E46B5A, zvýrazňovač #FFE45C, správně #1F8A55, oprava #D2402F.
- Předměty: čeština #7A4FC4, matematika #2F6FDB, angličtina #0F8A8A, vlastivěda #D9731C, informatika #3E9B4F.
- Písmo: Lexend + Caveat (jen dopsané odpovědi).
- Proč: konkrétní předobraz, český školní sešit (čtverečky, červený okraj, modré pero, zvýrazňovač, učitelka opravuje červeně). Vědomě pryč od krémovo-hnědého vzhledu původní verze.

## Ukázková data v mockupu
Hvězdy, série a stav týdenního plánu jsou vymyšlené pro ukázku (označeno v mockupu). Věty v lekci jsou z původní appky.

## Mimo design – udělat hned
V produkčním JS na e-liska.vercel.app je příjmení a školní e-mail dítěte. Odstranit a nasadit (prompt 0).
