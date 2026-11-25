import { ALL_DRAWN_STRINGS, DATE_PARAGRAPH, KICKERS, LEADS, MAP_POINTS, PAGE, STATS, WIRES } from '../content.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, fitSize, textWidth, wrapText, type TrueTypeFont } from '../font.ts';

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

function checkWidth(font:TrueTypeFont,text:string,size:number,width:number,label:string,letterSpacing=0):void{
  const measured=textWidth(font,text,size,letterSpacing);
  if(measured>width+0.01)problems.push(`${label} is ${measured.toFixed(1)}px wide in a ${width.toFixed(1)}px box`);
}
function checkFitted(font:TrueTypeFont,text:string,preferred:number,width:number,floor:number,label:string):void{
  const size=fitSize(font,text,preferred,width,floor);
  checkWidth(font,text,size,width,label);
}
function checkWrapped(font:TrueTypeFont,text:string,size:number,width:number,maxLines:number,label:string):void{
  const lines=wrapText(font,text,size,width);
  if(lines.length>maxLines)problems.push(`${label} needs ${lines.length} lines; box allows ${maxLines}`);
  lines.forEach((line,index)=>checkWidth(font,line,size,width,`${label} line ${index+1}`));
}

checkWidth(HALDEN_BOLD,PAGE.runningLeft,12,320,'Running bar left');
checkWidth(HALDEN_BOLD,PAGE.runningRight,12,420,'Running bar right');
checkWidth(MERIDIAN_BOLD,PAGE.date,64,1024,'Masthead date',-0.35);
checkFitted(HALDEN,PAGE.audit,12.5,960,11.5,'Audit bar');
const kickerWidth=KICKERS.reduce((sum,item)=>sum+textWidth(MERIDIAN_BOLD,item,16),0)+72;
if(kickerWidth>1024)problems.push(`Kicker strip is ${kickerWidth.toFixed(1)}px wide in a 1024px box`);
const statWidth=976/STATS.length;
for(const [value,label] of STATS){checkWidth(HALDEN_BOLD,value,29,statWidth,`Stat ${value}`);checkFitted(HALDEN,label,12.5,statWidth-10,11.5,`Stat label ${label}`);}

for(const story of LEADS){
  if(story.headline.split(/\s+/).length>8)problems.push(`Headline ${story.number} exceeds eight words`);
  const maxWidth=story.number===1||story.number===2||story.number===7?316:188.8;
  const preferred=story.number===1||story.number===2||story.number===7?27:21;
  const floor=story.number===1||story.number===2||story.number===7?23:18.5;
  const headlineSize=fitSize(MERIDIAN_BOLD,story.headline,preferred,maxWidth,floor);
  checkWrapped(MERIDIAN_BOLD,story.headline,headlineSize,maxWidth,2,`Headline ${story.number}`);
  const deckSize=story.number===1||story.number===2||story.number===7?13.5:13;
  checkWrapped(HALDEN,story.deck,deckSize,maxWidth,2,`Deck ${story.number}`);
  checkWrapped(HALDEN,story.source,13,maxWidth,story.number===1||story.number===2||story.number===7?1:2,`Source ${story.number}`);
  checkWidth(HALDEN_BOLD,`${story.region} · ${story.place}`,story.number===1||story.number===2||story.number===7?13:12,maxWidth,`Place ${story.number}`);
}
checkWidth(MERIDIAN_BOLD,PAGE.map,18,270,'Map heading');
checkFitted(HALDEN,PAGE.mapLegendOne,11.5,270,10,'Map legend one');
checkFitted(HALDEN,PAGE.mapLegendTwo,11.5,270,10,'Map legend two');
for(const point of MAP_POINTS)checkWidth(HALDEN_BOLD,String(point.number),8.5,10.4,`Map pin ${point.number}`,point.number>9?-0.5:0);
checkWidth(MERIDIAN_BOLD,PAGE.wires,19,694,'Wire heading');
for(const story of WIRES){
  const line=`${story.place} · ${story.summary}`;
  checkWidth(HALDEN_BOLD,line,13,313,`Wire ${story.number} summary`);
  checkWidth(HALDEN,story.source,13,313,`Wire ${story.number} source`);
}
checkWidth(HALDEN_BOLD,PAGE.dateLabel,13,90,'DATE CHECK label');
checkWrapped(HALDEN,DATE_PARAGRAPH,12.5,874,5,'DATE CHECK paragraph');

console.log(`\nTEXT AUDIT: ${ALL_DRAWN_STRINGS.length} strings, ${problems.length} problems`);
for(const problem of problems)console.error(`- ${problem}`);
if(problems.length)process.exitCode=1;
