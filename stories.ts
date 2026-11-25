import { Canvas, COLORS, type Color } from './canvas.ts';
import { drawCentered, drawText, drawWrapped } from './font.ts';

type IconName = 'pact' | 'port' | 'drone' | 'court' | 'gaza' | 'ballot';

export interface Story {
  number: string;
  tag: string;
  headline: string;
  detail: string;
  source: string;
  accent: Color;
  icon: IconName;
}

export const STORIES: readonly Story[] = [
  {
    number: '02', tag: 'PACIFIC / DIPLOMACY', icon: 'pact', accent: COLORS.teal,
    headline: 'AUSTRALIA, SOLOMONS SIGN SECURITY PACT',
    detail: 'ALBANESE AND WALE SIGNED IN CANBERRA. AUSTRALIA BECOMES THE PRIMARY SECURITY PARTNER.',
    source: 'AAP / AFR',
  },
  {
    number: '03', tag: 'MIDDLE EAST / RED SEA', icon: 'port', accent: COLORS.red,
    headline: 'HOUTHIS WARN SAUDI RED SEA PORTS',
    detail: 'WARNING FOLLOWED A RIYADH DRONE STRIKE THAT WOUNDED 11; COALITION STRUCK HODEIDAH AND SAADA.',
    source: 'REUTERS / AP',
  },
  {
    number: '04', tag: 'EUROPE / SECURITY', icon: 'drone', accent: COLORS.blue,
    headline: 'ODESA, KYIV HIT; POLAND PROTESTS DRONE',
    detail: 'ODESA: 2 KILLED, 3 WOUNDED. KYIV FIRE INJURED 2; WARSAW SUMMONED MOSCOW\'S AMBASSADOR.',
    source: 'REUTERS',
  },
  {
    number: '05', tag: 'UNITED STATES / COURTS + TECH', icon: 'court', accent: COLORS.orange,
    headline: 'HUAWEI CONVICTED ON 10 OF 12 COUNTS',
    detail: 'BROOKLYN JURY FOUND FRAUD, IRAN SANCTIONS AND TRADE-SECRET CONSPIRACIES. HUAWEI WILL APPEAL.',
    source: 'REUTERS / BBC',
  },
  {
    number: '06', tag: 'GAZA / CONFLICT', icon: 'gaza', accent: COLORS.red,
    headline: 'GAZA STRIKES KILL 7, INCLUDING SECURITY CHIEF',
    detail: 'SEVEN PALESTINIANS KILLED, INCLUDING NAEEM ABU NAHEL AND TWO POLICE OFFICERS.',
    source: 'REUTERS / AFP',
  },
  {
    number: '07', tag: 'AMERICAS / POLITICS + SECURITY', icon: 'ballot', accent: COLORS.teal,
    headline: 'DEMOCRATS HIT 259; CARTAGENA HOSTAGE SIEGE',
    detail: 'TENNESSEE FLIP SETS BIGGEST HOUSE MAJORITY SINCE 1990. ABOUT 30 HOSTAGES; 10 FREED.',
    source: 'AP / AFP',
  },
];

function iconPact(c: Canvas, x: number, y: number, color: Color): void {
  c.circle(x - 11, y, 10, color); c.circle(x + 11, y, 10, color);
  c.rect(x - 11, y - 4, 22, 8, color);
  c.line(x - 24, y - 13, x - 10, y, 5, color);
  c.line(x + 24, y - 13, x + 10, y, 5, color);
}

function iconPort(c: Canvas, x: number, y: number, color: Color): void {
  c.polygon([[x - 27, y + 7], [x + 28, y + 7], [x + 18, y + 20], [x - 17, y + 20]], color);
  c.rect(x - 7, y - 14, 15, 21, color);
  c.line(x - 24, y + 27, x + 24, y + 27, 3, color);
  c.line(x - 15, y + 33, x + 15, y + 33, 2, color);
}

function iconDrone(c: Canvas, x: number, y: number, color: Color): void {
  c.polygon([[x - 29, y], [x - 7, y - 5], [x, y - 18], [x + 7, y - 5], [x + 29, y], [x + 7, y + 5], [x, y + 16], [x - 7, y + 5]], color);
  c.line(x - 31, y - 11, x - 16, y - 11, 2, color);
  c.line(x + 16, y - 11, x + 31, y - 11, 2, color);
}

function iconCourt(c: Canvas, x: number, y: number, color: Color): void {
  c.polygon([[x - 30, y - 10], [x, y - 27], [x + 30, y - 10]], color);
  c.rect(x - 29, y - 7, 58, 5, color);
  for (const dx of [-21, -7, 7, 21]) c.rect(x + dx - 3, y - 1, 6, 24, color);
  c.rect(x - 33, y + 24, 66, 6, color);
}

function iconGaza(c: Canvas, x: number, y: number, color: Color): void {
  c.polygon([[x, y - 30], [x + 17, y - 7], [x + 10, y - 10], [x + 21, y + 23], [x, y + 31], [x - 21, y + 23], [x - 10, y - 8]], color);
  c.polygon([[x, y - 12], [x + 8, y + 2], [x + 4, y + 18], [x - 7, y + 17], [x - 10, y + 4]], COLORS.paper);
}

function iconBallot(c: Canvas, x: number, y: number, color: Color): void {
  c.rect(x - 24, y - 5, 48, 34, color);
  c.rect(x - 14, y - 27, 34, 28, COLORS.white);
  c.line(x - 7, y - 14, x - 1, y - 7, 4, color);
  c.line(x - 1, y - 7, x + 10, y - 20, 4, color);
  c.rect(x - 12, y + 6, 24, 4, COLORS.paper);
}

function drawIcon(c: Canvas, name: IconName, x: number, y: number, color: Color): void {
  if (name === 'pact') iconPact(c, x, y, color);
  else if (name === 'port') iconPort(c, x, y, color);
  else if (name === 'drone') iconDrone(c, x, y, color);
  else if (name === 'court') iconCourt(c, x, y, color);
  else if (name === 'gaza') iconGaza(c, x, y, color);
  else iconBallot(c, x, y, color);
}

export function drawStoryCard(c: Canvas, story: Story, x: number, y: number, width: number, height: number, alternate: boolean): void {
  c.rect(x, y, width, height, COLORS.ink);
  c.rect(x + 2, y + 2, width - 4, height - 4, alternate ? [250, 247, 238] : COLORS.white);
  c.rect(x, y, 7, height, story.accent);
  c.circle(x + 38, y + 38, 24, story.accent);
  drawCentered(c, story.number, x + 38, y + 30, 2.2, COLORS.white, 0.7);

  drawText(c, story.tag, x + 76, y + 13, 1.45, story.accent, 0.8);
  drawWrapped(c, story.headline, x + 76, y + 35, width - 146, 2.45, COLORS.ink, 1, 2);
  c.line(x + 76, y + 89, x + width - 18, y + 89, 1, COLORS.line);
  drawWrapped(c, story.detail, x + 76, y + 99, width - 96, 1.4, COLORS.grey, 1.2, 3);
  drawText(c, `SOURCE: ${story.source}`, x + 76, y + height - 17, 1.15, story.accent, 0.8);
  drawIcon(c, story.icon, x + width - 44, y + 45, story.accent);
}
