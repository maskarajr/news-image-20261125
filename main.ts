import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Canvas, COLORS } from './canvas.ts';
import { drawCentered, drawText, drawWrapped, textWidth } from './font.ts';
import { drawRocket, drawWorldMap } from './map.ts';
import { drawStoryCard, STORIES } from './stories.ts';
import { encodePng } from './png.ts';

const WIDTH = 1024;
const HEIGHT = 1024;
const canvas = new Canvas(WIDTH, HEIGHT, 2, COLORS.paper);

function header(): void {
  canvas.rect(0, 0, WIDTH, 18, COLORS.ink);
  drawText(canvas, 'GLOBAL EDITION / NO. 329', 25, 5, 1.1, COLORS.white, 0.7);
  const right = 'SEVEN STORIES / ONE DAY';
  drawText(canvas, right, WIDTH - 25 - textWidth(right, 1.1, 0.7), 5, 1.1, COLORS.white, 0.7);

  drawCentered(canvas, 'THE WORLD TODAY', WIDTH / 2, 29, 8.2, COLORS.ink, 0.85);
  canvas.rect(24, 94, 976, 3, COLORS.ink);
  canvas.rect(24, 101, 976, 40, COLORS.red);
  drawCentered(canvas, 'WEDNESDAY, 25 NOVEMBER 2026', WIDTH / 2, 109, 3.25, COLORS.white, 0.7);
  canvas.rect(24, 145, 976, 2, COLORS.ink);
}

function hero(): void {
  canvas.rect(24, 154, 976, 292, COLORS.ink);
  canvas.rect(635, 169, 2, 262, [66, 84, 97]);
  drawWorldMap(canvas);

  drawText(canvas, '01 / CHINA / SPACE', 660, 174, 1.55, COLORS.orange, 0.8);
  drawWrapped(canvas, 'FIRST FOREIGN ASTRONAUT LIFTS OFF FOR TIANGONG', 660, 204, 310, 3.55, COLORS.white, 1, 4);
  canvas.line(660, 316, 970, 316, 1.5, COLORS.orange);
  drawText(canvas, 'SHENZHOU-24 / JIUQUAN / 00:18 UTC', 660, 329, 1.25, [210, 220, 218], 0.8);
  drawText(canvas, 'CREW: TANG HONGBO + WU YI', 660, 343, 1.25, [210, 220, 218], 0.8);
  drawText(canvas, 'PAKISTANI PILOT ZEESHAN ALI', 660, 357, 1.25, [210, 220, 218], 0.8);
  canvas.roundedRect(660, 394, 210, 27, 4, COLORS.teal);
  drawText(canvas, '5-10 DAYS AT TIANGONG', 672, 402, 1.35, COLORS.white, 0.7);
  drawRocket(canvas, 941, 376);
}

function storyGrid(): void {
  const xs = [24, 518];
  const ys = [458, 630, 802];
  STORIES.forEach((story, index) => {
    drawStoryCard(canvas, story, xs[index % 2], ys[Math.floor(index / 2)], 482, 164, index % 2 === 1);
  });
}

function footer(): void {
  canvas.rect(24, 978, 976, 2, COLORS.ink);
  drawText(canvas, '25 NOV 2026 / VERIFIED WIRE REPORTS / WORLD EDITION', 26, 989, 1.25, COLORS.grey, 0.7);
  const closing = 'SPACE / DIPLOMACY / SECURITY / COURTS / POLITICS';
  drawText(canvas, closing, 998 - textWidth(closing, 1.05, 0.7), 1007, 1.05, COLORS.red, 0.7);
  canvas.rect(24, 1019, 976, 5, COLORS.orange);
}

header();
hero();
storyGrid();
footer();

const outputDirectory = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputDirectory, { recursive: true });
const outputPath = join(outputDirectory, 'entry.png');
const png = encodePng(WIDTH, HEIGHT, canvas.downsample());
writeFileSync(outputPath, png);
console.log(`Wrote ${outputPath} (${png.length} bytes)`);
