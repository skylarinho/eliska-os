// Informatika a vlastivěda: části počítače, epochy, předměty v čase

export interface HardwareItem {
  id: string
  name: string
  icon: string
  category: 'input' | 'output' | 'core'
  categoryName: string
  explanation: string
  hint: string
}

export interface TimelineEpoch {
  id: string
  order: number
  name: string
  shortPeriod: string
  icon: string
  color: string
  summary: string
}

export interface HistoryArtifact {
  id: string
  name: string
  icon: string
  correctEpochId: string
  epochName: string
  didacticExplanation: string
  hint: string
}

// LEKCE 1: INFORMATIKA
export const HARDWARE_ITEMS: HardwareItem[] = [
  {
    id: 'kb',
    name: 'Klávesnice',
    icon: '⌨️',
    category: 'input',
    categoryName: 'Vstupní zařízení',
    explanation: 'Je to Klávesnice. Patří mezi vstupní zařízení, protože když na ní píšeš, posíláš písmenka a čísla dovnitř do počítače.',
    hint: 'Má na sobě spoustu tlačítek s písmenky a číslicemi.',
  },
  {
    id: 'mouse',
    name: 'Počítačová myš',
    icon: '🖱️',
    category: 'input',
    categoryName: 'Vstupní zařízení',
    explanation: 'Přesně tak, je to Počítačová myš. Je to vstupní zařízení – držíš ji v ruce a klikáním posíláš povely dovnitř.',
    hint: 'Jezdí po podložce, má dvě tlačítka a kolečko.',
  },
  {
    id: 'mic',
    name: 'Mikrofon',
    icon: '🎙️',
    category: 'input',
    categoryName: 'Vstupní zařízení',
    explanation: 'Správně, je to Mikrofon. Je to vstupní zařízení – zachytí tvůj hlas a pošle zvuk dovnitř do počítače.',
    hint: 'Mluvíš nebo zpíváš do něj při volání nebo nahrávání.',
  },
  {
    id: 'monitor',
    name: 'Monitor (Displej)',
    icon: '🖥️',
    category: 'output',
    categoryName: 'Výstupní zařízení',
    explanation: 'Výborně, je to Monitor. Patří mezi výstupní zařízení – ukazuje obraz a pohádky ven z počítače pro tvé oči.',
    hint: 'Velká obrazovka, na které vidíš plochu, hry i video.',
  },
  {
    id: 'printer',
    name: 'Tiskárna',
    icon: '🖨️',
    category: 'output',
    categoryName: 'Výstupní zařízení',
    explanation: 'Ano, je to Tiskárna. Je to výstupní zařízení – vezme digitální obrázek a vytiskne ho ven na skutečný papír.',
    hint: 'Dáváš do ní čisté papíry a vyjíždí z ní vytištěný obrázek.',
  },
  {
    id: 'headphones',
    name: 'Sluchátka',
    icon: '🎧',
    category: 'output',
    categoryName: 'Výstupní zařízení',
    explanation: 'Skvěle, jsou to Sluchátka. Patří mezi výstupní zařízení – posílají hudbu a zvuky ven přímo do tvých uší.',
    hint: 'Nasadíš si je na hlavu na uši, abys slyšel písničky.',
  },
  {
    id: 'pc-case',
    name: 'Počítačová skříň (Bedna)',
    icon: '🗄️',
    category: 'core',
    categoryName: 'Srdce a mozek PC',
    explanation: 'Přesně, je to Počítačová skříň. Ukrývá srdce a mozek celého počítače (procesor, grafiku i větráčky).',
    hint: 'Velká bedna stojící pod stolem, ve které to tiše hučí.',
  },
  {
    id: 'flashdisk',
    name: 'USB flash disk (Flashka)',
    icon: '⚡',
    category: 'core',
    categoryName: 'Paměť počítače',
    explanation: 'Správně, je to USB flash disk (oblíbená flashka). Patří mezi paměťová zařízení – uložíš si na ni fotky, pohádky i referát a vezmeš ji v kapse kamkoliv.',
    hint: 'Malá přenosná klíčenka s kovovým USB konektorem, která se zasouvá do počítače.',
  },
]

// LEKCE 2: ČASOVÁ OSA (5 EPOCH V ŘADĚ)
export const TIMELINE_EPOCHS: TimelineEpoch[] = [
  {
    id: 'pravek',
    order: 1,
    name: 'Pravěk',
    shortPeriod: 'Nejstarší dějiny',
    icon: '🪨',
    color: '#8b5a2b',
    summary: 'Lovci mamutů, pazourky, jeskynní malby a vynález ohně.',
  },
  {
    id: 'starovek',
    order: 2,
    name: 'Starověk',
    shortPeriod: 'Egypt, Řecko, Řím',
    icon: '🏺',
    color: '#b8860b',
    summary: 'Pyramidy, první města, písmo, hliněné amfory a římští filosofové.',
  },
  {
    id: 'stredovek',
    order: 3,
    name: 'Středověk',
    shortPeriod: 'Hrady a rytíři',
    icon: '🏰',
    color: '#556b2f',
    summary: 'Kamenné hrady, udatní rytíři v brnění, husité a psaní brkem.',
  },
  {
    id: 'novovek',
    order: 4,
    name: 'Novověk',
    shortPeriod: 'Pára a objevy',
    icon: '⚙️',
    color: '#4682b4',
    summary: 'Zámořské plavby, knihtisk, parní stroj a průmyslová revoluce.',
  },
  {
    id: 'moderni',
    order: 5,
    name: 'Moderní doba',
    shortPeriod: 'Dnešek a budoucnost',
    icon: '🚀',
    color: '#059669',
    summary: 'Lety do vesmíru, chytré telefony, internet a robotika.',
  },
]

// LEKCE 3: PŘEDMĚTY V ČASE (HISTORICKÉ ARTEFAKTY)
export const HISTORY_ARTIFACTS: HistoryArtifact[] = [
  {
    id: 'art-stone-axe',
    name: 'Kamenná sekera a pěstní klín',
    icon: '🪓',
    correctEpochId: 'pravek',
    epochName: 'Pravěk (Doba kamenná)',
    didacticExplanation:
      'Jednoznačně pravěk. Lidé tehdy ještě vůbec neznali výrobu kovů (železa ani bronzu). Sekery a nože osekávali z tvrdých kamenů (nejčastěji pazourků) a připevňovali je kůží s dřevěným topůrkem.',
    hint: 'Kameny a pazourky se používaly dřív, než lidé objevili kovy.',
  },
  {
    id: 'art-sword',
    name: 'Rytířský meč a železné brnění',
    icon: '⚔️',
    correctEpochId: 'stredovek',
    epochName: 'Středověk',
    didacticExplanation:
      'Je to středověk. Doba statečných rytířů, králů na hradech a kovářů, kteří u výhně kovali těžká brnění, přilbice a ostré meče.',
    hint: 'Nosili je rytíři na hradech Karlštejn nebo Bouzov.',
  },
  {
    id: 'art-quill',
    name: 'Ptačí brk a kalamář s inkoustem',
    icon: '🪶',
    correctEpochId: 'stredovek',
    epochName: 'Středověk',
    didacticExplanation:
      'Je to středověk. Před vynálezem kuličkového pera i tiskáren mniši v klášterech celé dny ručně opisovali tlusté knihy seříznutým husím brkem namáčeným v inkoustu.',
    hint: 'Husí pírko a černý inkoust v hradních komnatách.',
  },
  {
    id: 'art-steam-engine',
    name: 'Parní stroj a tovární motor',
    icon: '🚂',
    correctEpochId: 'novovek',
    epochName: 'Novověk',
    didacticExplanation:
      'Je to novověk. V 18. století James Watt zdokonalil parní stroj. Začala průmyslová revoluce, rozjely se první parní vlaky a stroje v továrnách.',
    hint: 'Hustý dým z komína, syčení páry a velká železná kola vlaků.',
  },
  {
    id: 'art-smartphone',
    name: 'Dotykový chytrý telefon',
    icon: '📱',
    correctEpochId: 'moderni',
    epochName: 'Moderní doba',
    didacticExplanation:
      'Je to moderní doba. Malá krabička v kapse, která se spojí s celým světem přes satelity a internet, je symbolem 21. století.',
    hint: 'Máš ho v kapse a díváš se na něm na videa.',
  },
  {
    id: 'art-amphora',
    name: 'Hliněná amfora a staré mince',
    icon: '🏺',
    correctEpochId: 'starovek',
    epochName: 'Starověk',
    didacticExplanation:
      'Je to starověk. Ve starověkém Řecku a Římě uchovávali olivový olej i víno v krásných malovaných amforách a platili prvními raženými mincemi se znaky panovníků.',
    hint: 'Řecké vázy a amfory z dob starých faraonů a olympijských her.',
  },
  {
    id: 'art-candle',
    name: 'Svíčka a smolná louč',
    icon: '🕯️',
    correctEpochId: 'stredovek',
    epochName: 'Středověk (až Novověk)',
    didacticExplanation:
      'Svíčky a louče provázely lidstvo od starověku přes středověk až do novověku, než pan František Křižík a Thomas Edison přinesli elektrickou žárovku.',
    hint: 'Plamínek ohně, který svítil v komnatách před vynálezem elektřiny.',
  },
]

