import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Canvas } from '../canvas.ts';
import { ALL_DRAWN_STRINGS, BADGE_LEGEND, BRIEFS, DATE_PARAGRAPH, LEADS, MAP_POINTS, MAP_REGION_LABELS, PAGE, REGION_COUNTS } from '../content.ts';
import { MERIDIAN_BOLD, MIN_TEXT_SIZE, inkBounds, pairKern, textWidth, type TextRun } from '../font.ts';
import { drawPage } from '../main.ts';
import { computePinCenters, MAP_HEIGHT, MAP_WIDTH, PIN_RIM } from '../map.ts';

const problems: string[] = [];
const runs: TextRun[] = [];
const canvas = Object.assign(new Canvas(1024, 1024, 1), { onText: (run: TextRun) => runs.push(run) });
drawPage(canvas);

function normalize(text: string): string { return text.replace(/\s+/g, ' ').trim(); }

// Match the actual lines in draw order, including repeated sources and pin IDs.
// Only line breaks may differ from the story registry.
function matchCopy(): TextRun[][] {
  const groups: TextRun[][] = [];
  let cursor = 0;
  for (const field of ALL_DRAWN_STRINGS) {
    const expected = normalize(field), start = cursor;
    let actual = '';
    while (cursor < runs.length && actual !== expected) {
      const next = normalize(`${actual} ${runs[cursor].text}`);
      if (!expected.startsWith(next)) break;
      actual = next;
      cursor++;
    }
    if (!expected || actual !== expected) {
      problems.push(`Copy missing or out of order: “${field}” (drew “${actual || runs[cursor]?.text || ''}”)`);
      break;
    }
    groups.push(runs.slice(start, cursor));
  }
  if (cursor !== runs.length) problems.push(`${runs.length - cursor} unmatched drawn lines`);
  return groups;
}

const groups = matchCopy();
const corpus = normalize(runs.map(run => run.text).join(' '));
// Place names, agency names, headlines and figures follow the current edition.
const required = [
  ...LEADS.flatMap(s => [s.place, s.headline, s.deck, s.source, s.callout]),
  ...BRIEFS.flatMap(s => [s.place, s.summary, s.source]),
  'Shenzhou-24', 'Pakistan', 'Muhammad', 'Zeeshan Ali', 'Natural Earth',
];
for (const text of new Set(required)) {
  if (!corpus.includes(text)) problems.push(`Required text missing from page: ${text}`);
}
for (const bad of ['SOUTHERN OCEAN', 'NDX', 'tariff caps', 'offset']) {
  if (corpus.toLowerCase().includes(bad.toLowerCase())) problems.push(`Forbidden wording: ${bad}`);
}
for (const bad of ['Ethiopia polio Round 1', 'WHO evacuates Akwe Ebola team']) {
  if (LEADS.some(s => `${s.headline} ${s.deck}`.includes(bad)) || BRIEFS.some(s => s.summary.includes(bad))) {
    problems.push(`Earlier-day event appears as a story: ${bad}`);
  }
}
if (!DATE_PARAGRAPH.startsWith(`All ${MAP_POINTS.length} stories occurred or were first reported on 25 Nov 2026 UTC.`)
    || !DATE_PARAGRAPH.includes('23 Nov — leaked Rosstat') || !DATE_PARAGRAPH.includes('24 Nov — CAS restores Senegal')) {
  problems.push('DATE CHECK is missing the edition date or a dated exclusion');
}
const sudan = BRIEFS.find(s => s.place === 'Khartoum');
if (!sudan?.summary.includes('talks') || sudan.summary.includes('19 killed')) problems.push('Khartoum brief mixes or omits the talks event');

const stories = [...LEADS, ...BRIEFS];
if (LEADS.length !== 13 || BRIEFS.length !== 20) problems.push(`Wrong split: ${LEADS.length} cards, ${BRIEFS.length} briefs`);
if (MAP_POINTS.length !== stories.length) problems.push('Missing or extra map point');
stories.forEach((story, i) => {
  const point = MAP_POINTS[i];
  if (story.number !== i + 1 || point?.number !== story.number || point.region !== story.region
      || point.location.some((coord, axis) => coord !== story.location[axis])) problems.push(`Reading order or map mismatch at story ${i + 1}`);
});
for (const {region, count} of REGION_COUNTS) {
  if (count !== stories.filter(s => s.region === region).length) problems.push(`${region} count mismatch`);
}
const validBadges = new Set(BADGE_LEGEND.map(item => item.badge));
for (const story of LEADS) if (!validBadges.has(story.badge)) problems.push(`Invalid badge on story ${story.number}`);
if (LEADS.find(s => s.place === 'Strait of Hormuz')?.badge !== 'CLAIM') problems.push('Hormuz is not marked CLAIM');
if (pairKern(MERIDIAN_BOLD, 'c', 'l', 20) <= .5 || textWidth(MERIDIAN_BOLD, 'cl', 20) <= MERIDIAN_BOLD.advance('c', 20) + MERIDIAN_BOLD.advance('l', 20) + .5) {
  problems.push('Meridian cl pair lacks positive separation');
}

const ink = runs.map(inkBounds);
runs.forEach((run, i) => {
  const a = ink[i];
  for (const ch of run.text) if (!run.font.hasGlyph(ch)) problems.push(`Missing drawn glyph ${JSON.stringify(ch)} in “${run.text}”`);
  if (run.size < MIN_TEXT_SIZE) problems.push(`“${run.text}” drawn at ${run.size}px, below ${MIN_TEXT_SIZE}px`);
  if (/\.\.\.|[…≈]|(?:^|\W)~\d/.test(run.text)) problems.push(`Forbidden glyph or truncation in “${run.text}”`);
  if (a.left < 23.5 || a.right > 1000.5 || a.top < 0 || a.bottom >= 1019) problems.push(`“${run.text}” outside live area`);
  for (let j = i + 1; j < runs.length; j++) {
    const b = ink[j];
    if (a.left < b.right && b.left < a.right && a.top < b.bottom + .5 && b.top < a.bottom + .5) {
      problems.push(`Ink collision: “${run.text}” / “${runs[j].text}”`);
    }
  }
});

const copyLines = new Map<string, TextRun[]>();
groups.forEach((lines, i) => {
  const field = ALL_DRAWN_STRINGS[i];
  copyLines.set(field, [...(copyLines.get(field) ?? []), ...lines]);
});
const rightEdge = (run: TextRun) => run.x + textWidth(run.font, run.text, run.size, run.letterSpacing);
const rightMargin = canvas.width - 24, datelines = LEADS.flatMap(s => copyLines.get(`${s.region} · ${s.place}`) ?? []);
for (const story of LEADS) {
  const region = `${story.region} · ${story.place}`, placeLine = copyLines.get(region)?.[0];
  if (!placeLine) continue;
  // The next dateline on this same row marks the next column's left edge.
  const right = Math.min(rightMargin, ...datelines.filter(r => r.y === placeLine.y && r.x > placeLine.x).map(r => r.x - 4));
  const below = Math.min(...datelines.filter(r => r.y > placeLine.y).map(r => r.y), copyLines.get(PAGE.map)?.[0]?.y ?? canvas.height);
  for (const field of [region, story.headline, story.deck, story.source]) {
    const lines = (copyLines.get(field) ?? []).filter(r => r.y >= placeLine.y && r.y < below && r.x >= placeLine.x && r.x < right);
    if (!lines.length || lines.length > 2 || lines.some(r => r.x !== placeLine.x || rightEdge(r) > right + .01)) {
      problems.push(`Card ${story.number} overflows: ${field}`);
    }
  }
}
if (copyLines.get(LEADS[0].headline)?.length !== 2) problems.push('Lead headline needs two lines');
const tag = copyLines.get(PAGE.tagline) ?? [];
if (tag.length !== 1 || tag[0].x < 24 || rightEdge(tag[0]) > rightMargin) problems.push('Tagline does not fit one line inside the margins');
const check = copyLines.get(DATE_PARAGRAPH) ?? [];
if (!check.length || check.length > 2 || check.some(r => r.size !== 13)) problems.push('DATE CHECK exceeds two lines or is not 13px');
const mapLeft = copyLines.get(PAGE.map)?.[0]?.x ?? 24;
for (const label of MAP_REGION_LABELS) {
  if (copyLines.get(label)?.some(r => rightEdge(r) > mapLeft + MAP_WIDTH)) problems.push(`Map legend overflows: ${label}`);
}

const mapTop = (copyLines.get(PAGE.map)?.[0]?.y ?? 0) + 24;
const centers = computePinCenters(mapLeft, mapTop);
let minSpacing = Infinity, maxLeader = 0, minRimGap = Infinity;
for (const [i, pin] of centers.entries()) {
  if (pin.cx - pin.radius < mapLeft || pin.cy - pin.radius < mapTop || pin.cx + pin.radius > mapLeft + MAP_WIDTH || pin.cy + pin.radius > mapTop + MAP_HEIGHT) {
    problems.push(`Pin ${pin.number} clipped by map edge`);
  }
  const label = copyLines.get(String(pin.number))?.find(run => run.x >= mapLeft && run.x < mapLeft + MAP_WIDTH && run.y >= mapTop && run.y < mapTop + MAP_HEIGHT);
  if (label) {
    const box = ink[runs.indexOf(label)];
    const dx = Math.max(Math.abs(box.left - pin.cx), Math.abs(box.right - pin.cx));
    const dy = Math.max(Math.abs(box.top - pin.cy), Math.abs(box.bottom - pin.cy));
    if (Math.hypot(dx, dy) > pin.radius - PIN_RIM - 1) problems.push(`Pin ${pin.number} ink has less than 1px clearance inside its coloured fill`);
  } else problems.push(`Pin ${pin.number} has no number drawn on the map`);
  const leader = Math.hypot(pin.cx - pin.ax, pin.cy - pin.ay);
  maxLeader = Math.max(maxLeader, leader);
  if (leader > 14.1) problems.push(`Pin ${pin.number} leader ${leader.toFixed(1)}px > 14px`);
  for (const other of centers.slice(i + 1)) {
    const distance = Math.hypot(pin.cx - other.cx, pin.cy - other.cy);
    const gap = distance - pin.radius - other.radius;
    minSpacing = Math.min(minSpacing, distance);
    minRimGap = Math.min(minRimGap, gap);
    if (distance < 10.5) problems.push(`Pins ${pin.number}/${other.number} centres only ${distance.toFixed(1)}px apart`);
    if (gap < 1) problems.push(`Pins ${pin.number}/${other.number} have only ${gap.toFixed(2)}px between their outer rims`);
  }
}

const png = join(process.env.MAKEFUN_OUTPUT_DIR ?? 'out', 'entry.png');
if (existsSync(png)) {
  const data = readFileSync(png);
  if (data.length >= 900_000) problems.push(`PNG ${data.length} bytes is not under 900 KB`);
  if (data.readUInt32BE(16) !== 1024 || data.readUInt32BE(20) !== 1024) problems.push('PNG is not 1024×1024');
} else problems.push(`Missing PNG: ${png}`);
for (const file of ['main.ts', 'map.ts', 'world-land.ts', 'canvas.ts', 'font.ts', 'stories.ts', 'content.ts', 'png.ts']) {
  for (const match of readFileSync(file, 'utf8').matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    if (!match[1].startsWith('.') && !match[1].startsWith('node:')) problems.push(`${file} imports ${match[1]}`);
  }
}

console.log(`MAP: shortest spacing ${minSpacing.toFixed(2)}px; longest leader ${maxLeader.toFixed(2)}px; smallest rim gap ${minRimGap.toFixed(2)}px`);
console.log(`TEXT AUDIT: ${ALL_DRAWN_STRINGS.length} strings, ${runs.length} drawn lines, ${problems.length} problems`);
for (const problem of problems) console.error(`- ${problem}`);
if (problems.length) process.exitCode = 1;
