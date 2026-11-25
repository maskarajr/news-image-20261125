import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Canvas, COLORS } from './canvas.ts';
import { ALL_DRAWN_STRINGS, DATE_ITEMS, PAGE, STATS, WIRES } from './content.ts';
import { drawCentered, drawText, textWidth } from './font.ts';
import { drawLeadTile, LEADS } from './stories.ts';
import { encodePng } from './png.ts';

const WIDTH = 1024;
const HEIGHT = 1024;
const canvas = new Canvas(WIDTH, HEIGHT, 2, COLORS.paper);

function sectionBar(text: string, x: number, y: number, width: number, color = COLORS.ink): void {
  canvas.rect(x, y, width, 31, color);
  drawText(canvas, text, x + 11, y + 7, 18, COLORS.white, 0.04);
}

function masthead(): void {
  canvas.rect(0, 0, WIDTH, 24, COLORS.ink);
  drawText(canvas, PAGE.edition, 24, 6, 12, COLORS.white, 0.04);
  drawText(canvas, PAGE.audit, 1000 - textWidth(PAGE.audit, 12, 0.04), 6, 12, COLORS.white, 0.04);
  drawCentered(canvas, PAGE.masthead, WIDTH / 2, 31, 60, COLORS.ink, 0.06);
  canvas.rect(24, 96, 976, 3, COLORS.ink);
  canvas.rect(24, 104, 976, 34, COLORS.red);
  drawCentered(canvas, PAGE.date, WIDTH / 2, 110, 22, COLORS.white, 0.05);
}

function statStrip(): void {
  const x = 24, y = 146, width = 976, cellWidth = width / STATS.length;
  canvas.rect(x, y, width, 70, COLORS.ink);
  STATS.forEach(([value, label], index) => {
    const left = x + index * cellWidth;
    if (index) canvas.rect(left, y + 9, 1, 52, [71, 88, 99]);
    drawCentered(canvas, value, left + cellWidth / 2, y + 8, 32, index % 2 ? COLORS.orange : COLORS.white, 0.04);
    drawCentered(canvas, label, left + cellWidth / 2, y + 48, 14, [202, 214, 209], 0.03);
  });
}

function leadDesk(): void {
  sectionBar(PAGE.leadSection, 24, 224, 976);
  const xs = [24, 518];
  const ys = [263, 382, 501, 620];
  LEADS.forEach((story, index) => drawLeadTile(canvas, story, xs[index % 2], ys[Math.floor(index / 2)], 482, 112));
}

function wireDesk(): void {
  const x = 24, y = 744, width = 584;
  sectionBar(PAGE.wireSection, x, y, width, COLORS.teal);
  WIRES.forEach((wire, index) => {
    const rowY = 782 + index * 29;
    canvas.line(x, rowY + 24, x + width, rowY + 24, 1, COLORS.line);
    canvas.rect(x, rowY, 28, 23, index % 2 ? COLORS.orange : COLORS.blue);
    drawCentered(canvas, wire.number, x + 14, rowY + 4, 15, COLORS.white, 0.02);
    drawText(canvas, wire.line, x + 37, rowY + 3, 15, COLORS.ink, 0.025);
  });
}

function dateCheck(): void {
  const x = 620, y = 744, width = 380, height = 271;
  canvas.rect(x, y, width, height, COLORS.ink);
  canvas.rect(x + 2, y + 2, width - 4, height - 4, COLORS.white);
  canvas.rect(x + 2, y + 2, width - 4, 29, COLORS.red);
  drawText(canvas, PAGE.dateCheck, x + 12, y + 7, 18, COLORS.white, 0.04);
  drawText(canvas, PAGE.dateStatement, x + 12, y + 39, 15, COLORS.ink, 0.025);
  DATE_ITEMS.forEach((item, index) => {
    const rowY = y + 66 + index * 38;
    canvas.rect(x + 12, rowY + 4, 6, 6, index % 2 ? COLORS.orange : COLORS.red);
    drawText(canvas, item.event, x + 25, rowY, 15, COLORS.ink, 0.02, 0.95);
    drawText(canvas, item.source, x + 25, rowY + 18, 15, COLORS.grey, 0.02, 0.95);
  });
  drawText(canvas, PAGE.dateFooter, x + 12, y + 252, 15, COLORS.red, 0.02);
}

function footer(): void {
  canvas.rect(24, 1019, 976, 5, COLORS.orange);
}

// Keep the text registry linked into the executable so audit coverage cannot
// silently drift from the page content.
if (ALL_DRAWN_STRINGS.length === 0) throw new Error('Text registry is empty');

masthead();
statStrip();
leadDesk();
wireDesk();
dateCheck();
footer();

const outputDirectory = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputDirectory, { recursive: true });
const outputPath = join(outputDirectory, 'entry.png');
const png = encodePng(WIDTH, HEIGHT, canvas.downsample());
writeFileSync(outputPath, png);
console.log(`Wrote ${outputPath} (${png.length} bytes)`);
