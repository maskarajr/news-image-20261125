import { Canvas, COLORS, type Color } from './canvas.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, drawCentered, drawText, textWidth, wrapText } from './font.ts';
import { MARKET_CLOSES, PAGE, TARIFF_RATES, type Badge, type HeroStory, type MidStory, type Region } from './content.ts';

export const REGION_COLORS: Record<Region, Color> = {
  Asia: [151, 83, 23], Europe: [51, 81, 107], Africa: [67, 104, 64], Americas: [99, 72, 115],
  'Middle East': [166, 54, 48], Oceania: [34, 103, 105], World: [145, 68, 94],
};
export const BADGE_COLORS: Record<Badge, Color> = {
  OFFICIAL: [51, 81, 107], CONFIRMED: [36, 101, 98], REPORTED: [147, 80, 24], CLAIM: [166, 52, 47],
};

const INK = COLORS.ink, PAPER = COLORS.white;
const NIGHT: Color = [33, 52, 62], RULE: Color = [183, 176, 158], LIGHT_TEXT: Color = [222, 218, 202];
const AMBER: Color = [236, 180, 93], FOIL: Color = [201, 217, 206], CORAL: Color = [246, 151, 119];
const SLATE: Color = [55, 82, 95], OCHRE: Color = [176, 108, 45], TEAL: Color = [47, 108, 111];
const CLAY: Color = [163, 74, 52], SMOKE: Color = [76, 81, 77];

export interface Box { x: number; y: number; w: number; h: number }

function cardFrame(c: Canvas, box: Box, story: HeroStory | MidStory, dark: boolean): void {
  const { x, y, w, h } = box;
  c.rect(x, y, w, h, RULE);
  c.rect(x + 1, y + 1, w - 2, h - 2, dark ? NIGHT : PAPER);

  const hero = story.number <= 3, radius = hero ? 9 : 7.5, cy = y + (hero ? 13 : 11);
  const cx = x + radius + 6, numSize = hero ? 12.5 : 10.5;
  c.circle(cx, cy, radius, dark ? AMBER : REGION_COLORS[story.region]);
  drawCentered(c, HALDEN_BOLD, String(story.number), cx, cy - numSize * .59, numSize, dark ? INK : PAPER);
  drawText(c, HALDEN_BOLD, `${story.region} · ${story.place}`, cx + radius + 5, cy - (hero ? 7 : 5.9),
    hero ? 11.5 : 10, dark ? PAPER : REGION_COLORS[story.region]);
}

function badge(c: Canvas, name: Badge, right: number, top: number, size: number): void {
  const width = textWidth(HALDEN_BOLD, name, size) + 9, height = size + 4;
  c.rect(right - width, top, width, height, BADGE_COLORS[name]);
  drawCentered(c, HALDEN_BOLD, name, right - width / 2, top + height / 2 - size * .59, size, PAPER);
}

function twoLineDeck(c: Canvas, text: string, x: number, y: number, w: number, size: number, step: number, color: Color): void {
  const lines = wrapText(HALDEN, text, size, w);
  if (lines.length > 2) throw new Error(`Deck needs ${lines.length} lines: ${text}`);
  lines.forEach((line, i) => drawText(c, HALDEN, line, x, y + i * step, size, color));
}

// A skewed station silhouette, with the schematic and docking record on the same plate.
function station(c: Canvas, x: number, y: number, w: number, h: number): void {
  c.rect(x, y, w, h, INK);
  const split = Math.round(w * .52), divider = x + split;
  c.rect(divider, y + 6, 1, h - 12, SLATE);
  c.polygon([[x, y + h - 8], [x + 17, y + h - 12], [x + 48, y + h - 13],
    [x + 78, y + h - 10], [x + 99, y + h - 4], [x + 110, y + h], [x, y + h]], TEAL);
  for (const [dx, dy] of [[11, 13], [38, 7], [131, 11], [148, 37], [32, 37], [121, 47]]) c.circle(x + dx, y + dy, 1, FOIL);

  const originX = x + split / 2, originY = y + h * .49;
  const point = (u: number, v: number): [number, number] => [originX + .97 * u + .23 * v, originY - .23 * u + .97 * v];
  const plate = (u: number, v: number, width: number, height: number, fill: Color) =>
    c.polygon([point(u, v), point(u + width, v), point(u + width, v + height), point(u, v + height)], fill);
  plate(-62, -1.5, 124, 3, FOIL);
  for (const u of [-64, 23]) for (const v of [-11, 2]) {
    plate(u, v, 41, 9, AMBER);
    for (let i = 1; i < 5; i++) plate(u + i * 8, v, 1.3, 9, OCHRE);
    plate(u, v + 4, 41, 1, OCHRE);
  }
  plate(-5, -18, 10, 37, FOIL);
  plate(-14, -5, 32, 10, PAPER);
  plate(-17, -3, 3, 6, AMBER);
  plate(-4, 14, 8, 3, SLATE);
  c.circle(...point(1, 0), 3.5, SLATE);

  drawText(c, HALDEN_BOLD, 'TIANGONG', divider + 10, y + 4, 10.5, AMBER, .4);
  drawText(c, MERIDIAN_BOLD, '03:56 UTC', divider + 9, y + 15, 20, PAPER);
  drawText(c, HALDEN_BOLD, 'FIRST FOREIGNER', divider + 10, y + 40, 10, FOIL, .2);
}

function market(c: Canvas, x: number, y: number, w: number, h: number): void {
  c.rect(x, y, w, h, INK);
  const column = w / MARKET_CLOSES.length;
  for (const [i, { name, loss }] of MARKET_CLOSES.entries()) {
    const left = x + i * column, center = left + column / 2;
    if (i > 0) c.rect(left, y + 5, 1, h - 10, SLATE);
    drawCentered(c, HALDEN_BOLD, name, center, y + 2, 10.7, FOIL);
    drawCentered(c, HALDEN_BOLD, `−${loss.toFixed(2)}%`, center, y + 15, 13.4, i === 0 ? AMBER : CORAL);
    c.rect(left + 8, y + 33, column - 16, 1, SLATE);
    c.rect(center - 7, y + 34, 14, loss * 1.62, i === 0 ? AMBER : CORAL);
  }
}

function tariffs(c: Canvas, x: number, y: number, w: number, h: number): void {
  c.rect(x, y, w, h, [234, 227, 207]);
  const column = w / TARIFF_RATES.length;
  drawText(c, HALDEN_BOLD, '14 ECONOMIES', x + 9, y + 2, 10, INK, .25);
  const key = 'PROPOSED US RATES';
  drawText(c, HALDEN_BOLD, key, x + w - 9 - textWidth(HALDEN_BOLD, key, 9), y + 3, 9, SMOKE);
  for (const [i, { name, rate }] of TARIFF_RATES.entries()) {
    const center = x + (i + .5) * column, height = rate * .65, bottom = y + h - 16;
    c.rect(center - 15, bottom - height, 30, height, i === 3 ? CLAY : TEAL);
    c.rect(center - column / 2 + 4, bottom, column - 8, 1, RULE);
    drawCentered(c, HALDEN_BOLD, `${name} ${rate}%`, center, bottom + 2, 10.6, INK);
  }
}

const HERO_PLATES = { station, market, tariffs };

export function drawHeroCard(c: Canvas, story: HeroStory, box: Box): void {
  const { x, y, w, h } = box, dark = story.number <= 2, left = x + 10;
  const fg = dark ? PAPER : INK, secondary = dark ? LIGHT_TEXT : SMOKE;
  cardFrame(c, box, story, dark);
  badge(c, story.badge, x + w - 7, y + 6, 9);
  HERO_PLATES[story.scene](c, x + 1, y + 26, w - 2, 55);
  story.headline.forEach((line, i) => drawText(c, MERIDIAN_BOLD, line, left, y + 79 + i * 27, 27, fg));
  twoLineDeck(c, story.deck, left, y + 138, w - 20, 12.6, 14, secondary);
  c.rect(left, y + 171, w - 20, 1, dark ? SLATE : RULE);
  drawText(c, HALDEN_BOLD, PAGE.why, left, y + 174, 9, dark ? AMBER : CLAY, .45);
  drawText(c, HALDEN_BOLD, story.takeaway, left, y + 187, 12, fg);
  drawText(c, HALDEN, story.source, left, y + h - 15, 10.5, secondary);
}

// Each secondary plate pairs a small editorial drawing with its own, separately typeset datum.
function energy(c: Canvas, x: number, y: number): void {
  c.polygon([[x, y + 18], [x + 21, y + 3], [x + 42, y + 18]], SLATE);
  c.rect(x + 5, y + 18, 32, 12, PAPER);
  c.rect(x + 10, y + 21, 8, 6, AMBER);
  c.rect(x + 24, y + 20, 8, 10, SLATE);
  for (const [i, height] of [10, 14, 18, 23].entries()) c.rect(x + 42 + i * 5, y + 30 - height, 3, height, OCHRE);
}

function garments(c: Canvas, x: number, y: number): void {
  // Spool, arm, needle and the cloth feeding through a sewing machine.
  c.rect(x + 6, y + 25, 54, 5, SLATE);
  c.rect(x + 10, y + 8, 10, 18, TEAL);
  c.polygon([[x + 10, y + 8], [x + 17, y + 4], [x + 41, y + 4], [x + 44, y + 10],
    [x + 44, y + 15], [x + 35, y + 15], [x + 34, y + 10], [x + 21, y + 10], [x + 16, y + 17]], TEAL);
  c.rect(x + 38, y + 15, 1.5, 9, INK);
  c.rect(x + 32, y + 22, 25, 2.5, CLAY);
  c.circle(x + 12, y + 9, 5, SLATE);
  c.circle(x + 12, y + 9, 2, FOIL);
  c.rect(x + 28, y, 6, 4, OCHRE);
}

function fire(c: Canvas, x: number, y: number): void {
  c.rect(x + 2, y + 23, 58, 3, SLATE);
  c.rect(x + 4, y + 14, 29, 9, FOIL);
  c.ellipse(x + 5, y + 18.5, 3.5, 4.5, FOIL);
  c.rect(x + 33, y + 17, 9, 7, SLATE);
  for (const wheel of [10, 27, 37]) c.circle(x + wheel, y + 26, 3, INK);
  c.polygon([[x + 40, y + 22], [x + 37, y + 13], [x + 43, y + 16], [x + 45, y + 3],
    [x + 49, y + 9], [x + 54, y], [x + 53, y + 12], [x + 59, y + 9], [x + 56, y + 21]], CLAY);
  c.polygon([[x + 45, y + 22], [x + 48, y + 13], [x + 51, y + 17], [x + 54, y + 10], [x + 53, y + 22]], AMBER);
}

function mine(c: Canvas, x: number, y: number): void {
  c.polygon([[x, y + 10], [x + 15, y + 4], [x + 28, y + 9], [x + 34, y + 14],
    [x + 43, y + 10], [x + 61, y + 8], [x + 61, y + 32], [x, y + 32]], OCHRE);
  c.rect(x + 25, y + 8, 11, 20, INK);
  c.rect(x + 17, y + 23, 24, 6, TEAL);
  c.rect(x + 20, y + 4, 21, 3, SLATE);
  c.rect(x + 37, y + 7, 3, 9, SLATE);
  c.rect(x + 27, y + 1, 1.5, 20, PAPER);
  c.rect(x + 9, y + 18, 8, 2, AMBER);
  c.rect(x + 47, y + 23, 10, 2, AMBER);
}

function treaty(c: Canvas, x: number, y: number): void {
  c.polygon([[x + 4, y + 3], [x + 28, y + 3], [x + 33, y + 7], [x + 33, y + 30], [x + 4, y + 26]], PAPER);
  c.polygon([[x + 33, y + 7], [x + 37, y + 3], [x + 60, y + 3], [x + 60, y + 26], [x + 33, y + 30]], [222, 218, 196]);
  for (let i = 0; i < 3; i++) {
    c.rect(x + 9, y + 9 + i * 4, 16 - i * 2, 1.5, SLATE);
    c.rect(x + 40, y + 9 + i * 4, 14, 1.5, TEAL);
  }
  c.circle(x + 49, y + 22, 4, CLAY);
}

function rescue(c: Canvas, x: number, y: number): void {
  c.rect(x + 5, y + 12, 52, 18, PAPER);
  c.polygon([[x + 7, y + 4], [x + 55, y + 4], [x + 60, y + 13], [x + 2, y + 13]], CLAY);
  for (let i = 0; i < 4; i++) c.rect(x + 10 + i * 11, y + 5, 4, 7, AMBER);
  c.rect(x + 11, y + 17, 15, 8, TEAL);
  c.rect(x + 32, y + 16, 17, 14, SLATE);
  c.polygon([[x + 49, y + 16], [x + 55, y + 19], [x + 55, y + 32], [x + 49, y + 30]], OCHRE);
}

function court(c: Canvas, x: number, y: number): void {
  c.rect(x + 10, y + 27, 43, 3, SLATE);
  c.rect(x + 29, y + 5, 3, 23, SLATE);
  c.circle(x + 30.5, y + 4, 2.5, OCHRE);
  c.rect(x + 10, y + 7, 40, 2, SLATE);
  for (const dx of [13, 47]) {
    c.line(x + dx, y + 9, x + dx - 6, y + 19, 1, SLATE);
    c.line(x + dx, y + 9, x + dx + 6, y + 19, 1, SLATE);
    c.polygon([[x + dx - 8, y + 18], [x + dx + 8, y + 18], [x + dx + 4, y + 23], [x + dx - 4, y + 23]], OCHRE);
  }
}

function tankers(c: Canvas, x: number, y: number): void {
  for (const [dx, dy] of [[2, 3], [22, 16]]) {
    c.rect(x + dx + 7, y + dy + 1, 7, 6, PAPER);
    c.rect(x + dx + 16, y + dy + 4, 16, 3, CLAY);
    c.polygon([[x + dx, y + dy + 7], [x + dx + 38, y + dy + 7], [x + dx + 31, y + dy + 13], [x + dx + 5, y + dy + 13]], SLATE);
  }
  c.rect(x + 2, y + 19, 13, 1.5, TEAL);
  c.rect(x + 8, y + 26, 10, 1.5, TEAL);
}

function clinic(c: Canvas, x: number, y: number): void {
  c.rect(x + 5, y + 10, 48, 19, PAPER);
  c.rect(x + 18, y + 5, 23, 24, PAPER);
  c.rect(x + 28, y + 8, 4, 11, CLAY);
  c.rect(x + 24, y + 11.5, 12, 4, CLAY);
  c.rect(x + 24, y + 21, 11, 8, SLATE);
  for (const dx of [9, 44]) c.rect(x + dx, y + 16, 5, 6, TEAL);
  c.rect(x + 2, y + 29, 55, 2, SLATE);
}

function asteroid(c: Canvas, x: number, y: number): void {
  c.polygon([[x + 10, y + 17], [x + 17, y + 6], [x + 30, y + 3], [x + 45, y + 8],
    [x + 50, y + 18], [x + 41, y + 28], [x + 29, y + 30], [x + 13, y + 26]], FOIL);
  c.polygon([[x + 10, y + 17], [x + 17, y + 6], [x + 30, y + 3], [x + 32, y + 12], [x + 21, y + 19]], SMOKE);
  c.ellipse(x + 22, y + 12, 6, 3, SLATE);
  c.circle(x + 36, y + 22, 3, [162, 167, 151]);
  for (const [dx, dy] of [[2, 5], [53, 25], [47, 4], [8, 29]]) c.circle(x + dx, y + dy, 1.3, AMBER);
}

const MID_PLATES: Record<MidStory['scene'], { color: Color; draw: typeof energy }> = {
  energy: { color: [214, 193, 147], draw: energy }, garments: { color: [195, 211, 195], draw: garments },
  fire: { color: [217, 181, 148], draw: fire }, mine: { color: [211, 201, 167], draw: mine },
  treaty: { color: [152, 183, 177], draw: treaty }, rescue: { color: [213, 191, 151], draw: rescue },
  court: { color: [213, 202, 168], draw: court }, tankers: { color: [168, 196, 190], draw: tankers },
  clinic: { color: [182, 197, 171], draw: clinic }, asteroid: { color: SLATE, draw: asteroid },
};

export function drawMidCard(c: Canvas, story: MidStory, box: Box): void {
  const { x, y, w, h } = box, dark = story.number % 2 === 0, left = x + 7;
  const fg = dark ? PAPER : INK, secondary = dark ? LIGHT_TEXT : SMOKE;
  cardFrame(c, box, story, dark);
  const plate = MID_PLATES[story.scene];
  const plateY = y + 21, plateText = story.scene === 'asteroid' ? PAPER : INK;
  c.rect(x + 1, plateY, w - 2, 37, plate.color);
  plate.draw(c, x + 5, plateY + 2);
  drawText(c, HALDEN_BOLD, story.figure, x + 76, plateY - 1, 19, plateText);
  drawText(c, HALDEN_BOLD, story.caption, x + 77, plateY + 21, 9.6, plateText, .15);
  story.headline.forEach((line, i) => drawText(c, MERIDIAN_BOLD, line, left, y + 59 + i * 18.5, 18, fg));
  twoLineDeck(c, story.deck, left, y + 100, w - 14, 11.8, 12.7, secondary);
  drawText(c, HALDEN, story.source, left, y + h - 14, 10.5, secondary);
  badge(c, story.badge, x + w - 5, y + h - 15, 8.6);
}
