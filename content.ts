export type Region = 'Asia' | 'Oceania' | 'Middle East' | 'Europe' | 'Americas' | 'World';

export interface LeadStory {
  number: number;
  region: Region;
  place: string;
  headline: string;
  deck: string;
  source: string;
  scene: 'rocket' | 'market' | 'treaty' | 'port' | 'refinery' | 'rescue' | 'tariffs' | 'tankers';
  claim?: boolean;
}

export const PAGE = {
  runningLeft: 'THE WORLD IN ONE DAY',
  runningRight: 'ALL 19 STORIES DATED WEDNESDAY 25 NOV',
  date: 'Wednesday 25 November 2026',
  audit: '19 stories, all dated 25 November 2026 · Asia 6 · Middle East 3 · Europe 3 · Americas 3 · Oceania 3 · World 1 · All sourced',
  wires: 'Also on 25 November — 11 more stories',
  map: 'Where it happened',
  mapLegendOne: 'Asia 6 · Oceania 3 · Middle East 3',
  mapLegendTwo: 'Europe 3 · Americas 3 · World 1 · Canberra 7/8 offset',
  dateLabel: 'DATE CHECK',
} as const;

export const KICKERS = [
  'Shenzhou-24 docks with Pakistani pilot',
  'KOSPI plunges 6.16%',
  'Australia–Solomons pact signed',
] as const;

export const STATS: readonly (readonly [string, string])[] = [
  ['−6.16%', 'KOSPI close'],
  ['4.9%', 'Australia Oct CPI'],
  ['+36%', 'Dhaka garment wage'],
  ['~30', 'Cartagena hostages'],
  ['03:56', 'Tiangong docking UTC'],
  ['M5.9', 'Balleny Islands quake'],
];

export const LEADS: readonly LeadStory[] = [
  { number: 1, region: 'Asia', place: 'Jiuquan, China', headline: 'Shenzhou-24 docks with Tiangong', deck: 'Pakistan’s first astronaut Zeeshan Ali aboard; docking at 03:56 UTC', source: 'Reuters · AP · BBC', scene: 'rocket' },
  { number: 2, region: 'Asia', place: 'Seoul, South Korea', headline: 'KOSPI plunges as chips slide', deck: 'Index −6.16%; Samsung −9.87%, SK hynix −11.05%', source: 'Yonhap', scene: 'market' },
  { number: 7, region: 'Oceania', place: 'Canberra, Australia', headline: 'Australia–Solomons pact signed', deck: 'No foreign bases; China pact understood to expire April 2027', source: 'BBC · NYT · AP · AAP', scene: 'treaty' },
  { number: 10, region: 'Middle East', place: 'Hodeidah, Yemen', headline: 'Coalition strikes Hodeidah port', deck: 'Port capabilities, Saada and Amran hit after evacuation warning', source: 'Arab News · Al Arabiya · Reuters', scene: 'port' },
  { number: 13, region: 'Europe', place: 'Samara, Russia', headline: 'Drones hit Samara refineries', deck: 'Fires ~800 km inside Russia; one killed; 145 drones intercepted', source: 'Kyiv Post · The Independent', scene: 'refinery' },
  { number: 16, region: 'Americas', place: 'Cartagena, Colombia', headline: 'Cartagena hostages all rescued', deck: '~30 held at Éxito after failed robbery; one gunman killed', source: 'Euronews · AFP · El Universal', scene: 'rescue' },
  { number: 17, region: 'Americas', place: 'Washington, US', headline: 'US readies Section 301 tariffs', deck: '14+ partners named, including China, the EU and Japan', source: 'BBC News', scene: 'tariffs' },
  { number: 12, region: 'Middle East', place: 'Strait of Hormuz', headline: 'Iran says mines hit tankers', deck: 'State-media claim not independently confirmed', source: 'Reuters · Arab News · Anadolu', scene: 'tankers', claim: true },
];

export interface WireStory { number: number; place: string; summary: string; source: string; }
export const WIRES: readonly WireStory[] = [
  { number: 3, place: 'Tokyo', summary: 'Services PPI +4.2%, a 36-year high', source: 'Reuters · CNA · BOJ' },
  { number: 4, place: 'Dhaka', summary: 'Garment wage rises 36% after protests', source: 'AP · Al Jazeera · The Straits Times' },
  { number: 5, place: 'Pyongyang', summary: 'Sylvain Astier expelled; 48 hours to leave', source: 'AP · Euronews · The Korea Times' },
  { number: 6, place: 'Jakarta', summary: 'OECD accession review ~80% complete', source: 'ANTARA · CNBC Indonesia' },
  { number: 8, place: 'Canberra', summary: 'October CPI jumps to 4.9%', source: 'ABC · ABS' },
  { number: 9, place: 'Balleny Islands', summary: 'M5.9 quake; green alert, no exposure', source: 'USGS' },
  { number: 11, place: 'Ras Tanura', summary: 'Seven drones intercepted; no injuries', source: 'Al Arabiya · Anadolu' },
  { number: 14, place: 'Odesa & Kyiv', summary: 'Overnight strikes kill three, injure two', source: 'The Independent · Ukrinform · Reuters' },
  { number: 15, place: 'Darmstadt', summary: 'Hera reaches asteroid Dimorphos', source: 'BBC News' },
  { number: 18, place: 'Middletown, Iowa', summary: 'Army detonates ~5 tons of lead azide', source: 'AP · US Army' },
  { number: 19, place: 'New York, UN', summary: '16 Days of Activism begins', source: 'UN Press · UN Women' },
];

export const DATE_PARAGRAPH = 'All 19 reports above occurred or were first reported on 25 Nov 2026. Earlier: 23 Nov — leaked Rosstat analysis (~490,000 Russian military deaths; Mediazona; Reuters pickup 25 Nov). 24 Nov — Riyadh PIF tower strike (11 wounded); Huawei Brooklyn verdict; Real Madrid 5–1 PSV; Gaza strikes (7 killed; BBC/Al-Monitor/Dawn); CAS restores Senegal’s AFCON title; UNODC/UN Women 47,000 femicide brief; Anmer Hall arrests (incident 23 Nov); Thomas Markle indictment.';

export interface MapPoint { number: number; region: Region; location: readonly [longitude: number, latitude: number]; }
export const MAP_POINTS: readonly MapPoint[] = [
  { number: 1, region: 'Asia', location: [100.30, 40.96] }, { number: 2, region: 'Asia', location: [126.98, 37.57] },
  { number: 3, region: 'Asia', location: [139.65, 35.68] }, { number: 4, region: 'Asia', location: [90.41, 23.81] },
  { number: 5, region: 'Asia', location: [125.76, 39.04] }, { number: 6, region: 'Asia', location: [106.85, -6.21] },
  { number: 7, region: 'Oceania', location: [149.13, -35.28] }, { number: 8, region: 'Oceania', location: [149.13, -35.28] },
  { number: 9, region: 'Oceania', location: [170.94, -63.09] },
  { number: 10, region: 'Middle East', location: [42.95, 14.80] }, { number: 11, region: 'Middle East', location: [50.16, 26.64] },
  { number: 12, region: 'Middle East', location: [56.25, 26.57] },
  { number: 13, region: 'Europe', location: [50.15, 53.20] }, { number: 14, region: 'Europe', location: [30.62, 48.47] },
  { number: 15, region: 'Europe', location: [8.65, 49.87] },
  { number: 16, region: 'Americas', location: [-75.48, 10.39] }, { number: 17, region: 'Americas', location: [-77.04, 38.90] },
  { number: 18, region: 'Americas', location: [-91.26, 40.83] }, { number: 19, region: 'World', location: [-74.00, 40.75] },
];

export const ALL_DRAWN_STRINGS: readonly string[] = [
  PAGE.runningLeft, PAGE.runningRight, PAGE.date, PAGE.audit, ...KICKERS,
  ...STATS.flatMap(([value, label]) => [value, label]),
  ...LEADS.flatMap((story) => [String(story.number), `${story.region} · ${story.place}`, story.headline, story.deck, story.source, ...(story.claim ? ['CLAIM'] : [])]),
  PAGE.map, PAGE.mapLegendOne, PAGE.mapLegendTwo, ...MAP_POINTS.map((point) => String(point.number)),
  PAGE.wires, ...WIRES.flatMap((story) => [String(story.number), `${story.place} · ${story.summary}`, story.source]),
  PAGE.dateLabel, DATE_PARAGRAPH,
];
