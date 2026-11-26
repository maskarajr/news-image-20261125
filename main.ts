import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Canvas, COLORS, type Color } from './canvas.ts';
import { BADGE_LEGEND, BRIEFS, DATE_PARAGRAPH, LEADS, MAP_POINTS, PAGE, REGION_COUNTS } from './content.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, MIN_TEXT_SIZE, drawCentered, drawText, fitSize, textWidth, wrapText } from './font.ts';
import { MAP_WIDTH, drawLocator } from './map.ts';
import { encodePng } from './png.ts';
import { BADGE_COLORS, REGION_COLORS, drawHeroCard, drawMidCard, labelInk } from './stories.ts';

const W = 1024, H = 1024, LEFT = 24, RIGHT = W - LEFT, WIDTH = RIGHT - LEFT;
const CREAM: Color = [251,248,241], STONE: Color = [236,229,213], SLATE: Color = [54,82,105], AMBER: Color = [214,139,51];

function masthead(c: Canvas): void {
  c.rect(0, 0, W, 82, COLORS.ink);
  drawText(c, HALDEN_BOLD, PAGE.runningLeft, LEFT, -1, MIN_TEXT_SIZE, CREAM);
  drawText(c, HALDEN_BOLD, PAGE.runningRight, RIGHT - textWidth(HALDEN_BOLD, PAGE.runningRight, MIN_TEXT_SIZE), -1, MIN_TEXT_SIZE, CREAM);
  drawCentered(c, MERIDIAN_BOLD, PAGE.date, W / 2, 2.5, 49, CREAM, -.25);
  drawCentered(c, HALDEN_BOLD, PAGE.tagline, W / 2, 59.5, fitSize(HALDEN_BOLD, PAGE.tagline, 14, WIDTH, MIN_TEXT_SIZE), CREAM);
  c.rect(0, 79, W, 3, AMBER);
}

function regions(c: Canvas): void {
  let x = LEFT;
  for (const item of REGION_COUNTS) {
    const width = WIDTH * item.count / MAP_POINTS.length;
    c.rect(x, 85, width, 9, REGION_COLORS[item.region]);
    x += width;
  }
  drawCentered(c, HALDEN_BOLD, PAGE.regionSummary, W / 2, 97, fitSize(HALDEN_BOLD, PAGE.regionSummary, 13, WIDTH, MIN_TEXT_SIZE), COLORS.ink);
}

function timeline(c: Canvas): void {
  const labelWidth = 111, lineX = LEFT + labelWidth + 10;
  c.rect(LEFT, 116, WIDTH, 24, STONE);
  c.rect(LEFT, 116, labelWidth, 24, COLORS.ink);
  drawCentered(c, HALDEN_BOLD, PAGE.utcLabel, LEFT + labelWidth / 2, 120.5, 12, CREAM);
  drawText(c, HALDEN_BOLD, PAGE.utcLine, lineX, 119, fitSize(HALDEN_BOLD, PAGE.utcLine, 13.5, RIGHT - lineX - 8, MIN_TEXT_SIZE), COLORS.ink);
}

function cards(c: Canvas): void {
  const heroY = 146, heroH = 192, heroW = 316, heroGap = 14;
  LEADS.slice(0, 3).forEach((s, i) => drawHeroCard(c, s, LEFT + i * (heroW + heroGap), heroY, heroW, heroH));
  const gap = 8, w = (WIDTH - gap * 4) / 5, midY = heroY + heroH + 6;
  LEADS.slice(3, 8).forEach((s, i) => drawMidCard(c, s, LEFT + i * (w + gap), midY, w, 151));
  LEADS.slice(8).forEach((s, i) => drawMidCard(c, s, LEFT + i * (w + gap), midY + 154, w, 144, true));
  c.line(LEFT, 646, RIGHT, 646, 1, COLORS.ink);
}

function briefs(c: Canvas, x: number, y: number): void {
  const gap = 18, colW = (RIGHT - x - gap) / 2, rows = Math.ceil(BRIEFS.length / 2);
  drawText(c, MERIDIAN_BOLD, PAGE.briefs, x, y, 17, COLORS.ink);
  BRIEFS.forEach((s, i) => {
    const left = x + Math.floor(i / rows) * (colW + gap), top = y + 24 + (i % rows) * 28;
    const textX = left + 25, available = left + colW - textX;
    const accent = REGION_COLORS[s.region];
    c.circle(left + 10, top + 8.5, 10, accent);
    drawCentered(c, HALDEN_BOLD, String(s.number), left + 10, top + 8.5 - 12 * .59, 12, labelInk(accent));
    const line = `${s.place} · ${s.summary}`;
    drawText(c, HALDEN_BOLD, line, textX, top - 1, fitSize(HALDEN_BOLD, line, 13, available, MIN_TEXT_SIZE), COLORS.ink);
    drawText(c, HALDEN, s.source, textX, top + 15, fitSize(HALDEN, s.source, 11.75, available, MIN_TEXT_SIZE), SLATE);
    c.line(textX, top + 28.75, left + colW, top + 28.75, .6, [216,211,199]);
  });
}

function badgeLegend(c: Canvas): void {
  const size = 12.5, y = 961;
  let x = LEFT;
  drawText(c, HALDEN_BOLD, PAGE.badgeLegend, x, y, size, COLORS.ink);
  x += textWidth(HALDEN_BOLD, PAGE.badgeLegend, size) + 14;
  for (const item of BADGE_LEGEND) {
    c.circle(x + 3.5, y + 7.5, 3.5, BADGE_COLORS[item.badge]);
    x += 12;
    drawText(c, HALDEN_BOLD, item.badge, x, y, size, COLORS.ink);
    x += textWidth(HALDEN_BOLD, item.badge, size) + 6;
    drawText(c, HALDEN, item.label, x, y, size, COLORS.ink);
    x += textWidth(HALDEN, item.label, size) + 20;
  }
  c.line(LEFT, 979, RIGHT, 979, 1, [163,161,151]);
}

function dateCheck(c: Canvas): void {
  const y = 982, textX = 126, size = 13;
  c.rect(LEFT, y, 4, 34, BADGE_COLORS.CLAIM);
  drawText(c, HALDEN_BOLD, PAGE.dateLabel, LEFT + 12, y, size, BADGE_COLORS.CLAIM);
  const lines = DATE_PARAGRAPH.split('\n').flatMap(line => wrapText(HALDEN, line, size, RIGHT - textX));
  lines.forEach((line, i) => drawText(c, HALDEN, line, textX, y + i * 16, size, COLORS.ink));
}

export function drawPage(c: Canvas): void {
  masthead(c);
  regions(c);
  timeline(c);
  cards(c);
  drawLocator(c, LEFT, 652, MAP_WIDTH);
  briefs(c, 374, 652);
  badgeLegend(c);
  dateCheck(c);
  c.rect(LEFT, 1019, WIDTH, 5, AMBER);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const c = new Canvas(W, H, 2, [246,241,229]);
  drawPage(c);
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output', path = join(dir, 'entry.png');
  mkdirSync(dir, {recursive: true});
  const png = encodePng(W, H, c.downsample());
  writeFileSync(path, png);
  console.log(`Wrote ${path} (${png.length} bytes)`);
}
