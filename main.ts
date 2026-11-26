import { mkdirSync, writeFileSync } from 'node:fs';import { join } from 'node:path';
import { Canvas, COLORS } from './canvas.ts';
import { ALL_DRAWN_STRINGS, BADGE_LEGEND, BRIEFS, DATE_PARAGRAPH, LEADS, PAGE, REGION_COUNTS } from './content.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, drawCentered, drawText, fitSize, textWidth, wrapText } from './font.ts';
import { drawLocator } from './map.ts';import { BADGE_COLORS, REGION_COLORS, drawHeroCard, drawMidCard } from './stories.ts';import { encodePng } from './png.ts';

const W=1024,H=1024,INK:[number,number,number]=[15,32,47],CREAM:[number,number,number]=[251,248,241],STONE:[number,number,number]=[236,229,213],MUTED:[number,number,number]=[91,98,96],AMBER:[number,number,number]=[214,139,51];
const c=new Canvas(W,H,2,[246,241,229]);
function masthead():void{c.rect(0,0,W,82,INK);drawText(c,HALDEN_BOLD,PAGE.runningLeft,24,6,11.5,[217,210,192]);drawText(c,HALDEN_BOLD,PAGE.runningRight,1000-textWidth(HALDEN_BOLD,PAGE.runningRight,11.5),6,11.5,[217,210,192]);drawCentered(c,MERIDIAN_BOLD,PAGE.date,512,19,56,CREAM,-.25);c.rect(0,79,W,3,AMBER);}
function regions():void{let x=24;for(const item of REGION_COUNTS){const width=976*item.count/33;c.rect(x,85,width,9,REGION_COLORS[item.region]);x+=width;}const size=fitSize(HALDEN_BOLD,PAGE.regionSummary,11.8,976,10.5);drawCentered(c,HALDEN_BOLD,PAGE.regionSummary,512,98,size,INK);}
function timeline():void{c.rect(24,116,976,24,STONE);c.rect(24,116,111,24,INK);drawCentered(c,HALDEN_BOLD,PAGE.utcLabel,79.5,122,10.5,CREAM);drawText(c,HALDEN_BOLD,PAGE.utcLine,145,121.5,12.5,INK);}
function cards(): void {
  const heroX = [24, 354, 684];
  LEADS.slice(0, 3).forEach((story, i) => drawHeroCard(c, story, heroX[i], 146, 316, 180));
  for (const x of heroX.slice(1)) c.rect(x - 7, 146, 1, 180, COLORS.line);
  c.rect(24, 329, 976, 1, COLORS.line);

  const gap = 8, w = (976 - gap * 4) / 5;
  LEADS.slice(3, 8).forEach((story, i) => drawMidCard(c, story, 24 + i * (w + gap), 332, w, 148));
  LEADS.slice(8, 13).forEach((story, i) => drawMidCard(c, story, 24 + i * (w + gap), 486, w, 142, true));
  for (let column = 1; column < 5; column++) {
    const x = Math.floor(24 + column * (w + gap) - gap / 2);
    c.rect(x, 332, 1, 296, COLORS.line);
  }
  c.rect(24, 483, 976, 1, COLORS.line);
  c.line(24, 634, 1000, 634, 1, INK);
}

function briefs(): void {
  const x = 374, y = 647, colW = 303;
  drawText(c, MERIDIAN_BOLD, PAGE.briefs, x, y, 17, INK);
  BRIEFS.forEach((story, i) => {
    const left = x + Math.floor(i / 10) * (colW + 20);
    const top = y + 21 + (i % 10) * 30;
    c.circle(left + 7, top + 8.5, 7, REGION_COLORS[story.region]);
    drawCentered(c, HALDEN_BOLD, String(story.number), left + 7, top + 3, 9.5, COLORS.white, -.3);
    const line = `${story.place} · ${story.summary}`;
    const size = fitSize(HALDEN_BOLD, line, 14, colW - 20, 13);
    drawText(c, HALDEN_BOLD, line, left + 18, top, size, INK);
    drawText(c, HALDEN, story.source, left + 18, top + 15, 12, MUTED);
    c.rect(left + 18, top + 30, colW - 18, 1, COLORS.line);
  });
}

function badgeLegend(): void {
  const y = 974;
  let x = 24;
  drawText(c, HALDEN_BOLD, PAGE.badgeLegend, x, y, 10.5, INK);
  x += textWidth(HALDEN_BOLD, PAGE.badgeLegend, 10.5) + 10;
  for (const item of BADGE_LEGEND) {
    c.circle(x + 3, y + 5, 3, BADGE_COLORS[item.badge]);
    x += 10;
    drawText(c, HALDEN_BOLD, item.badge, x, y, 10.5, BADGE_COLORS[item.badge]);
    x += textWidth(HALDEN_BOLD, item.badge, 10.5) + 4;
    drawText(c, HALDEN, item.label, x, y, 10.5, INK);
    x += textWidth(HALDEN, item.label, 10.5) + 18;
  }
  drawText(c, HALDEN, PAGE.mapCredit, 1000 - textWidth(HALDEN, PAGE.mapCredit, 12), y - 1, 12, INK);
  c.line(24, y + 15, 1000, y + 15, 1, [163,161,151]);
}

function dateCheck(): void {
  const y = 990;
  c.rect(24, y, 4, 28, BADGE_COLORS.CLAIM);
  drawText(c, HALDEN_BOLD, PAGE.dateLabel, 36, y + 2, 12, BADGE_COLORS.CLAIM);
  const lines = wrapText(HALDEN, DATE_PARAGRAPH, 12, 874);
  lines.forEach((line, i) => drawText(c, HALDEN, line, 126, y + i * 14, 12, INK));
}
if(!ALL_DRAWN_STRINGS.length)throw new Error('Text registry empty');masthead();regions();timeline();cards();drawLocator(c,24,647,332);briefs();badgeLegend();dateCheck();c.rect(24,1019,976,5,AMBER);
const dir=process.env.MAKEFUN_OUTPUT_DIR??'/output';mkdirSync(dir,{recursive:true});const path=join(dir,'entry.png'),png=encodePng(W,H,c.downsample());writeFileSync(path,png);console.log(`Wrote ${path} (${png.length} bytes)`);
