import type { LetterGroup } from '../types/learning'

export interface VyjmenovaneSlovo {
  skupina: LetterGroup
  /** Slovo tak, jak ho má dítě napsat. Zvratné „se“ / „si“ na konci je nepovinné. */
  slovo: string
  /** Co slovo znamená; podle toho dítě pozná, které slovo má napsat. */
  napoveda: string
  /** Další tvary, které uznáme jako správné (myslet / myslit). */
  takeSpravne?: string[]
}

/**
 * Vyjmenovaná slova k napsání celým slovem. Vynechaná jsou slova, na která se těžko
 * dělá jednoznačná nápověda pro 4. třídu (výheň, pykat, zpytovat, nachomýtnout se…).
 */
export const VYJMENOVANA_SLOVA: VyjmenovaneSlovo[] = [
  // B
  { skupina: 'B', slovo: 'být', napoveda: 'Existovat, nacházet se někde. Chci … veterinářkou.' },
  { skupina: 'B', slovo: 'bydlit', napoveda: 'Mít někde svůj domov.', takeSpravne: ['bydlet'] },
  { skupina: 'B', slovo: 'obyvatel', napoveda: 'Člověk, který žije v nějakém městě nebo vesnici.' },
  { skupina: 'B', slovo: 'byt', napoveda: 'Místo, kde bydlíme, třeba v paneláku.' },
  { skupina: 'B', slovo: 'příbytek', napoveda: 'Obydlí, místo, kde někdo žije. Nora je liščí …' },
  { skupina: 'B', slovo: 'nábytek', napoveda: 'Stůl, židle, skříň a postel dohromady.' },
  { skupina: 'B', slovo: 'dobytek', napoveda: 'Krávy, býci a telata na statku dohromady.' },
  { skupina: 'B', slovo: 'obyčej', napoveda: 'Zvyk, který se dodržuje odedávna, třeba pomlázka o Velikonocích.' },
  { skupina: 'B', slovo: 'bystrý', napoveda: 'Chytrý a rychlý. Má … rozum.' },
  { skupina: 'B', slovo: 'bylina', napoveda: 'Rostlina, ze které se vaří čaj, třeba heřmánek.' },
  { skupina: 'B', slovo: 'kobyla', napoveda: 'Samice koně.' },
  { skupina: 'B', slovo: 'býk', napoveda: 'Samec krávy, má velké rohy.' },

  // L
  { skupina: 'L', slovo: 'slyšet', napoveda: 'Vnímat zvuky ušima.' },
  { skupina: 'L', slovo: 'mlýn', napoveda: 'Stavba, kde se mele obilí na mouku.' },
  { skupina: 'L', slovo: 'blýskat se', napoveda: 'Při bouřce se … a hřmí.' },
  { skupina: 'L', slovo: 'polykat', napoveda: 'Posílat jídlo z pusy dolů do žaludku.' },
  { skupina: 'L', slovo: 'plynout', napoveda: 'Pomalu téct nebo ubíhat. Řeka i čas …' },
  { skupina: 'L', slovo: 'plýtvat', napoveda: 'Zbytečně vyhazovat nebo utrácet. Neměli bychom … vodou.' },
  { skupina: 'L', slovo: 'vzlykat', napoveda: 'Tiše a přerývaně plakat.' },
  { skupina: 'L', slovo: 'lysý', napoveda: 'Bez vlasů, holohlavý.' },
  { skupina: 'L', slovo: 'lýtko', napoveda: 'Zadní část nohy pod kolenem.' },
  { skupina: 'L', slovo: 'lyže', napoveda: 'Jezdíme na nich v zimě z kopce.' },
  { skupina: 'L', slovo: 'plyš', napoveda: 'Měkká hebká látka, ze které bývá medvídek.' },

  // M
  { skupina: 'M', slovo: 'my', napoveda: 'Já a ostatní dohromady. … jdeme do školy.' },
  { skupina: 'M', slovo: 'mýt', napoveda: 'Čistit vodou a mýdlem. Před jídlem si musíme … ruce.' },
  { skupina: 'M', slovo: 'myslit', napoveda: 'Přemýšlet, používat hlavu.', takeSpravne: ['myslet'] },
  { skupina: 'M', slovo: 'mýlit se', napoveda: 'Nemít pravdu, splést se.' },
  { skupina: 'M', slovo: 'hmyz', napoveda: 'Mravenci, včely a brouci dohromady.' },
  { skupina: 'M', slovo: 'myš', napoveda: 'Malý šedý hlodavec, kterého loví kočka.' },
  { skupina: 'M', slovo: 'hlemýžď', napoveda: 'Pomalý šnek s ulitou na zádech.' },
  { skupina: 'M', slovo: 'zamykat', napoveda: 'Zavírat dveře na klíč.' },
  { skupina: 'M', slovo: 'chmýří', napoveda: 'Jemné bílé chloupky odkvetlé pampelišky, do kterých foukáme.' },

  // P
  { skupina: 'P', slovo: 'pýcha', napoveda: 'Když si někdo o sobě myslí, že je nejlepší. Je z něj cítit …' },
  { skupina: 'P', slovo: 'pytel', napoveda: 'Velký vak na brambory nebo mouku.' },
  { skupina: 'P', slovo: 'pysk', napoveda: 'Ret zvířete, třeba koně.' },
  { skupina: 'P', slovo: 'netopýr', napoveda: 'Létající savec, který přes den visí hlavou dolů.' },
  { skupina: 'P', slovo: 'slepýš', napoveda: 'Beznohá ještěrka, která vypadá jako had.' },
  { skupina: 'P', slovo: 'pyl', napoveda: 'Žlutý prášek z květů, který sbírají včely.' },
  { skupina: 'P', slovo: 'kopyto', napoveda: 'Tvrdý konec nohy koně.' },
  { skupina: 'P', slovo: 'klopýtat', napoveda: 'Zakopávat o kameny při chůzi.' },
  { skupina: 'P', slovo: 'třpytit se', napoveda: 'Lesknout se jako sníh na slunci.' },
  { skupina: 'P', slovo: 'pýřit se', napoveda: 'Červenat se studem.' },

  // S
  { skupina: 'S', slovo: 'syn', napoveda: 'Chlapec svých rodičů.' },
  { skupina: 'S', slovo: 'sytý', napoveda: 'Najedený, opak hladového.' },
  { skupina: 'S', slovo: 'sýr', napoveda: 'Vyrábí se z mléka a někdy má díry.' },
  { skupina: 'S', slovo: 'syrový', napoveda: 'Nevařený, třeba … mrkev.' },
  { skupina: 'S', slovo: 'sychravý', napoveda: 'Studený, vlhký a mlhavý, třeba podzimní den.' },
  { skupina: 'S', slovo: 'usychat', napoveda: 'Pomalu ztrácet vodu. Kytka bez vody …' },
  { skupina: 'S', slovo: 'sýkora', napoveda: 'Malý ptáček se žlutým bříškem.' },
  { skupina: 'S', slovo: 'sýček', napoveda: 'Malá sova.' },
  { skupina: 'S', slovo: 'sysel', napoveda: 'Hlodavec, který žije v norách na loukách a polích.' },
  { skupina: 'S', slovo: 'syčet', napoveda: 'Dělat „sss“ jako had.' },
  { skupina: 'S', slovo: 'sypat', napoveda: 'Lít něco sypkého, třeba písek nebo cukr.' },

  // V
  { skupina: 'V', slovo: 'vy', napoveda: 'Ty a ostatní. Takhle mluvíme k více lidem.' },
  { skupina: 'V', slovo: 'vysoký', napoveda: 'Opak nízkého.' },
  { skupina: 'V', slovo: 'výt', napoveda: 'Co dělá vlk v noci na měsíc.' },
  { skupina: 'V', slovo: 'výskat', napoveda: 'Radostně a hlasitě křičet: „juchú!“' },
  { skupina: 'V', slovo: 'zvykat si', napoveda: 'Pomalu si osvojovat něco nového. Musím si … na novou třídu.' },
  { skupina: 'V', slovo: 'žvýkat', napoveda: 'Drtit jídlo zuby.' },
  { skupina: 'V', slovo: 'vydra', napoveda: 'Zvíře, které žije u řeky a loví ryby.' },
  { skupina: 'V', slovo: 'výr', napoveda: 'Největší sova, má na hlavě péřová ouška.' },
  { skupina: 'V', slovo: 'povyk', napoveda: 'Hluk a křik. O přestávce byl ve třídě velký …' },

  // Z
  { skupina: 'Z', slovo: 'brzy', napoveda: 'Za krátkou dobu, zavčas. Ráno vstáváme …' },
  { skupina: 'Z', slovo: 'jazyk', napoveda: 'Máme ho v puse a chutnáme jím.' },
  { skupina: 'Z', slovo: 'nazývat se', napoveda: 'Jmenovat se, mít nějaké jméno.' },
  { skupina: 'Z', slovo: 'Ruzyně', napoveda: 'Část Prahy, kde je velké letiště.' },
]

/** Zvratné „se“ / „si“ na konci slova. */
const ZVRATNE = / (se|si)$/

/** Rozdělí slovo na základ a nepovinné zvratné zájmeno: „blýskat se“ → „blýskat“ + „se“. */
export function rozdelZvratne(slovo: string): { zaklad: string; zvratne?: string } {
  const m = slovo.match(ZVRATNE)
  return m ? { zaklad: slovo.slice(0, m.index), zvratne: m[1] } : { zaklad: slovo }
}

/** Sjednotí zápis: bez mezer okolo, malá písmena, jedna mezera mezi slovy, složené znaky (NFC). */
export function normalizuj(text: string): string {
  return text.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('cs')
}

/** Napsalo dítě slovo správně? Uzná i tvar bez zvratného „se“ a tvary z `takeSpravne`. */
export function jeSpravne(napsano: string, s: VyjmenovaneSlovo): boolean {
  const odpoved = normalizuj(napsano)
  const moznosti = [s.slovo, ...(s.takeSpravne ?? [])].flatMap((t) => [t, rozdelZvratne(t).zaklad])
  return moznosti.some((t) => normalizuj(t) === odpoved)
}
