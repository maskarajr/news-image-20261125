import { ALL_DRAWN_STRINGS, DATE_ITEMS, KICKERS, MAP_POINTS, WIRES } from '../content.ts';
import { SUPPORTED_CHARS, textWidth } from '../font.ts';
import { LEADS } from '../stories.ts';

const problems: string[] = [];
const required = ['STRAIT OF HORMUZ', 'RAS TANURA', 'HODEIDAH', 'SHENZHOU-24', 'ZEESHAN ALI', 'DIMORPHOS', 'CARTAGENA', 'SYLVAIN ASTIER', 'YONHAP', 'UKRINFORM', 'AL JAZEERA', 'AL-MONITOR', 'BALLENY', 'MIDDLETOWN'];
const forbidden = ['STRAIT OF HAHNUZ', 'RAN TANURA', 'ALONI FACTS', 'YON-HAP', 'INDEP-UKRINFORM'];
const corpus = ALL_DRAWN_STRINGS.join('\n');

ALL_DRAWN_STRINGS.forEach((text, index) => {
  console.log(`${String(index + 1).padStart(3, '0')}  ${text}`);
  if (!text.length) problems.push(`String ${index + 1} is empty`);
  if (text.includes('...') || text.includes('…')) problems.push(`String ${index + 1} appears truncated: ${text}`);
  for (const char of text) {
    if (char.charCodeAt(0) > 126) problems.push(`String ${index + 1} contains non-ASCII ${JSON.stringify(char)}`);
    else if (!SUPPORTED_CHARS.has(char.toUpperCase())) problems.push(`String ${index + 1} lacks glyph ${JSON.stringify(char)}`);
  }
});

for (const name of required) if (!corpus.includes(name)) problems.push(`Required spelling absent: ${name}`);
for (const typo of forbidden) if (corpus.includes(typo)) problems.push(`Forbidden garble present: ${typo}`);

function fittedScale(text: string, height: number, maxWidth: number, preferred: number, tracking: number): number {
  const width = textWidth(text, height, tracking, preferred);
  return width <= maxWidth ? preferred : preferred * maxWidth / width;
}

for (const kicker of KICKERS) if (fittedScale(kicker, 26, 300, 0.76, 0.02) < 0.55) problems.push(`Kicker too condensed: ${kicker}`);
for (const story of LEADS) {
  if (story.headline.split(/\s+/).length > 8) problems.push(`Lead ${story.number} exceeds eight words`);
  if (fittedScale(story.headline, 26, 235, 0.76, 0.02) < 0.53) problems.push(`Lead ${story.number} headline too condensed`);
  if (fittedScale(story.fact, 16, 235, 0.73, 0.015) < 0.50) problems.push(`Lead ${story.number} fact too condensed`);
  if (fittedScale(story.source, 14, 235, 0.70, 0.01) < 0.48) problems.push(`Lead ${story.number} source too condensed`);
}
for (const wire of WIRES) if (fittedScale(wire.line, 14, 618, 0.72, 0.01) < 0.50) problems.push(`Wire ${wire.number} too condensed`);
for (const item of DATE_ITEMS) {
  if (fittedScale(item.event, 14, 302, 0.69, 0.005) < 0.48) problems.push(`DATE CHECK event too condensed: ${item.event}`);
  if (fittedScale(item.source, 14, 302, 0.69, 0.005) < 0.48) problems.push(`DATE CHECK source too condensed: ${item.source}`);
}

const pageNumbers = [...LEADS.map((story) => story.number), ...WIRES.map((wire) => Number(wire.number))].sort((a, b) => a - b);
const pinNumbers = MAP_POINTS.map((point) => point.number).sort((a, b) => a - b);
const expectedNumbers = Array.from({ length: 19 }, (_, index) => index + 1);
if (pageNumbers.join(',') !== expectedNumbers.join(',')) problems.push(`Story numbering mismatch: ${pageNumbers.join(',')}`);
if (pinNumbers.join(',') !== expectedNumbers.join(',')) problems.push(`Map pin numbering mismatch: ${pinNumbers.join(',')}`);

console.log(`\nTEXT AUDIT: ${ALL_DRAWN_STRINGS.length} strings, ${problems.length} problems`);
for (const problem of problems) console.error(`- ${problem}`);
if (problems.length) process.exitCode = 1;
