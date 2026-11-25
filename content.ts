import { LEADS } from './stories.ts';

export const PAGE = {
  edition: 'GLOBAL DAILY / ONE-DAY EDITION',
  audit: '16 STORIES / 6 REGIONS / ALL DATED, ALL SOURCED',
  masthead: 'THE WORLD TODAY',
  date: 'WEDNESDAY, 25 NOVEMBER 2026',
  leadSection: 'EIGHT LEAD STORIES / WEDNESDAY WORLD EDITION',
  wireSection: 'ALSO ON 25 NOVEMBER',
  dateCheck: 'DATE CHECK',
  dateStatement: 'ABOVE: 25 NOV / EARLIER STORIES:',
  dateFooter: '24 NOV CONTEXT / NOT WEDNESDAY NEWS',
} as const;

export const STATS: readonly (readonly [string, string])[] = [
  ['-6.16%', 'KOSPI'],
  ['4.9%', 'AUSTRALIA CPI'],
  ['+36%', 'GARMENT WAGE'],
  ['7', 'DRONES STOPPED'],
  ['~30', 'HOSTAGES RESCUED'],
];

export const WIRES: readonly { number: string; line: string }[] = [
  { number: '03', line: 'TOKYO / SERVICES PPI +4.2% / REUTERS-CNA-BOJ' },
  { number: '04', line: 'DHAKA / GARMENT WAGE +36% / AP-AL JAZEERA-ST' },
  { number: '05', line: 'PYONGYANG / SWISS DIPLOMAT EXPELLED / AP-EURONEWS-KT' },
  { number: '07', line: 'CANBERRA / CPI 4.9%; POWER +25.2% / ABC-ABS' },
  { number: '09', line: 'RAS TANURA / 7 DRONES STOPPED / AL ARABIYA-ANADOLU' },
  { number: '12', line: 'ODESA-KYIV / 3 KILLED, 2 HURT / INDEP-UKRINFORM-REUTERS' },
  { number: '13', line: 'DARMSTADT / HERA REACHES DIMORPHOS / BBC NEWS' },
  { number: '16', line: 'NEW YORK / 16 DAYS: JUSTICE + PREVENTION / UN PRESS-WOMEN' },
];

export const DATE_ITEMS: readonly { event: string; source: string }[] = [
  { event: '24 NOV / RIYADH TOWER HIT; 11 WOUNDED', source: 'REUTERS / ARAB NEWS' },
  { event: '24 NOV / HUAWEI GUILTY; RICO CLEARED', source: 'US DOJ / REUTERS / AP' },
  { event: '24 NOV / REAL MADRID 5-1 PSV', source: 'UEFA / BBC SPORT' },
  { event: '24 NOV / GAZA KILLS 7; ABU NAHEL', source: 'BBC / AL-MONITOR / DAWN' },
  { event: '24 NOV / SENEGAL RESTORED AFCON TITLE', source: 'ANADOLU / BBC SPORT / CAS' },
];

export const ALL_DRAWN_STRINGS: readonly string[] = [
  PAGE.edition, PAGE.audit, PAGE.masthead, PAGE.date,
  ...STATS.flatMap(([value, label]) => [value, label]),
  PAGE.leadSection,
  ...LEADS.flatMap((story) => [String(story.number), story.place, story.headline, story.fact, story.source, ...(story.claim ? ['CLAIM'] : [])]),
  PAGE.wireSection,
  ...WIRES.flatMap((wire) => [wire.number, wire.line]),
  PAGE.dateCheck, PAGE.dateStatement,
  ...DATE_ITEMS.flatMap((item) => [item.event, item.source]),
  PAGE.dateFooter,
];
