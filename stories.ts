import { Canvas, COLORS, type Color } from './canvas.ts';
import { drawCentered, drawText, textWidth } from './font.ts';

export type Region = 'ASIA' | 'OCEANIA' | 'SOUTHERN' | 'MIDDLE EAST' | 'EUROPE' | 'AMERICAS' | 'WORLD';
export type SceneName = 'rocket' | 'market' | 'pact' | 'port' | 'refinery' | 'rescue' | 'tariff' | 'tanker' | 'cpi' | 'defence' | 'city' | 'quake';

export interface LeadStory {
  number: number;
  region: Region;
  place: string;
  headline: string;
  fact: string;
  source: string;
  scene: SceneName;
  claim?: boolean;
}

export const REGION_COLORS: Record<Region, Color> = {
  ASIA: COLORS.orange,
  OCEANIA: COLORS.teal,
  SOUTHERN: [55, 133, 151],
  'MIDDLE EAST': COLORS.red,
  EUROPE: COLORS.blue,
  AMERICAS: [105, 77, 132],
  WORLD: [177, 84, 112],
};

export const LEADS: readonly LeadStory[] = [
  { number: 1, region: 'ASIA', place: 'JIUQUAN / CHINA', headline: 'SHENZHOU-24 DOCKS', fact: 'ZEESHAN ALI / 03:56 UTC', source: 'REUTERS / AP / BBC', scene: 'rocket' },
  { number: 2, region: 'ASIA', place: 'SEOUL / SOUTH KOREA', headline: 'KOSPI FALLS 6.16%', fact: 'SAMSUNG -9.87% / HYNIX -11.05%', source: 'YONHAP', scene: 'market' },
  { number: 7, region: 'OCEANIA', place: 'CANBERRA / OCEANIA', headline: 'SECURITY PACT SIGNED', fact: 'NO FOREIGN BASES', source: 'BBC / NYT / AP / AAP', scene: 'pact' },
  { number: 10, region: 'MIDDLE EAST', place: 'HODEIDAH / YEMEN', headline: 'HODEIDAH PORT STRUCK', fact: 'SAADA + AMRAN HIT', source: 'ARAB NEWS / AL ARABIYA / REUTERS', scene: 'port' },
  { number: 13, region: 'EUROPE', place: 'SAMARA / RUSSIA', headline: 'SAMARA REFINERIES HIT', fact: '800 KM IN / ONE KILLED', source: 'KYIV POST / THE INDEPENDENT', scene: 'refinery' },
  { number: 16, region: 'AMERICAS', place: 'CARTAGENA / COLOMBIA', headline: 'HOSTAGES ALL RESCUED', fact: '~30 SAFE / GUNMAN KILLED', source: 'EURONEWS / AFP / EL UNIVERSAL', scene: 'rescue' },
  { number: 17, region: 'AMERICAS', place: 'WASHINGTON / US', headline: 'SECTION 301 TARIFFS', fact: '14+ PARTNERS NAMED', source: 'BBC NEWS', scene: 'tariff' },
  { number: 12, region: 'MIDDLE EAST', place: 'STRAIT OF HORMUZ', headline: 'TANKERS HIT MINES', fact: 'CLAIM / NOT CONFIRMED', source: 'REUTERS / ARAB NEWS / ANADOLU', scene: 'tanker', claim: true },
  { number: 8, region: 'OCEANIA', place: 'CANBERRA / AUSTRALIA', headline: 'AUSTRALIA CPI 4.9%', fact: 'POWER +25.2%', source: 'ABC / ABS', scene: 'cpi' },
  { number: 11, region: 'MIDDLE EAST', place: 'RAS TANURA / SAUDI', headline: 'SEVEN DRONES STOPPED', fact: 'FOUR HERE / NO INJURIES', source: 'AL ARABIYA / ANADOLU', scene: 'defence' },
  { number: 14, region: 'EUROPE', place: 'ODESA + KYIV / UKRAINE', headline: 'ODESA AND KYIV HIT', fact: '3 KILLED / 2 HURT', source: 'THE INDEPENDENT / UKRINFORM / REUTERS', scene: 'city' },
  { number: 9, region: 'SOUTHERN', place: 'BALLENY ISLANDS', headline: 'BALLENY QUAKE M5.9', fact: '01:38 UTC / GREEN ALERT', source: 'USGS', scene: 'quake' },
];

function scene(c: Canvas, name: SceneName, x: number, y: number, color: Color): void {
  c.roundedRect(x - 28, y - 27, 56, 54, 4, [235, 231, 219]);
  if (name === 'rocket') {
    c.polygon([[x, y - 20], [x + 8, y - 6], [x + 6, y + 13], [x - 6, y + 13], [x - 8, y - 6]], color); c.circle(x, y - 5, 3, COLORS.white); c.polygon([[x - 4, y + 14], [x, y + 25], [x + 4, y + 14]], COLORS.red);
  } else if (name === 'market') {
    for (let i = 0; i < 4; i++) c.rect(x - 23 + i * 11, y + 7 - i * 2, 6, 13 + i * 2, [151,168,165]);
    c.line(x - 23, y - 17, x - 6, y - 6, 3, color); c.line(x - 6, y - 6, x + 5, y - 12, 3, color); c.line(x + 5, y - 12, x + 23, y + 8, 3, color);
  } else if (name === 'pact') {
    c.circle(x - 9, y, 9, color); c.circle(x + 9, y, 9, color); c.rect(x - 9, y - 4, 18, 8, color); c.line(x - 24, y - 14, x - 8, y, 5, color); c.line(x + 24, y - 14, x + 8, y, 5, color);
  } else if (name === 'port') {
    c.polygon([[x - 25,y + 2],[x + 25,y + 2],[x + 16,y + 16],[x - 16,y + 16]],color); c.rect(x - 6,y - 17,12,19,color); c.line(x - 23,y + 21,x + 23,y + 21,2,COLORS.blue);
  } else if (name === 'refinery') {
    c.rect(x - 25,y,15,19,color); c.circle(x - 17.5,y,7.5,color); c.rect(x - 4,y - 15,10,34,color); c.rect(x + 14,y - 3,13,22,color); c.polygon([[x + 1,y - 18],[x + 6,y - 26],[x + 11,y - 16]],COLORS.red);
  } else if (name === 'rescue' || name === 'defence') {
    c.polygon([[x,y - 23],[x + 21,y - 13],[x + 17,y + 14],[x,y + 24],[x - 17,y + 14],[x - 21,y - 13]],color); c.line(x - 10,y,x - 2,y + 8,5,COLORS.white); c.line(x - 2,y + 8,x + 12,y - 10,5,COLORS.white);
  } else if (name === 'tariff') {
    c.rect(x - 23,y - 17,46,35,color); c.rect(x - 16,y - 9,32,5,COLORS.white); c.line(x - 13,y + 9,x + 13,y + 9,4,COLORS.white); c.polygon([[x + 13,y + 9],[x + 5,y + 3],[x + 5,y + 15]],COLORS.white);
  } else if (name === 'tanker') {
    c.polygon([[x - 25,y],[x + 25,y],[x + 16,y + 14],[x - 16,y + 14]],color); c.rect(x - 8,y - 14,17,14,color); for(const dx of [-16,0,16]) c.circle(x + dx,y + 21,3,COLORS.red);
  } else if (name === 'cpi') {
    c.rect(x - 21,y + 5,8,15,color); c.rect(x - 6,y - 3,8,23,color); c.rect(x + 9,y - 13,8,33,color); c.line(x - 20,y - 15,x + 21,y - 15,3,COLORS.red); c.polygon([[x + 21,y - 15],[x + 13,y - 21],[x + 13,y - 9]],COLORS.red);
  } else if (name === 'city') {
    c.rect(x - 23,y - 4,14,23,color); c.rect(x - 5,y - 15,17,34,color); c.rect(x + 16,y + 2,9,17,color); c.polygon([[x - 23,y - 11],[x - 6,y - 8],[x - 14,y - 3]],COLORS.red);
  } else {
    c.circle(x,y,20,color); c.circle(x,y,12,[235,231,219]); c.line(x - 19,y - 5,x - 5,y - 14,3,color); c.line(x + 5,y + 14,x + 19,y + 5,3,color);
  }
}

function horizontalScale(text: string, height: number, maxWidth: number, preferred = 0.78): number {
  const natural = textWidth(text, height, 0.02, preferred);
  return natural <= maxWidth ? preferred : preferred * maxWidth / natural;
}

export function drawLead(c: Canvas, story: LeadStory, x: number, y: number, width: number, height: number): void {
  const color = REGION_COLORS[story.region];
  c.rect(x, y, width, 2, color);
  c.circle(x + 13, y + 14, 11, color);
  drawCentered(c, String(story.number), x + 13, y + 8, 14, COLORS.white, 0.01, 0.72);
  scene(c, story.scene, x + 36, y + 61, color);
  drawText(c, story.place, x + 73, y + 3, 14, color, 0.02, horizontalScale(story.place, 14, width - 82, 0.78));
  if (story.claim) {
    c.roundedRect(x + width - 57, y + 2, 53, 18, 2, COLORS.red);
    drawCentered(c, 'CLAIM', x + width - 30.5, y + 5, 12, COLORS.white, 0.01, 0.74);
  }
  drawText(c, story.headline, x + 73, y + 23, 26, COLORS.ink, 0.02, horizontalScale(story.headline, 26, width - 81, 0.76));
  drawText(c, story.fact, x + 73, y + 53, 16, COLORS.grey, 0.015, horizontalScale(story.fact, 16, width - 81, 0.73));
  drawText(c, story.source, x + 73, y + 76, 14, color, 0.01, horizontalScale(story.source, 14, width - 81, 0.70));
}
