import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Canvas, COLORS, type Color } from './canvas.ts';
import { BADGE_LEGEND, BRIEFS, DATE_PARAGRAPH, EDITION, HEROES, KPIS, LEADS, PAGE, REGION_COUNTS, SECONDARY, TIMELINE } from './content.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, drawCentered, drawText, fitSize, textWidth, wrapText } from './font.ts';
import { drawLocator } from './map.ts';
import { BADGE_COLORS, REGION_COLORS, drawHeroCard, drawMidCard, type Box } from './stories.ts';
import { encodePng } from './png.ts';

const SIZE = 1024, MARGIN = 24, WIDTH = SIZE - 2 * MARGIN;
const INK = COLORS.ink, PAPER = COLORS.white, LINE = COLORS.line;
const AMBER: Color = [225, 166, 81], MUTED: Color = [72, 81, 79], STONE: Color = [232, 226, 209];

export function cardBox(number: number): Box {
  const hero = number <= HEROES.length, columns = hero ? 3 : 5, gap = 6;
  const w = (WIDTH - gap * (columns - 1)) / columns, index = number - (hero ? 1 : HEROES.length + 1);
  return { x: MARGIN + (index % columns) * (w + gap), y: hero ? 191 : 419 + Math.floor(index / columns) * 152,
    w, h: hero ? 222 : 146 };
}

function masthead(c: Canvas): void {
  c.rect(0, 0, SIZE, 91, INK);
  drawText(c, HALDEN_BOLD, PAGE.runningLeft, MARGIN, 2, 11.2, AMBER, .55);
  const runningWidth = textWidth(HALDEN_BOLD, PAGE.runningRight, 10.8, .4);
  drawText(c, HALDEN_BOLD, PAGE.runningRight, SIZE - MARGIN - runningWidth, 2, 10.8, PAPER, .4);
  drawCentered(c, MERIDIAN_BOLD, PAGE.date, SIZE / 2, 9, 55, PAPER, -.35);
  drawCentered(c, HALDEN_BOLD, PAGE.deck, SIZE / 2, 71, 15.4, PAPER);
  c.rect(0, 90, SIZE, 2, AMBER);
}

function indicators(c: Canvas): void {
  const gap = 4, w = (WIDTH - gap * (KPIS.length - 1)) / KPIS.length;
  KPIS.forEach((item, i) => {
    const x = MARGIN + i * (w + gap), left = x + 7;
    c.rect(x, 95, w, 48, LINE);
    c.rect(x + 1, 96, w - 2, 46, PAPER);
    drawText(c, HALDEN_BOLD, item.label, left, 96, 10.8, MUTED);
    const size = fitSize(MERIDIAN_BOLD, item.value, 23, w - 14, 21);
    drawText(c, MERIDIAN_BOLD, item.value, left - .5, 105, size, INK);
    drawText(c, HALDEN, item.note, left, 131, 10.1, MUTED);
  });
}

function regions(c: Canvas): void {
  let cumulative = 0;
  for (const { region, count } of REGION_COUNTS) {
    const left = MARGIN + Math.round(WIDTH * cumulative / EDITION.length);
    cumulative += count;
    const right = MARGIN + Math.round(WIDTH * cumulative / EDITION.length);
    c.rect(left, 146, right - left, 17, REGION_COLORS[region]);
    drawCentered(c, HALDEN_BOLD, `${region} ${count}`, (left + right) / 2, 148, 11, PAPER);
  }
}

function timeline(c: Canvas): void {
  const keyWidth = 109, start = MARGIN + keyWidth;
  c.rect(MARGIN, 163, WIDTH, 23, STONE);
  c.rect(MARGIN, 163, keyWidth, 23, INK);
  drawCentered(c, HALDEN_BOLD, PAGE.utcLabel, MARGIN + keyWidth / 2, 168, 10.3, PAPER, .25);
  const lengths = TIMELINE.map(([time, event]) => textWidth(HALDEN_BOLD, time, 12.4) + 5 + textWidth(HALDEN, event, 12.4));
  const gap = (WIDTH - keyWidth - 20 - lengths.reduce((sum, w) => sum + w, 0)) / (lengths.length - 1);
  let x = start + 10;
  TIMELINE.forEach(([time, event], i) => {
    drawText(c, HALDEN_BOLD, time, x, 167, 12.4, INK);
    drawText(c, HALDEN, event, x + textWidth(HALDEN_BOLD, time, 12.4) + 5, 167, 12.4, INK);
    x += lengths[i] + gap;
    if (i + 1 < TIMELINE.length) c.circle(x - gap / 2, 175, 1.5, [148, 121, 85]);
  });
}

function briefs(c: Canvas): void {
  const startX = 382, gutter = 14, w = (SIZE - MARGIN - startX - gutter) / 2;
  const rows = Math.ceil(BRIEFS.length / 2), height = 19.4;
  drawText(c, MERIDIAN_BOLD, PAGE.briefs, startX, 728, 18, INK);
  BRIEFS.forEach((story, i) => {
    const x = startX + Math.floor(i / rows) * (w + gutter), y = 753 + (i % rows) * height;
    const left = x + 18, place = `${story.place} · `;
    c.circle(x + 7, y + 8, 6.9, REGION_COLORS[story.region]);
    drawCentered(c, HALDEN_BOLD, String(story.number), x + 7, y + 2, 9.8, PAPER, -.25);
    drawText(c, HALDEN_BOLD, place, left, y, 12, INK);
    drawText(c, HALDEN, story.summary, left + textWidth(HALDEN_BOLD, place, 12), y, 12, INK);
    drawText(c, HALDEN, story.source, x + w - textWidth(HALDEN, story.source, 10.3), y + 1.7, 10.3, MUTED);
    c.rect(left, y + height - 2, w - 18, .5, LINE);
  });
}

function footer(c: Canvas): void {
  const keyY = 951, size = 10.6;
  let x = MARGIN;
  drawText(c, MERIDIAN_BOLD, PAGE.badgeLegend, x, keyY - 2, 13, INK);
  x += textWidth(MERIDIAN_BOLD, PAGE.badgeLegend, 13) + 17;
  for (const { badge, label } of BADGE_LEGEND) {
    c.circle(x + 3, keyY + 6, 3, BADGE_COLORS[badge]);
    x += 10;
    drawText(c, HALDEN_BOLD, badge, x, keyY, size, BADGE_COLORS[badge]);
    x += textWidth(HALDEN_BOLD, badge, size) + 5;
    drawText(c, HALDEN, label, x, keyY, size, INK);
    x += textWidth(HALDEN, label, size) + 19;
  }
  c.rect(MARGIN, 969, WIDTH, 1, LINE);
  c.rect(MARGIN, 976, 4, 37, BADGE_COLORS.CLAIM);
  drawText(c, HALDEN_BOLD, PAGE.dateLabel, MARGIN + 11, 975, 12, BADGE_COLORS.CLAIM, .25);
  const lines = wrapText(HALDEN, DATE_PARAGRAPH, 12.2, 869);
  if (lines.length > 3) throw new Error('DATE CHECK exceeds its three-line footer');
  lines.forEach((line, i) => drawText(c, HALDEN, line, 131, 973 + i * 14, 12.2, INK));
  c.rect(MARGIN, 1019, WIDTH, 5, AMBER);
}

export function renderEdition(onText?: Canvas['onText']): Buffer {
  const c = new Canvas(SIZE, SIZE, 2, [246, 241, 229]);
  c.onText = onText;
  masthead(c);
  indicators(c);
  regions(c);
  timeline(c);
  HEROES.forEach(s => drawHeroCard(c, s, cardBox(s.number)));
  SECONDARY.forEach(s => drawMidCard(c, s, cardBox(s.number)));
  const last = cardBox(LEADS.length);
  c.rect(MARGIN, last.y + last.h + 6, WIDTH, 1, INK);
  drawLocator(c);
  briefs(c);
  footer(c);
  return encodePng(SIZE, SIZE, c.downsample());
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const png = renderEdition();
  mkdirSync(dir, { recursive: true });
  const path = join(dir, 'entry.png');
  writeFileSync(path, png);
  console.log(`Wrote ${path} (${png.length} bytes)`);
}
