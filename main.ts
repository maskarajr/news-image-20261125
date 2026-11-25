import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Canvas, COLORS } from './canvas.ts';
import { drawCentered, drawText, textWidth } from './font.ts';
import { drawLocatorMap, drawRegionKey } from './map.ts';
import { drawLeadItem, drawWireItem, STORIES } from './stories.ts';
import { encodePng } from './png.ts';

const WIDTH = 1024;
const HEIGHT = 1024;
const canvas = new Canvas(WIDTH, HEIGHT, 2, COLORS.paper);

function sectionBar(label: string, x: number, y: number, width: number, color = COLORS.ink): void {
  canvas.rect(x, y, width, 22, color);
  drawText(canvas, label, x + 10, y + 6, 1.15, COLORS.white, 0.65);
}

function masthead(): void {
  canvas.rect(0, 0, WIDTH, 18, COLORS.ink);
  drawText(canvas, 'GLOBAL DAILY / ONE-DAY EDITION', 24, 5, 1.0, COLORS.white, 0.6);
  const audit = '16 STORIES / 6 REGIONS / ALL DATED, ALL SOURCED';
  drawText(canvas, audit, 1000 - textWidth(audit, 1.0, 0.6), 5, 1.0, COLORS.white, 0.6);

  drawCentered(canvas, 'THE WORLD TODAY', WIDTH / 2, 26, 6.7, COLORS.ink, 0.85);
  canvas.rect(24, 76, 976, 3, COLORS.ink);
  canvas.rect(24, 83, 976, 29, COLORS.red);
  drawCentered(canvas, 'WEDNESDAY, 25 NOVEMBER 2026', WIDTH / 2, 89, 2.45, COLORS.white, 0.7);
}

function statStrip(): void {
  const stats: readonly [string, string][] = [
    ['-6.16%', 'KOSPI'], ['4.9%', 'AUSTRALIA CPI'], ['+36%', 'GARMENT WAGE'],
    ['7', 'DRONES STOPPED'], ['~30', 'HOSTAGES SAFE'], ['03:56', 'UTC DOCKING'],
  ];
  const x = 24, y = 118, width = 976, cellWidth = width / stats.length;
  canvas.rect(x, y, width, 48, COLORS.ink);
  stats.forEach(([value, label], index) => {
    const cellX = x + index * cellWidth;
    if (index > 0) canvas.rect(cellX, y + 6, 1, 36, [73, 89, 99]);
    drawCentered(canvas, value, cellX + cellWidth / 2, y + 7, 2.0, index % 2 ? COLORS.orange : COLORS.white, 0.65);
    drawCentered(canvas, label, cellX + cellWidth / 2, y + 31, 0.85, [190, 204, 200], 0.55);
  });
}

function leadColumns(): void {
  sectionBar('TODAY / 12 ILLUSTRATED LEAD REPORTS', 24, 174, 976);
  const xs = [24, 354, 684];
  const ys = [201, 323, 445, 567];
  for (const divider of [344, 674]) canvas.rect(divider, 201, 1, 482, COLORS.line);
  STORIES.slice(0, 12).forEach((story, index) => {
    drawLeadItem(canvas, story, xs[index % 3], ys[Math.floor(index / 3)], 316, 116);
  });
}

function wireDesk(): void {
  sectionBar('ALSO ON 25 NOVEMBER / WIRE DESK', 24, 692, 620, COLORS.teal);
  STORIES.slice(12).forEach((story, index) => drawWireItem(canvas, story, 24, 718 + index * 37, 620));
}

function dateCheck(): void {
  const x = 24, y = 872, width = 620, height = 143;
  canvas.rect(x, y, width, height, COLORS.ink);
  canvas.rect(x + 2, y + 2, width - 4, height - 4, COLORS.white);
  canvas.rect(x + 2, y + 2, 132, 25, COLORS.red);
  drawText(canvas, 'DATE CHECK', x + 12, y + 8, 1.35, COLORS.white, 0.65);
  drawText(canvas, 'EVERY ITEM ABOVE HAPPENED OR WAS FIRST REPORTED ON 25 NOV.', x + 146, y + 9, 0.82, COLORS.ink, 0.5);
  const earlier = [
    '24 NOV / RIYADH TOWER HIT; 11 WOUNDED. REUTERS / ARAB NEWS',
    '24 NOV / HUAWEI CONVICTED; RACKETEERING ACQUITTAL. DOJ / REUTERS / AP',
    '24 NOV / REAL MADRID 5-1 PSV. UEFA / BBC SPORT',
    '24 NOV / GAZA STRIKES KILL 7, INCLUDING ABU NAHEL. BBC / AL-MONITOR / DAWN',
    '24 NOV / CAS REINSTATES SENEGAL AS 2025 AFCON CHAMPIONS. ANADOLU / BBC / CAS',
  ];
  earlier.forEach((line, index) => {
    const rowY = y + 35 + index * 18;
    canvas.rect(x + 11, rowY + 2, 5, 5, index % 2 ? COLORS.orange : COLORS.red);
    drawText(canvas, line, x + 23, rowY, 0.82, COLORS.grey, 0.5);
  });
  drawText(canvas, 'TUESDAY ITEMS / CONTEXT ONLY / NOT WEDNESDAY LEADS', x + 23, y + 129, 0.8, COLORS.red, 0.5);
}

function locator(): void {
  sectionBar('WHERE IT HAPPENED / 16 VERIFIED LOCATIONS', 656, 692, 344, COLORS.blue);
  drawLocatorMap(canvas, 656, 720, 344, 213);
  drawRegionKey(canvas, 661, 943);
  drawText(canvas, 'PINS 01-16 FOLLOW STORY NUMBERS', 661, 998, 0.82, COLORS.grey, 0.55);
}

function footer(): void {
  canvas.rect(24, 1019, 976, 5, COLORS.orange);
}

masthead();
statStrip();
leadColumns();
wireDesk();
dateCheck();
locator();
footer();

const outputDirectory = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputDirectory, { recursive: true });
const outputPath = join(outputDirectory, 'entry.png');
const png = encodePng(WIDTH, HEIGHT, canvas.downsample());
writeFileSync(outputPath, png);
console.log(`Wrote ${outputPath} (${png.length} bytes)`);
