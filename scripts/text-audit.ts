import { ALL_DRAWN_STRINGS, DATE_PARAGRAPH, KICKERS, LEADS, MAP_POINTS, STATS, WIRES } from '../content.ts';
import { HALDEN, MERIDIAN_BOLD, fitSize, textWidth, wrapText } from '../font.ts';

const problems:string[]=[];
const required=['Strait of Hormuz','Ras Tanura','Hodeidah','Shenzhou-24','Zeeshan Ali','Dimorphos','Cartagena','Sylvain Astier','Yonhap','Ukrinform','Al Jazeera','Al-Monitor','Balleny','Middletown','Éxito'];
const forbidden=['STRAIT OF HAHNUZ','RAN TANURA','ALONI FACTS','YON-HAP','INDEP-UKRINFORM'];
const corpus=ALL_DRAWN_STRINGS.join('\n');

ALL_DRAWN_STRINGS.forEach((text,index)=>{
  console.log(`${String(index+1).padStart(3,'0')}  ${text}`);
  if(!text.length)problems.push(`String ${index+1} is empty`);
  if(text.includes('...')||text.includes('…'))problems.push(`String ${index+1} appears truncated`);
  for(const char of text){if(!HALDEN.hasGlyph(char))problems.push(`Halden lacks ${JSON.stringify(char)} in string ${index+1}`);if(!MERIDIAN_BOLD.hasGlyph(char))problems.push(`Meridian lacks ${JSON.stringify(char)} in string ${index+1}`);}
});

for(const name of required)if(!corpus.includes(name))problems.push(`Required spelling absent: ${name}`);
for(const typo of forbidden)if(corpus.toUpperCase().includes(typo))problems.push(`Forbidden garble present: ${typo}`);
if(corpus.toUpperCase().includes('SOUTHERN OCEAN'))problems.push('SOUTHERN OCEAN appears as a region');
if(!DATE_PARAGRAPH.includes('23 Nov — leaked Rosstat'))problems.push('Rosstat analysis is not labeled 23 Nov');
if(DATE_PARAGRAPH.includes('24 Nov — leaked Rosstat'))problems.push('Rosstat analysis incorrectly labeled 24 Nov');
if(LEADS.length!==8||WIRES.length!==11||STATS.length>6)problems.push(`Count mismatch: ${LEADS.length} leads, ${WIRES.length} wires, ${STATS.length} stats`);

const storyNumbers=[...LEADS.map((story)=>story.number),...WIRES.map((story)=>story.number)].sort((a,b)=>a-b);
const pinNumbers=MAP_POINTS.map((point)=>point.number).sort((a,b)=>a-b);
const expected=Array.from({length:19},(_,index)=>index+1).join(',');
if(storyNumbers.join(',')!==expected)problems.push(`Story numbering mismatch: ${storyNumbers.join(',')}`);
if(pinNumbers.join(',')!==expected)problems.push(`Pin numbering mismatch: ${pinNumbers.join(',')}`);

for(const story of LEADS){
  if(story.headline.split(/\s+/).length>8)problems.push(`Headline ${story.number} exceeds eight words`);
  const maxWidth=story.number===1||story.number===2||story.number===7?316:188.8;
  const preferred=story.number===1||story.number===2||story.number===7?27:21;
  const floor=story.number===1||story.number===2||story.number===7?23:18.5;
  const headlineSize=fitSize(MERIDIAN_BOLD,story.headline,preferred,maxWidth,floor);
  if(wrapText(MERIDIAN_BOLD,story.headline,headlineSize,maxWidth).length>2)problems.push(`Headline ${story.number} would truncate`);
  const deckSize=story.number===1||story.number===2||story.number===7?13.5:13;
  if(wrapText(HALDEN,story.deck,deckSize,maxWidth).length>2)problems.push(`Deck ${story.number} would truncate`);
  if(wrapText(HALDEN,story.source,13,maxWidth).length>2)problems.push(`Source ${story.number} would truncate`);
}
for(const story of WIRES){
  const line=`${story.place} · ${story.summary}`;
  if(textWidth(HALDEN,line,13)>313)problems.push(`Wire ${story.number} summary would truncate`);
  if(textWidth(HALDEN,story.source,13)>313)problems.push(`Wire ${story.number} source would truncate`);
}
if(wrapText(HALDEN,DATE_PARAGRAPH,12.5,874).length>5)problems.push('DATE CHECK paragraph exceeds five lines');

console.log(`\nTEXT AUDIT: ${ALL_DRAWN_STRINGS.length} strings, ${problems.length} problems`);
for(const problem of problems)console.error(`- ${problem}`);
if(problems.length)process.exitCode=1;
