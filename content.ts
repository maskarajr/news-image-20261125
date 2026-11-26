export type Region = 'Asia' | 'Europe' | 'Africa' | 'Americas' | 'Middle East' | 'Oceania' | 'World';
export type Badge = 'OFFICIAL' | 'CONFIRMED' | 'REPORTED' | 'CLAIM';
export type Location = readonly [longitude: number, latitude: number];

interface Story {
  number: number;
  region: Region;
  place: string;
  source: string;
}

interface Card extends Story {
  location: Location;
  badge: Badge;
  headline: readonly [string, string];
  deck: string;
}

export interface HeroStory extends Card {
  scene: 'station' | 'market' | 'tariffs';
  takeaway: string;
}

export interface MidStory extends Card {
  scene: 'energy' | 'garments' | 'fire' | 'mine' | 'treaty' | 'rescue' | 'court' | 'tankers' | 'clinic' | 'asteroid';
  figure: string;
  caption: string;
}

export interface BriefStory extends Story { summary: string }

export const HEROES: readonly HeroStory[] = [
  {
    number: 1, region: 'Asia', place: 'Jiuquan, China', location: [100.29, 40.96],
    badge: 'OFFICIAL', scene: 'station', headline: ['Shenzhou-24 docks', 'at Tiangong'],
    deck: 'Pakistan’s Muhammad Zeeshan Ali entered the station with two Chinese crewmates at 06:35 UTC.',
    takeaway: 'Pakistan can now run crewed experiments in orbit.', source: 'CMSA via Xinhua · Reuters',
  },
  {
    number: 2, region: 'Asia', place: 'Seoul, South Korea', location: [126.93, 37.52],
    badge: 'OFFICIAL', scene: 'market', headline: ['KOSPI falls 6.16%', 'as chip stocks slide'],
    deck: 'Seoul’s index shed 308.52 points to close at 4,697.51. Losses spread to Taiwan and Japan.',
    takeaway: 'The chip sell-off erased Tuesday’s KOSPI rally.', source: 'Yonhap · Anadolu',
  },
  {
    number: 3, region: 'Americas', place: 'Washington, US', location: [-77.04, 38.90],
    badge: 'OFFICIAL', scene: 'tariffs', headline: ['US proposes tariffs', 'on 14 economies'],
    deck: 'The Section 301 plan targets excess factory capacity. Some goods would be exempt.',
    takeaway: 'Import costs would rise if the duties take effect.', source: 'US Trade Representative · Reuters',
  },
];

export const SECONDARY: readonly MidStory[] = [
  {
    number: 4, region: 'Europe', place: 'London, UK', location: [-0.13, 51.51],
    badge: 'OFFICIAL', scene: 'energy', figure: '+26%', caption: 'FROM 1 JAN',
    headline: ['UK energy price', 'cap rises 26%'],
    deck: '£1,723 to £2,166 a year at typical direct-debit use in Great Britain.', source: 'Ofgem',
  },
  {
    number: 5, region: 'Asia', place: 'Gazipur, Bangladesh', location: [90.36, 23.99],
    badge: 'REPORTED', scene: 'garments', figure: '+36%', caption: 'WAGE FLOOR',
    headline: ['Garment workers', 'block Dhaka road'],
    deck: 'Protesters say the new minimum of 17,000 taka a month is too low.', source: 'The Business Standard',
  },
  {
    number: 6, region: 'Africa', place: 'Giza, Egypt', location: [31.22, 30.10],
    badge: 'OFFICIAL', scene: 'fire', figure: '21', caption: 'INJURED',
    headline: ['Tanker fire kills', 'at least 31'],
    deck: 'A fuel truck crashed in Warraq, near Cairo’s Ring Road.', source: 'Health Ministry via CNN',
  },
  {
    number: 7, region: 'Asia', place: 'Bogor, Indonesia', location: [106.55, -6.66],
    badge: 'REPORTED', scene: 'mine', figure: '100 m', caption: 'EST. SHAFT DEPTH',
    headline: ['Nine miners found', 'dead in Bogor'],
    deck: 'Crews search a flooded gold mine for 17 others feared trapped.', source: 'Associated Press',
  },
  {
    number: 8, region: 'Oceania', place: 'Canberra, Australia', location: [149.13, -35.31],
    badge: 'OFFICIAL', scene: 'treaty', figure: 'A$740m', caption: 'OVER 10 YEARS',
    headline: ['Solomons signs', 'Australia treaty'],
    deck: 'The partners bar foreign bases in the Solomon Islands.', source: 'Australian PM · AP',
  },
  {
    number: 9, region: 'Americas', place: 'Cartagena, Colombia', location: [-75.47, 10.39],
    badge: 'CONFIRMED', scene: 'rescue', figure: '17 h', caption: 'STANDOFF',
    headline: ['Police free last', 'Éxito hostages'],
    deck: 'Shoppers and staff went free after an overnight rescue.', source: 'BBC News · AP',
  },
  {
    number: 10, region: 'Africa', place: 'Cape Town, South Africa', location: [18.42, -33.92],
    badge: 'OFFICIAL', scene: 'court', figure: '3–0', caption: 'COURT RULING',
    headline: ['Judges set aside', 'farm cash report'],
    deck: 'Ramaphosa won his challenge to the Phala Phala panel’s findings.', source: 'Reuters · IOL',
  },
  {
    number: 11, region: 'Middle East', place: 'Strait of Hormuz', location: [56.32, 26.57],
    badge: 'CLAIM', scene: 'tankers', figure: '2 tankers', caption: 'IRAN’S ACCOUNT',
    headline: ['Iran says mines', 'hit two tankers'],
    deck: 'The Revolutionary Guards’ account lacked independent confirmation.', source: 'Reuters · Anadolu',
  },
  {
    number: 12, region: 'Africa', place: 'Beni, DR Congo', location: [29.47, 0.49],
    badge: 'REPORTED', scene: 'clinic', figure: 'About 650', caption: 'DEAD SINCE MAY',
    headline: ['Families search', 'for Ebola dead'],
    deck: 'Relatives told Reuters they could not find their families’ graves.', source: 'Reuters',
  },
  {
    number: 13, region: 'Europe', place: 'Berlin, Germany', location: [13.38, 52.53],
    badge: 'OFFICIAL', scene: 'asteroid', figure: '151 m', caption: 'MOONLET WIDTH',
    headline: ['Hera images show', 'DART’s crater'],
    deck: 'New views of Dimorphos show a crater spanning the moonlet’s face.', source: 'European Space Agency',
  },
];

export const LEADS = [...HEROES, ...SECONDARY];
export const BRIEFS: readonly BriefStory[] = [
  { number: 14, region: 'Americas', place: 'Washington', summary: 'Oct. PCE 3.8% on year; core 3.3%', source: 'BEA' },
  { number: 15, region: 'Europe', place: 'Ukraine', summary: 'Strikes cut power in five regions', source: 'Ukrinform' },
  { number: 16, region: 'Europe', place: 'Samara', summary: 'Two refineries reported on fire', source: 'DW · Kyiv Post' },
  { number: 17, region: 'Middle East', place: 'Hodeidah', summary: 'Coalition reports port strikes', source: 'Reuters' },
  { number: 18, region: 'Middle East', place: 'Ras Tanura', summary: 'Coalition reports four drones down', source: 'Reuters' },
  { number: 19, region: 'Middle East', place: 'Gaza City', summary: 'Airstrike kills Mohammad Abuelouf', source: 'AP' },
  { number: 20, region: 'Africa', place: 'Khartoum', summary: 'Rejects Ethiopia’s offer of talks', source: 'Sudan Tribune' },
  { number: 21, region: 'Africa', place: 'Dakar', summary: 'FA head denies contact with CAS', source: 'AFP' },
  { number: 22, region: 'Africa', place: 'Lusaka', summary: 'Court defers Mundubile bail ruling', source: 'Lusaka Times' },
  { number: 23, region: 'Asia', place: 'Pyongyang', summary: 'Envoy Sylvain Astier has 48h to leave', source: 'AP' },
  { number: 24, region: 'Asia', place: 'Jakarta', summary: 'OECD review about 80% complete', source: 'ANTARA' },
  { number: 25, region: 'Europe', place: 'Warsaw', summary: 'Poland proposes border no-fly zone', source: 'DW' },
  { number: 26, region: 'Europe', place: 'Berlin', summary: 'Merz: Russia wants more than Ukraine', source: 'DW' },
  { number: 27, region: 'Europe', place: 'Paris–London', summary: 'Eurostar strike cancels trains', source: 'Eurostar' },
  { number: 28, region: 'Americas', place: 'Buenos Aires', summary: 'Boca honours Diego Maradona', source: 'DeporTV' },
  { number: 29, region: 'Americas', place: 'Middletown, Iowa', summary: 'Army destroys lead azide stock', source: 'AP' },
  { number: 30, region: 'Oceania', place: 'Australia', summary: 'October CPI rises to 4.9% from 4.3%', source: 'ABS' },
  { number: 31, region: 'Oceania', place: 'Nadi', summary: 'Ex-cyclone Xavier: 20–25 knot winds', source: 'RSMC Nadi' },
  { number: 32, region: 'World', place: 'Port Moresby', summary: '16 Days of Activism begins', source: 'UN Women' },
  { number: 33, region: 'World', place: 'Balleny Islands', summary: 'M5.9 quake, 10 km deep', source: 'USGS' },
];

export const EDITION = [...LEADS, ...BRIEFS];
const regions: readonly Region[] = ['Asia', 'Europe', 'Africa', 'Americas', 'Middle East', 'Oceania', 'World'];
export const REGION_COUNTS = regions.map(region => ({ region, count: EDITION.filter(s => s.region === region).length }));

export const PAGE = {
  runningLeft: 'THE WORLD IN ONE DAY', runningRight: `${EDITION.length} STORIES   /   WORLD EDITION`,
  date: 'Wednesday 25 November 2026',
  deck: 'Shenzhou-24 carries Pakistan’s first astronaut to Tiangong; Seoul’s KOSPI falls 6.16%; the US proposes new tariffs.',
  utcLabel: 'THE DAY IN UTC', why: 'WHY IT MATTERS',
  map: `Where it happened — Stories 1–${LEADS.length}`, mapCredit: 'Coastlines: Natural Earth',
  briefs: `Also on 25 November — ${BRIEFS.length} more stories`, dateLabel: 'DATE CHECK', badgeLegend: 'Verification',
} as const;

export const KPIS = [
  { label: 'KOSPI close', value: '4,697.51', note: 'Down 6.16% in Seoul' },
  { label: 'UK energy cap', value: '£2,166', note: 'Typical annual bill · Jan 2027' },
  { label: 'US tariff proposal', value: 'Up to 25%', note: 'On goods from India' },
  { label: 'Dhaka garment wage', value: '17,000 taka', note: 'Monthly minimum · up 36%' },
  { label: 'Cairo tanker deaths', value: 'At least 31', note: '21 injured near the Ring Road' },
  { label: 'Aboard Tiangong', value: '1st Pakistani', note: 'Muhammad Zeeshan Ali' },
] as const;

export const TIMELINE = [
  ['00:18', 'Shenzhou launch'], ['01:38', 'M5.9 quake'], ['03:56', 'Tiangong dock'],
  ['06:30', 'KOSPI close'], ['13:30', 'US inflation'], ['18:45', 'Hera live'],
] as const;

export const MARKET_CLOSES = [
  { name: 'KOSPI', loss: 6.16 }, { name: 'Samsung', loss: 9.87 },
  { name: 'SK hynix', loss: 11.05 }, { name: 'TAIEX', loss: 4.80 }, { name: 'Nikkei 225', loss: 2.78 },
] as const;
export const TARIFF_RATES = [
  { name: 'CHINA', rate: 20 }, { name: 'INDIA', rate: 25 },
  { name: 'EU', rate: 15 }, { name: 'VIETNAM', rate: 35 },
] as const;

export const BADGE_LEGEND: readonly { badge: Badge; label: string }[] = [
  { badge: 'OFFICIAL', label: 'official record' }, { badge: 'CONFIRMED', label: 'multiple sources' },
  { badge: 'REPORTED', label: 'press account' }, { badge: 'CLAIM', label: 'unverified' },
];

export const DATE_PARAGRAPH = `All ${EDITION.length} stories occurred or were first reported on 25 Nov 2026 UTC. 23 Nov — leaked Rosstat data and the Bogor mine flood. 24 Nov — the Dhaka wage vote and the CAS ruling restoring Senegal’s title. Wednesday brought the mine recoveries, the workers’ blockade and the Senegal FA’s denial of contact with CAS. Ofgem announced January’s cap; the US tariff rates are proposals.`;
