import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Canvas, COLORS, type Color } from './canvas.ts';
import { ALL_DRAWN_STRINGS, DATE_ITEMS, KICKERS, PAGE, STATS, WIRES } from './content.ts';
import { drawCentered, drawText, textWidth } from './font.ts';
import { drawLocator } from './map.ts';
import { drawLead, LEADS } from './stories.ts';
import { encodePng } from './png.ts';

const WIDTH = 1024, HEIGHT = 1024;
const canvas = new Canvas(WIDTH, HEIGHT, 2, COLORS.paper);

function widthScale(text: string, height: number, maxWidth: number, preferred = 0.76, tracking = 0.02): number {
  const natural = textWidth(text, height, tracking, preferred);
  return natural <= maxWidth ? preferred : preferred * maxWidth / natural;
}

function fitted(text: string, x: number, y: number, width: number, height: number, color: Color, preferred = 0.76, tracking = 0.02): void {
  drawText(canvas, text, x, y, height, color, tracking, widthScale(text, height, width, preferred, tracking));
}

function masthead(): void {
  canvas.rect(0, 0, WIDTH, 25, COLORS.ink);
  drawText(canvas, PAGE.name, 24, 5, 16, COLORS.white, 0.02, 0.72);
  drawText(canvas, PAGE.edition, 1000 - textWidth(PAGE.edition, 16, 0.02, 0.72), 5, 16, COLORS.white, 0.02, 0.72);

  const dateScale = widthScale(PAGE.date, 56, 930, 0.78, 0.025);
  drawCentered(canvas, PAGE.date, WIDTH / 2, 32, 56, COLORS.ink, 0.025, dateScale);
  canvas.rect(24, 92, 976, 3, COLORS.red);
  canvas.rect(24, 100, 976, 23, COLORS.ink);
  fitted(PAGE.audit, 33, 105, 958, 14, COLORS.white, 0.72, 0.012);
}

function kicker(): void {
  const x = 24, y = 130, width = 976, cell = width / 3;
  KICKERS.forEach((headline, index) => {
    const left = x + index * cell;
    canvas.rect(left, y, cell - 7, 41, COLORS.white);
    canvas.rect(left, y, cell - 7, 3, index === 1 ? COLORS.teal : COLORS.red);
    drawCentered(canvas, headline, left + (cell - 7) / 2, y + 9, 26, COLORS.ink, 0.02, widthScale(headline, 26, cell - 25, 0.76, 0.02));
  });
}

function statStrip(): void {
  const x = 24, y = 178, width = 976, cell = width / STATS.length;
  canvas.rect(x, y, width, 59, COLORS.ink);
  STATS.forEach(([value, label], index) => {
    const left = x + index * cell;
    if (index) canvas.rect(left, y + 8, 1, 43, [71, 88, 99]);
    drawCentered(canvas, value, left + cell / 2, y + 5, 28, index % 2 ? COLORS.orange : COLORS.white, 0.02, 0.72);
    drawCentered(canvas, label, left + cell / 2, y + 38, 14, [202, 214, 209], 0.01, widthScale(label, 14, cell - 8, 0.70, 0.01));
  });
}

function leadDesk(): void {
  canvas.rect(24, 244, 976, 23, COLORS.teal);
  drawText(canvas, PAGE.leadSection, 33, 249, 14, COLORS.white, 0.02, 0.74);
  const xs = [24, 354, 684], ys = [273, 374, 475, 576];
  for (const x of [346, 676]) canvas.rect(x, 273, 1, 397, COLORS.line);
  LEADS.forEach((story, index) => drawLead(canvas, story, xs[index % 3], ys[Math.floor(index / 3)], 316, 94));
}

function wireDesk(): void {
  const x = 24, y = 678, width = 660;
  canvas.rect(x, y, width, 23, COLORS.teal);
  drawText(canvas, PAGE.wireSection, x + 9, y + 5, 14, COLORS.white, 0.02, 0.74);
  WIRES.forEach((wire, index) => {
    const rowY = 704 + index * 19;
    canvas.line(x, rowY + 16, x + width, rowY + 16, 1, COLORS.line);
    canvas.rect(x, rowY - 1, 27, 18, index % 2 ? COLORS.orange : COLORS.blue);
    drawCentered(canvas, wire.number, x + 13.5, rowY + 1, 14, COLORS.white, 0.01, 0.65);
    fitted(wire.line, x + 35, rowY, width - 42, 14, COLORS.ink, 0.72, 0.01);
  });
}

function dateCheck(): void {
  const x = 24, y = 840, width = 660, height = 175;
  canvas.rect(x, y, width, height, COLORS.ink);
  canvas.rect(x + 2, y + 2, width - 4, height - 4, COLORS.white);
  canvas.rect(x + 2, y + 2, width - 4, 21, COLORS.red);
  fitted(PAGE.dateSection, x + 10, y + 5, width - 20, 14, COLORS.white, 0.72, 0.01);
  DATE_ITEMS.forEach((item, index) => {
    const col = index < 5 ? 0 : 1;
    const row = col === 0 ? index : index - 5;
    const left = x + 11 + col * 324;
    const rowY = y + 25 + row * 30;
    canvas.rect(left, rowY + 3, 5, 5, index % 2 ? COLORS.orange : COLORS.red);
    fitted(item.event, left + 11, rowY, 302, 14, COLORS.ink, 0.69, 0.005);
    fitted(item.source, left + 11, rowY + 15, 302, 14, COLORS.grey, 0.69, 0.005);
  });
}

if (!ALL_DRAWN_STRINGS.length) throw new Error('Text registry is empty');

masthead();
kicker();
statStrip();
leadDesk();
wireDesk();
drawLocator(canvas, 696, 678, 304);
dateCheck();
canvas.rect(24, 1019, 976, 5, COLORS.orange);

const outputDirectory = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputDirectory, { recursive: true });
const outputPath = join(outputDirectory, 'entry.png');
const png = encodePng(WIDTH, HEIGHT, canvas.downsample());
writeFileSync(outputPath, png);
console.log(`Wrote ${outputPath} (${png.length} bytes)`);
