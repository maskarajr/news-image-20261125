import { Canvas, COLORS, type Color } from './canvas.ts';
import { drawCentered, drawText, fitTextHeight } from './font.ts';

export type SceneName = 'rocket' | 'market' | 'pact' | 'port' | 'refinery' | 'rescue' | 'tariff' | 'tanker';

export interface Story {
  number: number;
  place: string;
  headline: string;
  fact: string;
  source: string;
  accent: Color;
  scene: SceneName;
  claim?: boolean;
}

export const LEADS: readonly Story[] = [
  { number: 1, place: 'JIUQUAN, CHINA', headline: 'SHENZHOU-24 DOCKS', fact: 'ALI: 1ST FOREIGN / 03:56 / 5-10 DAYS', source: 'REUTERS / AP / BBC', accent: COLORS.orange, scene: 'rocket' },
  { number: 2, place: 'SEOUL, SOUTH KOREA', headline: 'KOSPI FALLS 6.16%', fact: 'SAMSUNG -9.87% / HYNIX -11.05%', source: 'YONHAP', accent: COLORS.orange, scene: 'market' },
  { number: 6, place: 'AUSTRALIA + SOLOMONS', headline: 'SECURITY PACT SIGNED', fact: 'NO FOREIGN BASES / CHINA PACT: APR 2027', source: 'BBC / NYT / AP / AAP', accent: COLORS.teal, scene: 'pact' },
  { number: 8, place: 'HODEIDAH, YEMEN', headline: 'HODEIDAH STRIKES', fact: 'PORT, SAADA + AMRAN HIT', source: 'ARAB NEWS / AL ARABIYA / REUTERS', accent: COLORS.red, scene: 'port' },
  { number: 11, place: 'SAMARA, RUSSIA', headline: 'TWO REFINERIES HIT', fact: '800 KM INSIDE RUSSIA / ONE KILLED', source: 'KYIV POST / THE INDEPENDENT', accent: COLORS.blue, scene: 'refinery' },
  { number: 14, place: 'CARTAGENA, COLOMBIA', headline: 'HOSTAGES RESCUED', fact: '~30 SAFE / ONE GUNMAN KILLED', source: 'EURONEWS / AFP / EL UNIVERSAL', accent: [105, 77, 132], scene: 'rescue' },
  { number: 15, place: 'WASHINGTON, US', headline: 'SECTION 301 TARIFFS', fact: '14+ PARTNERS / CHINA, EU, JAPAN', source: 'BBC NEWS', accent: [105, 77, 132], scene: 'tariff' },
  { number: 10, place: 'STRAIT OF HORMUZ', headline: 'TANKERS HIT MINES', fact: 'NOT INDEPENDENTLY CONFIRMED', source: 'REUTERS / ARAB NEWS / ANADOLU', accent: COLORS.red, scene: 'tanker', claim: true },
];

function drawScene(c: Canvas, scene: SceneName, x: number, y: number, color: Color): void {
  c.roundedRect(x - 37, y - 34, 74, 68, 5, [235, 231, 219]);
  if (scene === 'rocket') {
    c.polygon([[x, y - 27], [x + 11, y - 8], [x + 8, y + 19], [x - 8, y + 19], [x - 11, y - 8]], color);
    c.circle(x, y - 7, 4, COLORS.white); c.polygon([[x - 6, y + 20], [x, y + 34], [x + 6, y + 20]], COLORS.red);
  } else if (scene === 'market') {
    for (let i = 0; i < 4; i++) c.rect(x - 30 + i * 15, y + 8 - i * 3, 8, 18 + i * 3, [151, 168, 165]);
    c.line(x - 29, y - 22, x - 8, y - 8, 4, color); c.line(x - 8, y - 8, x + 5, y - 16, 4, color); c.line(x + 5, y - 16, x + 29, y + 11, 4, color);
    c.polygon([[x + 29, y + 11], [x + 18, y + 7], [x + 26, y]], color);
  } else if (scene === 'pact') {
    c.circle(x - 13, y, 12, color); c.circle(x + 13, y, 12, color); c.rect(x - 14, y - 5, 28, 10, color);
    c.line(x - 32, y - 18, x - 12, y, 7, color); c.line(x + 32, y - 18, x + 12, y, 7, color);
  } else if (scene === 'port') {
    c.polygon([[x - 34, y + 3], [x + 34, y + 3], [x + 23, y + 21], [x - 22, y + 21]], color);
    c.rect(x - 8, y - 22, 16, 25, color); c.line(x - 31, y + 29, x + 31, y + 29, 3, COLORS.blue);
  } else if (scene === 'refinery') {
    c.rect(x - 34, y, 21, 27, color); c.circle(x - 23.5, y, 10.5, color); c.rect(x - 6, y - 19, 13, 46, color); c.rect(x + 16, y - 4, 18, 31, color);
    c.polygon([[x, y - 22], [x + 7, y - 34], [x + 13, y - 19]], COLORS.red);
  } else if (scene === 'rescue') {
    c.polygon([[x, y - 31], [x + 28, y - 18], [x + 22, y + 19], [x, y + 33], [x - 22, y + 19], [x - 28, y - 18]], color);
    c.line(x - 13, y, x - 2, y + 11, 6, COLORS.white); c.line(x - 2, y + 11, x + 17, y - 13, 6, COLORS.white);
  } else if (scene === 'tariff') {
    c.rect(x - 31, y - 22, 62, 45, color); c.rect(x - 22, y - 12, 44, 7, COLORS.white);
    c.line(x - 18, y + 12, x + 18, y + 12, 5, COLORS.white); c.polygon([[x + 18, y + 12], [x + 7, y + 4], [x + 7, y + 20]], COLORS.white);
  } else {
    c.polygon([[x - 34, y + 1], [x + 34, y + 1], [x + 22, y + 20], [x - 22, y + 20]], color); c.rect(x - 11, y - 18, 23, 19, color);
    for (const dx of [-23, 0, 23]) { c.circle(x + dx, y + 28, 4, COLORS.red); c.line(x + dx - 7, y + 28, x + dx + 7, y + 28, 2, COLORS.red); }
  }
}

export function drawLeadTile(c: Canvas, story: Story, x: number, y: number, width: number, height: number): void {
  c.rect(x, y, width, height, COLORS.white);
  c.rect(x, y, 5, height, story.accent);
  drawScene(c, story.scene, x + 50, y + height / 2 + 3, story.accent);
  c.circle(x + 18, y + 17, 14, story.accent);
  drawCentered(c, String(story.number), x + 18, y + 10, 15, COLORS.white, 0.02);
  drawText(c, story.place, x + 101, y + 5, 15, story.accent, 0.04);
  if (story.claim) {
    c.roundedRect(x + width - 73, y + 4, 65, 22, 3, COLORS.red);
    drawCentered(c, 'CLAIM', x + width - 40.5, y + 8, 14, COLORS.white, 0.03);
  }
  const headlineHeight = fitTextHeight(story.headline, width - 113, 30, 0.035);
  drawText(c, story.headline, x + 101, y + 28, headlineHeight, COLORS.ink, 0.035);
  drawText(c, story.fact, x + 101, y + 63, 18, COLORS.grey, 0.025, 0.82);
  drawText(c, story.source, x + 101, y + 89, 14, story.accent, 0.025);
}
