import { Canvas, COLORS, type Color } from './canvas.ts';
import { drawCentered, drawText, drawWrapped } from './font.ts';

export type Region = 'ASIA' | 'OCEANIA' | 'MIDDLE EAST' | 'EUROPE' | 'AMERICAS' | 'WORLD';
type SceneName = 'rocket' | 'market' | 'prices' | 'wage' | 'diplomat' | 'pact' | 'inflation' | 'port' | 'defence' | 'tanker' | 'refinery' | 'city' | 'asteroid' | 'rescue' | 'tariff' | 'un';

export interface NewsStory {
  number: number;
  region: Region;
  place: string;
  headline: readonly [string, string?];
  fact: string;
  source: string;
  location: readonly [longitude: number, latitude: number];
  scene: SceneName;
  tag?: string;
}

export const REGION_COLORS: Record<Region, Color> = {
  ASIA: COLORS.orange,
  OCEANIA: COLORS.teal,
  'MIDDLE EAST': COLORS.red,
  EUROPE: COLORS.blue,
  AMERICAS: [105, 77, 132],
  WORLD: [177, 84, 112],
};

export const STORIES: readonly NewsStory[] = [
  { number: 1, region: 'ASIA', place: 'JIUQUAN, CHINA', headline: ['FOREIGN ASTRONAUT', 'JOINS SHENZHOU-24'], fact: 'ZEESHAN ALI; 00:18 LIFT-OFF; 03:56 DOCK; 5-10 DAYS.', source: 'REUTERS / AP / BBC', location: [100.30, 40.96], scene: 'rocket' },
  { number: 2, region: 'ASIA', place: 'SEOUL, SOUTH KOREA', headline: ['CHIP SLUMP SENDS', 'KOSPI DOWN 6.16%'], fact: 'KOSPI 4,697.51; SAMSUNG -9.87%; SK HYNIX -11.05%.', source: 'YONHAP', location: [126.98, 37.57], scene: 'market' },
  { number: 3, region: 'ASIA', place: 'TOKYO, JAPAN', headline: ['SERVICES PRICES HIT', '36-YEAR HIGH'], fact: 'OCTOBER PPI +4.2% Y/Y, FASTEST SINCE 1990.', source: 'REUTERS / CNA / BOJ', location: [139.65, 35.68], scene: 'prices' },
  { number: 4, region: 'ASIA', place: 'DHAKA, BANGLADESH', headline: ['GARMENT WAGE RISES', '36%'], fact: 'AFTER PROTESTS: TK 12,500 TO 17,000 FROM 1 DEC.', source: 'AP / AL JAZEERA / ST', location: [90.41, 23.81], scene: 'wage' },
  { number: 5, region: 'ASIA', place: 'PYONGYANG, N. KOREA', headline: ['N. KOREA EXPELS', 'SWISS DIPLOMAT'], fact: 'SYLVAIN ASTIER: 48 HOURS; NEW OFFICE TO SHUT.', source: 'AP / EURONEWS / KOREA TIMES', location: [125.76, 39.04], scene: 'diplomat' },
  { number: 6, region: 'OCEANIA', place: 'CANBERRA, AUSTRALIA', headline: ['AUSTRALIA, SOLOMONS', 'SIGN SECURITY PACT'], fact: 'ALBANESE + WALE; NO BASES; CHINA PACT ENDS APR 2027.', source: 'BBC / AP / AAP', location: [149.13, -35.28], scene: 'pact' },
  { number: 7, region: 'OCEANIA', place: 'CANBERRA, AUSTRALIA', headline: ['AUSTRALIA CPI', 'JUMPS TO 4.9%'], fact: 'THREE-YEAR HIGH; ELECTRICITY +25.2%.', source: 'ABC / ABS', location: [149.13, -35.28], scene: 'inflation' },
  { number: 8, region: 'MIDDLE EAST', place: 'HODEIDAH, YEMEN', headline: ['COALITION STRIKES', 'HODEIDAH PORT'], fact: 'SAADA + AMRAN HIT AFTER EVACUATION WARNING.', source: 'ARAB NEWS / AL ARABIYA / REUTERS', location: [42.95, 14.80], scene: 'port' },
  { number: 9, region: 'MIDDLE EAST', place: 'RAS TANURA, SAUDI', headline: ['AIR DEFENCES STOP', 'SEVEN DRONES'], fact: 'FOUR OVER RAS TANURA; INITIAL: NO INJURIES.', source: 'AL ARABIYA / ANADOLU', location: [50.16, 26.64], scene: 'defence' },
  { number: 10, region: 'MIDDLE EAST', place: 'STRAIT OF HORMUZ', headline: ['IRAN SAYS MINES HIT', 'TWO TANKERS'], fact: 'STATE-MEDIA CLAIM; NOT INDEPENDENTLY CONFIRMED.', source: 'REUTERS / ANADOLU', location: [56.25, 26.57], scene: 'tanker', tag: 'CLAIM' },
  { number: 11, region: 'EUROPE', place: 'SAMARA, RUSSIA', headline: ['UKRAINIAN DRONES HIT', 'TWO REFINERIES'], fact: 'FIRES 800 KM INSIDE RUSSIA; 145 DRONES; ONE KILLED.', source: 'KYIV POST / INDEPENDENT', location: [50.15, 53.20], scene: 'refinery' },
  { number: 12, region: 'EUROPE', place: 'ODESA + KYIV, UKRAINE', headline: ['OVERNIGHT STRIKES', 'KILL CIVILIANS'], fact: '2 DEAD ODESA; 1 NEAR BILA TSERKVA; 2 HURT KYIV.', source: 'INDEPENDENT / UKRINFORM / REUTERS', location: [30.62, 48.47], scene: 'city' },
  { number: 13, region: 'EUROPE', place: 'ESA / DARMSTADT', headline: ['HERA REACHES', 'DIMORPHOS'], fact: 'INSPECT 2022 DART IMPACT; FIRST IMAGES DUE WED.', source: 'BBC NEWS', location: [8.65, 49.87], scene: 'asteroid' },
  { number: 14, region: 'AMERICAS', place: 'CARTAGENA, COLOMBIA', headline: ['ALL HOSTAGES', 'RESCUED'], fact: 'ABOUT 30 HELD; ALL RESCUED; ONE GUNMAN KILLED.', source: 'EURONEWS / AFP / EL UNIVERSAL', location: [-75.48, 10.39], scene: 'rescue' },
  { number: 15, region: 'AMERICAS', place: 'WASHINGTON, US', headline: ['NEW TARIFFS', 'BEING PREPARED'], fact: '14+ PARTNERS NAMED; MOVE DUE AS EARLY AS WED.', source: 'BBC NEWS', location: [-77.04, 38.90], scene: 'tariff' },
  { number: 16, region: 'WORLD', place: 'UNITED NATIONS, NEW YORK', headline: ['16 DAYS AGAINST', 'VIOLENCE BEGIN'], fact: '25 NOV TO 10 DEC; JUSTICE + PREVENTION.', source: 'UN PRESS / UN WOMEN', location: [-74.00, 40.75], scene: 'un' },
];

function scene(c: Canvas, name: SceneName, x: number, y: number, color: Color): void {
  c.rect(x - 30, y - 22, 60, 45, [235, 231, 219]);
  if (name === 'rocket') {
    c.polygon([[x, y - 18], [x + 7, y - 5], [x + 5, y + 11], [x - 5, y + 11], [x - 7, y - 5]], color);
    c.polygon([[x - 4, y + 12], [x, y + 21], [x + 4, y + 12]], COLORS.red);
    c.circle(x, y - 4, 2.5, COLORS.white);
  } else if (name === 'market') {
    for (let i = 0; i < 4; i++) c.rect(x - 25 + i * 11, y + 11 - i * 4, 6, 10 + i * 4, [168, 178, 174]);
    c.line(x - 24, y - 13, x - 8, y - 2, 3, color); c.line(x - 8, y - 2, x + 2, y - 8, 3, color); c.line(x + 2, y - 8, x + 24, y + 13, 3, color);
    c.polygon([[x + 24, y + 13], [x + 14, y + 10], [x + 21, y + 3]], color);
  } else if (name === 'prices' || name === 'inflation') {
    c.rect(x - 22, y + 5, 9, 15, color); c.rect(x - 6, y - 2, 9, 22, color); c.rect(x + 10, y - 11, 9, 31, color);
    c.line(x - 22, y - 11, x + 22, y - 11, 3, COLORS.red); c.polygon([[x + 22, y - 11], [x + 14, y - 17], [x + 15, y - 6]], COLORS.red);
  } else if (name === 'wage') {
    c.polygon([[x - 9, y - 16], [x - 24, y - 7], [x - 16, y + 2], [x - 11, y - 1], [x - 11, y + 19], [x + 11, y + 19], [x + 11, y - 1], [x + 16, y + 2], [x + 24, y - 7], [x + 9, y - 16]], color);
    c.rect(x - 3, y - 7, 6, 20, COLORS.white); c.rect(x - 10, y, 20, 6, COLORS.white);
  } else if (name === 'diplomat') {
    c.rect(x - 20, y - 17, 24, 37, color); c.circle(x - 2, y + 2, 2, COLORS.white);
    c.line(x + 7, y, x + 24, y, 3, COLORS.red); c.polygon([[x + 24, y], [x + 16, y - 6], [x + 16, y + 6]], COLORS.red);
  } else if (name === 'pact') {
    c.circle(x - 10, y, 9, color); c.circle(x + 10, y, 9, color); c.rect(x - 10, y - 4, 20, 8, color);
    c.line(x - 25, y - 14, x - 9, y, 5, color); c.line(x + 25, y - 14, x + 9, y, 5, color);
  } else if (name === 'port') {
    c.polygon([[x - 27, y + 4], [x + 27, y + 4], [x + 17, y + 16], [x - 17, y + 16]], color);
    c.rect(x - 7, y - 13, 14, 17, color); c.line(x - 24, y + 21, x + 24, y + 21, 2, COLORS.blue);
  } else if (name === 'defence') {
    c.polygon([[x, y - 19], [x + 18, y - 11], [x + 14, y + 11], [x, y + 21], [x - 14, y + 11], [x - 18, y - 11]], color);
    c.line(x - 8, y, x - 1, y + 7, 3, COLORS.white); c.line(x - 1, y + 7, x + 10, y - 7, 3, COLORS.white);
  } else if (name === 'tanker') {
    c.polygon([[x - 27, y + 2], [x + 28, y + 2], [x + 17, y + 14], [x - 17, y + 14]], color); c.rect(x - 9, y - 10, 19, 12, color);
    for (const dx of [-19, 0, 19]) { c.circle(x + dx, y + 20, 3, COLORS.red); c.line(x + dx - 5, y + 20, x + dx + 5, y + 20, 1, COLORS.red); }
  } else if (name === 'refinery') {
    c.rect(x - 26, y, 17, 20, color); c.circle(x - 17.5, y, 8.5, color); c.rect(x - 2, y - 12, 10, 32, color); c.rect(x + 14, y - 3, 13, 23, color);
    c.polygon([[x + 3, y - 15], [x + 9, y - 23], [x + 13, y - 13]], COLORS.red);
  } else if (name === 'city') {
    c.rect(x - 25, y - 5, 17, 25, color); c.rect(x - 4, y - 15, 20, 35, color); c.rect(x + 20, y + 2, 9, 18, color);
    c.polygon([[x - 25, y - 13], [x - 5, y - 9], [x - 15, y - 4]], COLORS.red);
  } else {
    c.circle(x, y, 17, color);
    drawCentered(c, name === 'asteroid' ? 'H' : name === 'rescue' ? 'OK' : name === 'tariff' ? '%' : 'UN', x, y - 5, name === 'rescue' ? 1.2 : 1.5, COLORS.white, 0.5);
  }
}

export function drawLeadItem(c: Canvas, story: NewsStory, x: number, y: number, width: number, height: number): void {
  const accent = REGION_COLORS[story.region];
  c.rect(x, y, width, 3, accent);
  c.rect(x, y + 3, 25, 22, accent);
  drawCentered(c, String(story.number).padStart(2, '0'), x + 12.5, y + 9, 1.15, COLORS.white, 0.4);
  drawText(c, `${story.region} / ${story.place}`, x + 31, y + 7, 0.9, accent, 0.6);
  if (story.tag) {
    c.rect(x + width - 67, y + 4, 59, 14, COLORS.red);
    drawCentered(c, story.tag, x + width - 37.5, y + 8, 0.75, COLORS.white, 0.5);
  }
  drawText(c, story.headline[0], x + 31, y + 28, 1.65, COLORS.ink, 0.75);
  if (story.headline[1]) drawText(c, story.headline[1], x + 31, y + 43, 1.65, COLORS.ink, 0.75);
  scene(c, story.scene, x + width - 38, y + 47, accent);
  c.line(x + 31, y + 65, x + width - 76, y + 65, 1, COLORS.line);
  drawWrapped(c, story.fact, x + 31, y + 72, width - 42, 1.0, COLORS.grey, 1, 2);
  drawText(c, `SOURCE: ${story.source}`, x + 31, y + height - 14, 0.78, accent, 0.55);
}

export function drawWireItem(c: Canvas, story: NewsStory, x: number, y: number, width: number): void {
  const accent = REGION_COLORS[story.region];
  c.rect(x, y, width, 1, COLORS.line);
  c.rect(x, y + 5, 27, 26, accent);
  drawCentered(c, String(story.number), x + 13.5, y + 13, 1.05, COLORS.white, 0.4);
  drawText(c, `${story.place} / ${story.headline.join(' ')}`, x + 35, y + 5, 1.15, COLORS.ink, 0.65);
  drawText(c, story.fact, x + 35, y + 19, 0.82, COLORS.grey, 0.55);
  const source = `SOURCE: ${story.source}`;
  drawText(c, source, x + width - source.length * 4.15 - 5, y + 29, 0.7, accent, 0.55);
}
