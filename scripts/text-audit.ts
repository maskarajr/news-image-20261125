import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TextBounds } from '../canvas.ts';
import { BADGE_LEGEND, BRIEFS, DATE_PARAGRAPH, EDITION, HEROES, KPIS, LEADS, PAGE, REGION_COUNTS, SECONDARY, TIMELINE } from '../content.ts';
import { MERIDIAN_BOLD, pairKern, textWidth } from '../font.ts';
import { cardBox, renderEdition } from '../main.ts';
import { computePinCenters, MAP_BOX, PIN_RADIUS } from '../map.ts';

interface PrintedLine extends TextBounds { text: string }
const printed: PrintedLine[] = [], problems: string[] = [];
const rendered = renderEdition((text, bounds) => printed.push({ text, ...bounds }));
const corpus = printed.map(p => p.text.trim()).join(' ');

function check(condition: boolean, message: string): void {
  if (!condition) problems.push(message);
}

function inside(p: TextBounds, x: number, y: number, w: number, h: number): boolean {
  return p.left >= x && p.right <= x + w && p.top >= y && p.bottom <= y + h;
}

function field(text: string, lines = printed): PrintedLine | undefined {
  const line = lines.find(p => p.text.trim() === text);
  check(!!line, `Not drawn in its allotted space: ${text}`);
  return line;
}

for (const [i, p] of printed.entries()) {
  console.log(`${String(i + 1).padStart(3, '0')}  ${p.text}`);
  check(!!p.text.trim() && inside(p, 0, 0, 1024, 1024), `Empty or off-page text: ${p.text}`);
  check(!/(?:\.\.\.|…|≈|~\d)/.test(p.text), `Truncation or ambiguous number: ${p.text}`);
  // Compare actual glyph extents, including ascenders, descenders and optical overhangs.
  for (const q of printed.slice(i + 1)) {
    const overlapX = Math.min(p.right, q.right) - Math.max(p.left, q.left);
    const overlapY = Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top);
    check(overlapX <= .01 || overlapY <= .01, `Text overlap: “${p.text}” / “${q.text}”`);
  }
}

check(HEROES.length === 3 && SECONDARY.length === 10, 'Expected three leads and ten secondary cards');
check(EDITION.every((s, i) => s.number === i + 1), 'Reading order is not 1..N');
check(corpus.includes(`${EDITION.length} STORIES`) && corpus.includes(`${BRIEFS.length} more stories`), 'Edition totals disagree');
const sixContinents = ['Jiuquan, China', 'London, UK', 'Cape Town, South Africa', 'Washington, US', 'Cartagena, Colombia', 'Canberra, Australia'];
for (const place of sixContinents) check(LEADS.some(s => s.place === place), `Missing continent dateline: ${place}`);
check(corpus.includes(DATE_PARAGRAPH) && DATE_PARAGRAPH.includes(`All ${EDITION.length} stories`), 'DATE CHECK incomplete');
for (const text of [PAGE.runningLeft, PAGE.runningRight, PAGE.date, PAGE.deck, PAGE.dateLabel, PAGE.briefs, PAGE.map, PAGE.mapCredit,
  ...BADGE_LEGEND.map(item => item.label), ...TIMELINE.flat()]) field(text);
check(TIMELINE[0][0] === '00:18' && TIMELINE.every(([time], i) => i === 0 || time > TIMELINE[i - 1][0]), 'Incorrect UTC sequence');

check(KPIS.length === 6, 'Expected six KPI boxes');
const kpiWidth = (976 - 4 * (KPIS.length - 1)) / KPIS.length;
for (const [i, kpi] of KPIS.entries()) {
  const labels = printed.filter(p => inside(p, 24 + i * (kpiWidth + 4), 95, kpiWidth, 48));
  for (const text of [kpi.label, kpi.value, kpi.note]) field(text, labels);
}

let share = 0;
for (const { region, count } of REGION_COUNTS) {
  check(count > 0 && count === EDITION.filter(s => s.region === region).length, `Incorrect edition count for ${region}`);
  const x = 24 + 976 * share / EDITION.length, width = 976 * count / EDITION.length;
  field(`${region} ${count}`, printed.filter(p => inside(p, x, 146, width, 17)));
  share += count;
}
check(share === EDITION.length, 'Region segments do not cover the edition');
field(PAGE.utcLabel, printed.filter(p => inside(p, 24, 163, 109, 23)));

const plates = [
  ['TIANGONG', '03:56 UTC', 'FIRST FOREIGNER'],
  ['KOSPI', '−6.16%', 'Samsung', '−9.87%', 'SK hynix', '−11.05%', 'TAIEX', '−4.80%', 'Nikkei 225', '−2.78%'],
  ['14 ECONOMIES', 'CHINA 20%', 'INDIA 25%', 'EU 15%', 'VIETNAM 35%'],
];
const baselineRows: number[][] = [[], []];
for (const story of LEADS) {
  const { x, y, w, h } = cardBox(story.number);
  const lines = printed.filter(p => inside(p, x + 1, y + 1, w - 2, h - 2));
  const copy = lines.map(p => p.text).join(' ');
  for (const text of [String(story.number), `${story.region} · ${story.place}`, story.badge, ...story.headline, story.source]) field(text, lines);
  check(copy.includes(story.deck), `Card ${story.number} deck missing or truncated`);
  if ('takeaway' in story) {
    const plate = lines.filter(p => inside(p, x + 1, y + 26, w - 2, 55));
    for (const text of plates[story.number - 1]) field(text, plate);
    const why = field(PAGE.why, lines), takeaway = field(story.takeaway, lines), source = field(story.source, lines);
    if (why && takeaway && source) check(why.bottom < takeaway.top && takeaway.bottom < source.top, `Takeaway out of order: ${story.number}`);
    story.headline.forEach((text, i) => {
      const line = lines.find(p => p.text === text);
      if (!line) return;
      // For a given face and size, subtracting the glyph top bearings recovers the line origin.
      const top = Math.min(...[...text].flatMap(ch => MERIDIAN_BOLD.scaledGlyph(ch, 27).flat().map(p => p[1])));
      baselineRows[i].push(line.top - top);
    });
  } else {
    const plate = lines.filter(p => inside(p, x + 1, y + 21, w - 2, 37));
    field(story.figure, plate);
    field(story.caption, plate);
  }
}
for (const row of baselineRows) check(row.length === 3 && Math.max(...row) - Math.min(...row) < .01, 'Lead headlines do not align');

const rows = Math.ceil(BRIEFS.length / 2);
for (const [i, story] of BRIEFS.entries()) {
  const lines = printed.filter(p => inside(p, 382 + Math.floor(i / rows) * 316, 753 + (i % rows) * 19.4, 302, 19.4));
  for (const text of [String(story.number), `${story.place} ·`, story.summary, story.source]) field(text, lines);
}

// Keep context and effective dates out of Wednesday's headlines. These are deliberate editorial distinctions.
for (const text of ['23 Nov — leaked Rosstat data', '24 Nov — the Dhaka wage vote', 'CAS ruling restoring Senegal’s title',
  'workers’ blockade', 'mine recoveries', 'Ofgem announced January’s cap', 'US tariff rates are proposals',
  'Muhammad Zeeshan Ali', 'Section 301', 'Some goods would be exempt', 'direct-debit use in Great Britain'])
  check(corpus.includes(text), `Missing fact or date distinction: ${text}`);
check(SECONDARY.find(s => s.scene === 'tankers')?.badge === 'CLAIM', 'Hormuz must remain a claim');
for (const scene of ['energy', 'garments', 'mine', 'fire']) check(SECONDARY.some(s => s.scene === scene), `Missing illustrated story: ${scene}`);
const frontPage = EDITION.map(s => 'headline' in s ? s.headline.join(' ') : s.summary).join(' ');
for (const stale of ['Argentina enters recession', 'Airline orders 50', 'Garment wage raised', 'Court hears Mundubile', 'CAS restores Senegal', 'Drought aid for', 'Hera reaches'])
  check(!frontPage.includes(stale), `Old event promoted to a Wednesday headline: ${stale}`);
check(pairKern(MERIDIAN_BOLD, 'c', 'l', 20) > .5 && textWidth(MERIDIAN_BOLD, 'cl', 20) >
  MERIDIAN_BOLD.advance('c', 20) + MERIDIAN_BOLD.advance('l', 20) + .5, 'Meridian cl pair has lost its separation');

const pins = computePinCenters();
const pinLabels = printed.filter(p => inside(p, MAP_BOX.x, MAP_BOX.y, MAP_BOX.w, MAP_BOX.h));
check(pinLabels.length === 13 && pins.length === 13, 'Map must have exactly 13 numbered pins');
let maxNudge = 0;
for (const [i, p] of pins.entries()) {
  check(p.number === i + 1 && pinLabels[i]?.text === String(p.number), 'Map numbering is not 1–13');
  const nudge = Math.hypot(p.cx - p.ax, p.cy - p.ay);
  maxNudge = Math.max(maxNudge, nudge);
  const collision = pins.some(q => q !== p && Math.hypot(q.ax - p.ax, q.ay - p.ay) < 2 * PIN_RADIUS);
  check(nudge <= 3 && (nudge === 0 || collision), `Unnecessary or excessive displacement on pin ${p.number}`);
  for (const q of pins.slice(i + 1)) check(Math.hypot(q.cx - p.cx, q.cy - p.cy) >= 2 * PIN_RADIUS, `Pins ${p.number} and ${q.number} overlap`);
}

const png = readFileSync(join(process.env.MAKEFUN_OUTPUT_DIR ?? 'out', 'entry.png'));
check(png.equals(rendered), 'Audited rendering does not match the saved entry.png');
check(png.readUInt32BE(16) === 1024 && png.readUInt32BE(20) === 1024, 'PNG is not 1024×1024');
check(png.length < 300_000, `PNG is ${png.length} bytes; must be under 300 KB`);
for (const file of ['main.ts', 'map.ts', 'world-land.ts', 'canvas.ts', 'font.ts', 'stories.ts', 'content.ts', 'png.ts']) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  for (const [, specifier] of source.matchAll(/from\s+['"]([^'"]+)['"]/g))
    check(specifier.startsWith('.') || specifier.startsWith('node:'), `${file} imports external runtime module ${specifier}`);
}

console.log(`\nTEXT AUDIT: ${printed.length} lines, ${EDITION.length} stories, ${pins.length} pins (max nudge ${maxNudge.toFixed(2)} px), ${png.length} bytes, ${problems.length} problems`);
for (const problem of problems) console.error(`- ${problem}`);
if (problems.length) process.exitCode = 1;
