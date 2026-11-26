export type Region = 'Asia' | 'Europe' | 'Africa' | 'Americas' | 'Middle East' | 'Oceania' | 'World';
export type Badge = 'OFFICIAL' | 'CONFIRMED' | 'REPORTED' | 'CLAIM';
export type Scene = 'rocket' | 'market' | 'tariffs' | 'treaty' | 'priceCap' | 'court' | 'tankers' | 'refinery' | 'rescue' | 'port' | 'clinic' | 'city' | 'stocks' | 'asteroid';

export interface MapPoint {
  number: number;
  region: Region;
  location: readonly [longitude: number, latitude: number];
}
export interface LeadStory extends MapPoint {
  place: string;
  badge: Badge;
  headline: string;
  deck: string;
  source: string;
  callout: string;
  scene: Scene;
}
export interface BriefStory extends MapPoint {
  place: string;
  summary: string;
  source: string;
}

const leadData: Omit<LeadStory, 'number'>[] = [
  { region: 'Asia', place: 'Jiuquan, China', location: [100.30, 40.96], badge: 'OFFICIAL', headline: 'Pakistani astronaut docks at Tiangong', deck: 'Muhammad Zeeshan Ali, first foreigner on China’s station; crew enters at 06:35 UTC', source: 'Reuters · Xinhua · AP', callout: '03:56 UTC', scene: 'rocket' },
  { region: 'Asia', place: 'Seoul, South Korea', location: [126.98, 37.57], badge: 'OFFICIAL', headline: 'KOSPI closes down 6.16%', deck: 'Index ends at 4,697.51; Samsung −9.87%, SK hynix −11.05%', source: 'Yonhap', callout: '−6.16%', scene: 'market' },
  { region: 'Americas', place: 'Washington, US', location: [-77.04, 38.90], badge: 'OFFICIAL', headline: 'US proposes Section 301 tariffs', deck: 'Section 301 targets 14 economies; India up to 25%, China 20%', source: 'USTR · Reuters · Nikkei', callout: 'UP TO 25%', scene: 'tariffs' },
  { region: 'Oceania', place: 'Canberra, Australia', location: [149.13, -35.28], badge: 'OFFICIAL', headline: 'Australia–Solomons pact signed', deck: 'No foreign bases; China deal ends Apr 2027', source: 'BBC · AP · AAP', callout: 'APR 2027', scene: 'treaty' },
  { region: 'Europe', place: 'London, UK', location: [-0.13, 51.51], badge: 'OFFICIAL', headline: 'UK energy price cap rises 26%', deck: 'Typical bill £1,723 to £2,166 a year from 1 Jan', source: 'Ofgem', callout: '+26%', scene: 'priceCap' },
  { region: 'Middle East', place: 'Strait of Hormuz', location: [56.25, 26.57], badge: 'CLAIM', headline: 'Iran claims mines hit tankers', deck: 'IRGC claim of two burning tankers unverified', source: 'Reuters · Arab News · Anadolu', callout: 'HORMUZ', scene: 'tankers' },
  { region: 'Europe', place: 'Samara, Russia', location: [50.15, 53.20], badge: 'REPORTED', headline: 'Drones hit Samara refineries', deck: 'Fires 800 km inside Russia; one killed', source: 'DW · Kyiv Post · Independent', callout: '800 KM', scene: 'refinery' },
  { region: 'Americas', place: 'Cartagena, Colombia', location: [-75.48, 10.39], badge: 'CONFIRMED', headline: 'Cartagena hostages all freed', deck: 'About 30 held at Éxito; one gunman killed', source: 'UPI · AFP · Euronews', callout: '30 HELD', scene: 'rescue' },
  { region: 'Middle East', place: 'Hodeidah, Yemen', location: [42.95, 14.80], badge: 'CONFIRMED', headline: 'Strikes hit Hodeidah port', deck: 'Saada and Amran also struck', source: 'Reuters · Arab News · Al Arabiya', callout: 'HODEIDAH', scene: 'port' },
  { region: 'Africa', place: 'Beni, DR Congo', location: [29.47, 0.49], badge: 'REPORTED', headline: 'Families seek Ebola dead', deck: 'About 650 dead in Beni since May', source: 'Reuters', callout: '650 DEAD', scene: 'clinic' },
  { region: 'Africa', place: 'Giza, Egypt', location: [31.22, 30.10], badge: 'OFFICIAL', headline: 'Cairo tanker fire kills 31', deck: 'At least 31 dead, 21 injured on the Ring Road', source: 'Health Ministry · CNN', callout: '31 DEAD', scene: 'refinery' },
  { region: 'Americas', place: 'New York, US', location: [-74.15, 40.75], badge: 'OFFICIAL', headline: 'US Oct PCE rises to 3.8%', deck: 'Core PCE 3.3%; stocks drop', source: 'BEA · Reuters · AP', callout: 'PCE 3.8%', scene: 'stocks' },
  { region: 'Europe', place: 'Darmstadt, Germany', location: [8.65, 49.87], badge: 'OFFICIAL', headline: 'Hera reaches Dimorphos', deck: 'First post-DART images at 18:45 UTC', source: 'ESA · BBC News', callout: '18:45 UTC', scene: 'asteroid' },
];

const briefData: Omit<BriefStory, 'number'>[] = [
  { region: 'Asia', place: 'Tokyo', location: [139.65, 35.68], summary: 'Services PPI +4.2%, 36-yr high', source: 'Reuters · BOJ · CNA' },
  { region: 'Asia', place: 'Dhaka', location: [90.41, 23.81], summary: 'Garment wage raised 36%', source: 'AP · Al Jazeera' },
  { region: 'Asia', place: 'Pyongyang', location: [125.76, 39.04], summary: 'Sylvain Astier: 48h to leave', source: 'AP · Euronews' },
  { region: 'Asia', place: 'Xiamen', location: [118.09, 24.48], summary: 'Airline orders 50 Boeing 737s', source: 'Nikkei Asia · Benzinga' },
  { region: 'Asia', place: 'Jakarta', location: [106.85, -6.21], summary: 'OECD review about 80% done', source: 'ANTARA · CNBC' },
  { region: 'Europe', place: 'Warsaw', location: [21.01, 52.23], summary: 'Border no-fly zone set', source: 'DW · The Guardian' },
  { region: 'Europe', place: 'Berlin', location: [13.40, 52.52], summary: 'Merz warns Russia wants more', source: 'DW' },
  { region: 'Europe', place: 'Paris / London', location: [1.10, 50.20], summary: 'Eurostar strike hits trains', source: 'AP · ABC News' },
  { region: 'Africa', place: 'Khartoum', location: [32.56, 15.50], summary: 'Rejects Ethiopia talks offer', source: 'SUNA · Sudan Tribune · Reuters' },
  { region: 'Africa', place: 'Dakar', location: [-17.45, 14.72], summary: 'FA head denies CAS contact', source: 'AFP' },
  { region: 'Africa', place: 'Cape Town', location: [18.42, -33.92], summary: 'Court voids Farmgate report', source: 'Reuters · CNBC Africa · IOL' },
  { region: 'Middle East', place: 'Ras Tanura', location: [50.16, 26.64], summary: 'Seven drones intercepted', source: 'Reuters · Al Arabiya' },
  { region: 'Middle East', place: 'Gaza City', location: [34.80, 31.50], summary: 'Strike kills Mohammad Abuelouf', source: 'Reuters · AP · Arab News' },
  { region: 'Americas', place: 'Buenos Aires', location: [-58.38, -34.60], summary: 'Argentina enters recession', source: 'EL PAÍS · Bloomberg' },
  { region: 'Americas', place: 'Middletown, Iowa', location: [-91.26, 40.83], summary: '5-ton lead azide blast set', source: 'AP · US Army' },
  { region: 'Oceania', place: 'Canberra', location: [149.13, -35.28], summary: 'October CPI jumps to 4.9%', source: 'ABC · ABS' },
  { region: 'Oceania', place: 'Port Moresby', location: [147.18, -9.44], summary: 'Drought aid for 680,000', source: 'RNZ · Pacific.scoop' },
  { region: 'Oceania', place: 'Balleny Islands', location: [170.94, -63.09], summary: 'M5.9 quake; green alert', source: 'USGS · GDACS' },
  { region: 'World', place: 'New York, UN', location: [-74.00, 40.75], summary: '16 Days of Activism starts', source: 'UN Press · UN Women' },
  { region: 'Europe', place: 'Odesa & Kyiv', location: [30.62, 48.47], summary: 'Grid strikes kill three', source: 'Reuters · DW · Ukrinform' },
];

export const LEADS: readonly LeadStory[] = leadData.map((story, i) => ({ ...story, number: i + 1 }));
export const BRIEFS: readonly BriefStory[] = briefData.map((story, i) => ({ ...story, number: LEADS.length + i + 1 }));
export const MAP_POINTS: readonly MapPoint[] = [...LEADS, ...BRIEFS];

const regionOrder: readonly Region[] = ['Asia', 'Europe', 'Africa', 'Americas', 'Middle East', 'Oceania', 'World'];
export const REGION_COUNTS = regionOrder.map(region => ({ region, count: MAP_POINTS.filter(p => p.region === region).length }));
export const MAP_REGION_LABELS = REGION_COUNTS.map(({ region, count }) => `${region === 'Middle East' ? 'Mid East' : region} ${count}`);
export const BADGE_LEGEND: readonly {badge: Badge; label: string}[] = [
  { badge: 'OFFICIAL', label: 'official record' }, { badge: 'CONFIRMED', label: 'multi-wire' },
  { badge: 'REPORTED', label: 'monitor or press' }, { badge: 'CLAIM', label: 'unverified' },
];

const shortDate = '25 Nov 2026';
const total = MAP_POINTS.length;
export const PAGE = {
  runningLeft: 'THE WORLD IN ONE DAY', runningRight: `ALL ${total} STORIES DATED WEDNESDAY 25 NOV`,
  date: 'Wednesday 25 November 2026',
  tagline: 'Shenzhou-24 carries Pakistan’s first astronaut to Tiangong · KOSPI falls 6.16% · US proposes new tariffs',
  regionSummary: [`${total} stories, all dated ${shortDate}`, ...REGION_COUNTS.map(({region, count}) => `${region} ${count}`)].join(' · '),
  utcLabel: 'THE DAY IN UTC',
  utcLine: '00:19 Shenzhou-24 launch · 01:38 M5.9 quake · 03:56 Tiangong dock · 06:30 KOSPI −6.16% · 13:30 US PCE 3.8% · 18:45 Hera live',
  map: 'Where it happened', briefs: `Also on 25 November — ${BRIEFS.length} more stories`, dateLabel: 'DATE CHECK', badgeLegend: 'Badges:',
} as const;

export const DATE_PARAGRAPH = `All ${total} stories occurred or were first reported on ${shortDate} UTC.\nEarlier dates excluded: 23 Nov — leaked Rosstat data; 24 Nov — CAS restores Senegal AFCON title. Map data: Natural Earth (public domain).`;

export const ALL_DRAWN_STRINGS: readonly string[] = [
  PAGE.runningLeft, PAGE.runningRight, PAGE.date, PAGE.tagline, PAGE.regionSummary, PAGE.utcLabel, PAGE.utcLine,
  ...LEADS.flatMap(s => [String(s.number), s.badge, s.callout, `${s.region} · ${s.place}`, s.headline, s.deck, s.source]),
  PAGE.map, ...MAP_POINTS.map(p => String(p.number)), ...MAP_REGION_LABELS,
  PAGE.briefs, ...BRIEFS.flatMap(s => [String(s.number), `${s.place} · ${s.summary}`, s.source]),
  PAGE.badgeLegend, ...BADGE_LEGEND.flatMap(b => [b.badge, b.label]), PAGE.dateLabel, DATE_PARAGRAPH,
];
