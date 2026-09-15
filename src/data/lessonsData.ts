// Didactic data model for 4th Grade Primary School (Informatika & Vlastivěda)

export interface StudyCard {
  id: string
  title: string
  icon: string
  subtitle: string
  content: string
  funFact: string
}

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
  depthLevel: number // Nora level: 0 = Povrch, 1 = Novověk, 2 = Středověk, 3 = Pravěk
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

export interface BurrowLayer {
  level: number
  depthMeters: string
  title: string
  epochId: string
  soilColor: string
  borderColor: string
  artifacts: { name: string; icon: string; detail: string }[]
  description: string
  archaeologyFact: string
}

export interface LessonMeta {
  id: string
  title: string
  shortTitle: string
  subject: 'Informatika' | 'Vlastivěda'
  icon: string
  description: string
  color: string
  rewardXp: number
}

export const LESSONS_META: LessonMeta[] = [
  {
    id: 'lesson-hw',
    title: 'Informatika: Co je na obrázku?',
    shortTitle: 'Poznáváme hardware',
    subject: 'Informatika',
    icon: '💻',
    description: 'Poznej klávesnici, myš, monitor i tiskárnu a zjisti, kudy data proudí!',
    color: 'from-[#ebdccb] to-[#f7f5f0]',
    rewardXp: 50,
  },
  {
    id: 'lesson-timeline',
    title: 'Časová osa: 5 velkých epoch lidstva',
    shortTitle: 'Časová osa dějin',
    subject: 'Vlastivěda',
    icon: '⏳',
    description: 'Poskládej epochy od nejstaršího Pravěku až po dnešní Moderní dobu!',
    color: 'from-[#fef3c7] to-[#f7f5f0]',
    rewardXp: 50,
  },
  {
    id: 'lesson-artifacts',
    title: 'Kde žil pěstní klín a parní stroj?',
    shortTitle: 'Přiřazování předmětů',
    subject: 'Vlastivěda',
    icon: '🪓',
    description: 'Přiřaď kamennou sekeru, rytířský meč i smartphone do správného období!',
    color: 'from-[#d1fae5] to-[#f7f5f0]',
    rewardXp: 60,
  },
]

// LEKCE 1: INFORMATIKA
export const HARDWARE_CATEGORIES = [
  {
    id: 'input',
    name: 'Vstupní zařízení',
    badge: '📥 Dovnitř',
    description: 'Posílají data a naše příkazy dovnitř do počítače.',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'output',
    name: 'Výstupní zařízení',
    badge: '📤 Ven k nám',
    description: 'Posílají data ven z počítače k našim očím a uším.',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  {
    id: 'core',
    name: 'Srdce a paměť PC',
    badge: '🧠 Mozek & Úkryt',
    description: 'Tady se všechno počítá, řídí a bezpečně ukládá.',
    color: 'bg-stone-200 text-stone-900 border-stone-400',
  },
] as const

export const HARDWARE_ITEMS: HardwareItem[] = [
  {
    id: 'kb',
    name: 'Klávesnice',
    icon: '⌨️',
    category: 'input',
    categoryName: 'Vstupní zařízení',
    explanation: 'Je to Klávesnice! Patří mezi VSTUPNÍ zařízení (📥), protože když na ní píšeš, posíláš písmenka a čísla DOVNITŘ do počítače.',
    hint: 'Má na sobě spoustu tlačítek s písmenky a číslicemi.',
  },
  {
    id: 'mouse',
    name: 'Počítačová myš',
    icon: '🖱️',
    category: 'input',
    categoryName: 'Vstupní zařízení',
    explanation: 'Přesně tak, je to Počítačová myš! Je to VSTUPNÍ zařízení (📥) – držíš ji v ruce a klikáním posíláš povely DOVNITŘ.',
    hint: 'Jezdí po podložce, má dvě tlačítka a kolečko.',
  },
  {
    id: 'mic',
    name: 'Mikrofon',
    icon: '🎙️',
    category: 'input',
    categoryName: 'Vstupní zařízení',
    explanation: 'Správně, je to Mikrofon! Je to VSTUPNÍ zařízení (📥) – zachytí tvůj hlas a pošle zvuk DOVNITŘ do počítače.',
    hint: 'Mluvíš nebo zpíváš do něj při volání nebo nahrávání.',
  },
  {
    id: 'monitor',
    name: 'Monitor (Displej)',
    icon: '🖥️',
    category: 'output',
    categoryName: 'Výstupní zařízení',
    explanation: 'Výborně, je to Monitor! Patří mezi VÝSTUPNÍ zařízení (📤) – ukazuje obraz a pohádky VEN z počítače pro tvé oči.',
    hint: 'Velká obrazovka, na které vidíš plochu, hry i video.',
  },
  {
    id: 'printer',
    name: 'Tiskárna',
    icon: '🖨️',
    category: 'output',
    categoryName: 'Výstupní zařízení',
    explanation: 'Ano, je to Tiskárna! Je to VÝSTUPNÍ zařízení (📤) – vezme digitální obrázek a vytiskne ho VEN na skutečný papír.',
    hint: 'Dáváš do ní čisté papíry a vyjíždí z ní vytištěný obrázek.',
  },
  {
    id: 'headphones',
    name: 'Sluchátka',
    icon: '🎧',
    category: 'output',
    categoryName: 'Výstupní zařízení',
    explanation: 'Skvěle, jsou to Sluchátka! Patří mezi VÝSTUPNÍ zařízení (📤) – posílají hudbu a zvuky VEN přímo do tvých uší.',
    hint: 'Nasadíš si je na hlavu na uši, abys slyšel písničky.',
  },
  {
    id: 'pc-case',
    name: 'Počítačová skříň (Bedna)',
    icon: '🗄️',
    category: 'core',
    categoryName: 'Srdce a mozek PC',
    explanation: 'Přesně, je to Počítačová skříň! Ukrývá SRDCE a MOZEK celého počítače (procesor, grafiku i větráčky).',
    hint: 'Velká bedna stojící pod stolem, ve které to tiše hučí.',
  },
  {
    id: 'flashdisk',
    name: 'USB flash disk (Flashka)',
    icon: '⚡',
    category: 'core',
    categoryName: 'Paměť počítače',
    explanation: 'Správně, je to USB flash disk (oblíbená flashka)! Patří mezi PAMĚŤOVÁ zařízení – uložíš si na ni fotky, pohádky i referát a vezmeš ji v kapse kamkoliv.',
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
    depthLevel: 3,
  },
  {
    id: 'starovek',
    order: 2,
    name: 'Starověk',
    shortPeriod: 'Egypt, Řecko, Řím',
    icon: '🏺',
    color: '#b8860b',
    summary: 'Pyramidy, první města, písmo, hliněné amfory a římští filosofové.',
    depthLevel: 2,
  },
  {
    id: 'stredovek',
    order: 3,
    name: 'Středověk',
    shortPeriod: 'Hrady a rytíři',
    icon: '🏰',
    color: '#556b2f',
    summary: 'Kamenné hrady, udatní rytíři v brnění, husité a psaní brkem.',
    depthLevel: 2,
  },
  {
    id: 'novovek',
    order: 4,
    name: 'Novověk',
    shortPeriod: 'Pára a objevy',
    icon: '⚙️',
    color: '#4682b4',
    summary: 'Zámořské plavby, knihtisk, parní stroj a průmyslová revoluce.',
    depthLevel: 1,
  },
  {
    id: 'moderni',
    order: 5,
    name: 'Moderní doba',
    shortPeriod: 'Dnešek a budoucnost',
    icon: '🚀',
    color: '#059669',
    summary: 'Lety do vesmíru, chytré telefony, internet a robotika.',
    depthLevel: 0,
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
      'Jednoznačně PRAVĚK! Lidé tehdy ještě vůbec neznali výrobu kovů (železa ani bronzu). Sekery a nože osekávali z tvrdých kamenů (nejčastěji pazourků) a připevňovali je kůží s dřevěným topůrkem.',
    hint: 'Kameny a pazourky se používaly dřív, než lidé objevili kovy!',
  },
  {
    id: 'art-sword',
    name: 'Rytířský meč a železné brnění',
    icon: '⚔️',
    correctEpochId: 'stredovek',
    epochName: 'Středověk',
    didacticExplanation:
      'STŘEDOVĚK! Doba statečných rytířů, králů na hradech a kovářů, kteří u výhně kovali těžká brnění, přilbice a ostré meče.',
    hint: 'Nosili je rytíři na hradech Karlštejn nebo Bouzov.',
  },
  {
    id: 'art-quill',
    name: 'Ptačí brk a kalamář s inkoustem',
    icon: '🪶',
    correctEpochId: 'stredovek',
    epochName: 'Středověk',
    didacticExplanation:
      'STŘEDOVĚK! Před vynálezem kuličkového pera i tiskáren mniši v klášterech celé dny ručně opisovali tlusté knihy seříznutým husím brkem namáčeným v inkoustu.',
    hint: 'Husí pírko a černý inkoust v hradních komnatách.',
  },
  {
    id: 'art-steam-engine',
    name: 'Parní stroj a tovární motor',
    icon: '🚂',
    correctEpochId: 'novovek',
    epochName: 'Novověk',
    didacticExplanation:
      'NOVOVĚK! V 18. století James Watt zdokonalil parní stroj. Začala průmyslová revoluce, rozjely se první parní vlaky a stroje v továrnách.',
    hint: 'Hustý dým z komína, syčení páry a velká železná kola vlaků.',
  },
  {
    id: 'art-smartphone',
    name: 'Dotykový chytrý telefon',
    icon: '📱',
    correctEpochId: 'moderni',
    epochName: 'Moderní doba',
    didacticExplanation:
      'MODERNÍ DOBA! Malá krabička v kapse, která se spojí s celým světem přes satelity a internet, je symbolem 21. století.',
    hint: 'Máš ho v kapse a díváš se na něm na videa.',
  },
  {
    id: 'art-amphora',
    name: 'Hliněná amfora a staré mince',
    icon: '🏺',
    correctEpochId: 'starovek',
    epochName: 'Starověk',
    didacticExplanation:
      'STAROVĚK! Ve starověkém Řecku a Římě uchovávali olivový olej i víno v krásných malovaných amforách a platili prvními raženými mincemi se znaky panovníků.',
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

// 5. VOMBATÍ NORA ČASU (ARCHEOLOGICKÁ PATRA)
export const BURROW_LAYERS: BurrowLayer[] = [
  {
    level: 0,
    depthMeters: '0 metrů (Povrch)',
    title: 'Dnešní svět – Moderní doba',
    epochId: 'moderni',
    soilColor: '#e2f0d9',
    borderColor: '#4ade80',
    description: 'Tady vombat vykukuje na sluníčko. Kolem jsou antény, vysílače 5G, auta a solární panely.',
    archaeologyFact: 'Na povrchu země zanecháváme plasty, beton a elektroniku, které budoucí badatelé najdou jako nejmladší vrstvu.',
    artifacts: [
      { name: 'Smartphone', icon: '📱', detail: 'Kapesní superpočítač' },
      { name: 'Wifi router', icon: '📡', detail: 'Posílá vzduchem data k vombatovi' },
      { name: 'Dron s kamerou', icon: '🚁', detail: 'Létá nad norou' },
    ],
  },
  {
    level: 1,
    depthMeters: '– 5 metrů pod zemí',
    title: '1. patro: Novověk & Pára',
    epochId: 'novovek',
    soilColor: '#e6d5b8',
    borderColor: '#b08968',
    description: 'Vombat narazil na vrstvu průmyslové revoluce plnou železných součástek a starého papíru.',
    archaeologyFact: 'Průmyslová města rychle rostla a staré dlažby a továrny byly postupně překryty novějšími stavbami.',
    artifacts: [
      { name: 'Ozubené kolo', icon: '⚙️', detail: 'Z prvních textilních strojů' },
      { name: 'Parní píšťala', icon: '🚂', detail: 'Hvízdala na nádraží v 19. století' },
      { name: 'Stará kniha s rytinami', icon: '📖', detail: 'Vytištěná na prvním tiskařském lisu' },
    ],
  },
  {
    level: 2,
    depthMeters: '– 15 metrů pod zemí',
    title: '2. patro: Středověk & Hrady',
    epochId: 'stredovek',
    soilColor: '#c4a482',
    borderColor: '#7a5c43',
    description: 'Kamenitá vrstva se zbytky starého zdiva, podkovami a úlomky keramiky.',
    archaeologyFact: 'Mnoho středověkých měst vzniklo na sutinách po požárech – nová ulice se jednoduše postavila o metr výš!',
    artifacts: [
      { name: 'Podkova válečného oře', icon: '🧲', detail: 'Ztratil ji rytíř na cestě na hrad' },
      { name: 'Rytířský štít', icon: '🛡️', detail: 'Se znakem lva a chocholatého ptáčka' },
      { name: 'Středověký klíč', icon: '🗝️', detail: 'Otvíral těžkou dubovou bránu' },
    ],
  },
  {
    level: 3,
    depthMeters: '– 30 metrů (Nejhlubší jeskyně)',
    title: '3. patro: Pravěk – Doba kamenná',
    epochId: 'pravek',
    soilColor: '#8a5a36',
    borderColor: '#3e2723',
    description: 'Nejhlubší vrstva, kde se země ještě neprohnula pod tíhou měst. Tady spí prastará historie.',
    archaeologyFact: 'Zákon superpozice říká: V klidném souvrství leží ty nejstarší sedimenty a zkameněliny vždy nejhlouběji v zemi!',
    artifacts: [
      { name: 'Pěstní klín a pazourek', icon: '🪓', detail: 'Ostrý kámen svázaný pevnou kůží' },
      { name: 'Mamutí stolička', icon: '🦣', detail: 'Pozůstatek z doby ledové' },
      { name: 'Jeskynní kresba', icon: '🎨', detail: 'Vykreslená uhlem a červenou hlinkou' },
    ],
  },
]
