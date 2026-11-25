import { ALL_DRAWN_STRINGS, DATE_ITEMS, WIRES } from '../content.ts';
import { SUPPORTED_CHARS, textWidth } from '../font.ts';
import { LEADS } from '../stories.ts';

const problems: string[] = [];
const required = ['STRAIT OF HORMUZ', 'RAS TANURA', 'HODEIDAH', 'SHENZHOU-24', 'DIMORPHOS', 'CARTAGENA'];
const forbidden = ['STRAIT OF HAHNUZ', 'RAN TANURA', 'ALONI FACTS'];
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

for (const story of LEADS) {
  const headlineHeight = Math.min(30, 30 * 369 / textWidth(story.headline, 30, 0.035));
  if (headlineHeight < 28) problems.push(`Lead ${story.number} headline would fall below 28px`);
  if (textWidth(story.fact, 18, 0.025, 0.82) > 369) problems.push(`Lead ${story.number} fact would truncate`);
  if (textWidth(story.source, 14, 0.025) > 369) problems.push(`Lead ${story.number} source would truncate`);
}
for (const wire of WIRES) if (textWidth(wire.line, 15, 0.025) > 547) problems.push(`Wire ${wire.number} would truncate`);
for (const item of DATE_ITEMS) {
  if (textWidth(item.event, 15, 0.02, 0.95) > 343) problems.push(`DATE CHECK event would truncate: ${item.event}`);
  if (textWidth(item.source, 15, 0.02, 0.95) > 343) problems.push(`DATE CHECK source would truncate: ${item.source}`);
}

console.log(`\nTEXT AUDIT: ${ALL_DRAWN_STRINGS.length} strings, ${problems.length} problems`);
for (const problem of problems) console.error(`- ${problem}`);
if (problems.length) process.exitCode = 1;
