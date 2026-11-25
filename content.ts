import { LEADS, type Region } from './stories.ts';

export const PAGE = {
  name: 'THE WORLD TODAY / GLOBAL DAILY',
  edition: 'BROADSHEET / 19 VERIFIED REPORTS',
  date: 'WEDNESDAY 25 NOVEMBER 2026',
  audit: '19 STORIES / ASIA / OCEANIA / SOUTHERN OCEAN / MIDDLE EAST / EUROPE / AMERICAS / WORLD / ALL DATED 25 NOVEMBER / ALL SOURCED',
  leadSection: 'TWELVE LEADS / ONE WEDNESDAY',
  wireSection: 'ALSO ON 25 NOVEMBER / 7 WIRES',
  mapSection: 'WHERE IT HAPPENED',
  mapLegendOne: 'ASIA 6 / OCEANIA 2 / SOUTHERN 1',
  mapLegendTwo: 'M.E. 3 / EUROPE 3 / AMERICAS 3 / WORLD 1',
  dateSection: 'DATE CHECK / ALL 25 NOV ITEMS HAPPENED OR WERE FIRST REPORTED THAT DAY',
  mapKey: 'CANBERRA 7 + 8 OFFSET / LINES MARK EXACT SITES',
} as const;

export const KICKERS = [
  'SHENZHOU-24 DOCKS',
  'SECURITY PACT SIGNED',
  'KOSPI FALLS 6.16%',
] as const;

export const STATS: readonly (readonly [string, string])[] = [
  ['-6.16%', 'KOSPI'], ['4.9%', 'AUSTRALIA CPI'], ['+36%', 'GARMENT WAGE'],
  ['7', 'DRONES'], ['~30', 'HOSTAGES'], ['03:56', 'DOCKING UTC'], ['M5.9', 'BALLENY QUAKE'],
];

export const WIRES: readonly { number: string; line: string }[] = [
  { number: '03', line: 'TOKYO / SERVICES PPI +4.2% / REUTERS / CNA / BOJ' },
  { number: '04', line: 'DHAKA / GARMENT WAGE +36% / AP / AL JAZEERA / THE STRAITS TIMES' },
  { number: '05', line: 'PYONGYANG / SYLVAIN ASTIER EXPELLED / AP / EURONEWS / THE KOREA TIMES' },
  { number: '06', line: 'JAKARTA / OECD REVIEW 80% DONE / ANTARA / CNBC INDONESIA' },
  { number: '15', line: 'DARMSTADT / HERA REACHES DIMORPHOS / BBC NEWS' },
  { number: '18', line: 'MIDDLETOWN, IOWA / 5-TON ARMY BLAST / AP / US ARMY' },
  { number: '19', line: 'NEW YORK / UN OPENS 16 DAYS / UN PRESS / UN WOMEN' },
];

export const DATE_ITEMS: readonly { event: string; source: string }[] = [
  { event: '24 NOV / RIYADH TOWER HIT; 11 WOUNDED', source: 'REUTERS / ARAB NEWS / AL JAZEERA' },
  { event: '24 NOV / HUAWEI GUILTY; RACKETEERING ACQUITTED', source: 'US DOJ / REUTERS / AP' },
  { event: '24 NOV / REAL MADRID 5-1 PSV', source: 'UEFA / BBC SPORT' },
  { event: '24 NOV / GAZA KILLS 7; NAEEM ABU NAHEL', source: 'BBC / AL-MONITOR / DAWN' },
  { event: '24 NOV / SENEGAL RESTORED AFCON TITLE', source: 'ANADOLU / BBC SPORT / CAS' },
  { event: '24 NOV / FEMICIDE BRIEF: ~47,000 KILLED', source: 'UNODC / UN WOMEN' },
  { event: '24 NOV / ROSSTAT LEAK: ~490,000 MILITARY DEATHS', source: 'MEDIAZONA 23 NOV / REUTERS 25 NOV PICKUP' },
  { event: '24 NOV / ANMER HALL BURGLARY: TWO ARRESTED', source: 'BBC / GUARDIAN / AP' },
  { event: '24 NOV / THOMAS MARKLE INDICTED ON TWO COUNTS', source: 'AP / LA TIMES' },
];

export interface MapPoint {
  number: number;
  region: Region;
  location: readonly [longitude: number, latitude: number];
}

export const MAP_POINTS: readonly MapPoint[] = [
  { number: 1, region: 'ASIA', location: [100.30, 40.96] },
  { number: 2, region: 'ASIA', location: [126.98, 37.57] },
  { number: 3, region: 'ASIA', location: [139.65, 35.68] },
  { number: 4, region: 'ASIA', location: [90.41, 23.81] },
  { number: 5, region: 'ASIA', location: [125.76, 39.04] },
  { number: 6, region: 'ASIA', location: [106.85, -6.21] },
  { number: 7, region: 'OCEANIA', location: [149.13, -35.28] },
  { number: 8, region: 'OCEANIA', location: [149.13, -35.28] },
  { number: 9, region: 'SOUTHERN', location: [170.94, -63.09] },
  { number: 10, region: 'MIDDLE EAST', location: [42.95, 14.80] },
  { number: 11, region: 'MIDDLE EAST', location: [50.16, 26.64] },
  { number: 12, region: 'MIDDLE EAST', location: [56.25, 26.57] },
  { number: 13, region: 'EUROPE', location: [50.15, 53.20] },
  { number: 14, region: 'EUROPE', location: [30.62, 48.47] },
  { number: 15, region: 'EUROPE', location: [8.65, 49.87] },
  { number: 16, region: 'AMERICAS', location: [-75.48, 10.39] },
  { number: 17, region: 'AMERICAS', location: [-77.04, 38.90] },
  { number: 18, region: 'AMERICAS', location: [-91.26, 40.83] },
  { number: 19, region: 'WORLD', location: [-74.00, 40.75] },
];

export const ALL_DRAWN_STRINGS: readonly string[] = [
  PAGE.name, PAGE.edition, PAGE.date, PAGE.audit, ...KICKERS,
  ...STATS.flatMap(([value, label]) => [value, label]), PAGE.leadSection,
  ...LEADS.flatMap((story) => [String(story.number), story.place, story.headline, story.fact, story.source, ...(story.claim ? ['CLAIM'] : [])]),
  PAGE.wireSection, ...WIRES.flatMap((wire) => [wire.number, wire.line]),
  PAGE.mapSection, ...MAP_POINTS.map((point) => String(point.number)), PAGE.mapLegendOne, PAGE.mapLegendTwo, PAGE.mapKey,
  PAGE.dateSection, ...DATE_ITEMS.flatMap((item) => [item.event, item.source]),
];
