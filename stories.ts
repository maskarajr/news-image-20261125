import { Canvas, COLORS, type Color } from './canvas.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, drawCentered, drawText, fitSize, wrapText } from './font.ts';
import type { LeadStory, Region } from './content.ts';

export const REGION_COLORS: Record<Region, Color> = {
  Asia: [185, 112, 33], Oceania: [35, 112, 113], 'Middle East': [177, 55, 48],
  Europe: [47, 79, 105], Americas: [100, 72, 120], World: [162, 73, 103],
};

const SKY: Color = [219, 226, 222];
const STONE: Color = [236, 229, 213];
const SLATE: Color = [54, 82, 105];
const AMBER: Color = [214, 139, 51];
const CRIMSON: Color = [177, 55, 48];
const SEA: Color = [107, 153, 158];

function sceneBase(c: Canvas, x: number, y: number, width: number, height: number): void {
  c.rect(x, y, width, height, SKY);
  c.rect(x, y + height * 0.72, width, height * 0.28, STONE);
}

function scene(c: Canvas, name: LeadStory['scene'], x: number, y: number, width: number, height: number): void {
  sceneBase(c, x, y, width, height);
  const bottom = y + height, horizon = y + height * 0.72;
  if (name === 'rocket') {
    c.circle(x + width * .78, y + 19, 8, AMBER);
    c.polygon([[x,horizon],[x + width*.23,horizon-15],[x + width*.48,horizon],[x + width*.7,horizon-11],[x+width,horizon],[x+width,bottom],[x,bottom]], [202,177,126]);
    const rx=x+width*.47; c.rect(rx-14,y+19,3,horizon-y-19,SLATE); c.line(rx-12,y+24,rx+10,y+37,2,SLATE);
    c.polygon([[rx+10,y+14],[rx+18,y+30],[rx+16,horizon-9],[rx+4,horizon-9],[rx+2,y+30]],COLORS.white); c.circle(rx+10,y+31,3,SEA);
    c.polygon([[rx+6,horizon-7],[rx+10,bottom-3],[rx+14,horizon-7]],CRIMSON); c.line(rx+18,y+12,x+width*.74,y+8,1.5,COLORS.white);
    for(const [sx,sy] of [[.12,.2],[.22,.35],[.66,.28],[.88,.4]]) c.circle(x+width*sx,y+height*sy,1.5,COLORS.white);
  } else if (name === 'market') {
    c.rect(x,horizon,width,height*.28,[62,73,78]);
    for(let i=0;i<9;i++){const bw=width*.07,bx=x+8+i*(width-16)/9,bh=12+(i%4)*7;c.rect(bx,horizon-bh,bw,bh,[92,112,115]);}
    c.circle(x+width*.18,y+22,12,AMBER); c.rect(x+width*.58,y+15,width*.32,height*.45,[245,241,229]);
    const px=x+width*.61,py=y+25;c.line(px,py,px+width*.08,py+12,3,CRIMSON);c.line(px+width*.08,py+12,px+width*.16,py+6,3,CRIMSON);c.line(px+width*.16,py+6,px+width*.25,py+27,3,CRIMSON);
    for(let i=0;i<3;i++) c.rect(x+width*.63+i*18,y+height*.49-i*5,8,9+i*5,SEA);
  } else if (name === 'treaty') {
    c.polygon([[x+width*.1,horizon],[x+width*.5,y+18],[x+width*.9,horizon]], [201,194,174]); c.circle(x+width*.5,y+28,13,SLATE);
    c.rect(x+width*.15,horizon-5,width*.7,5,SLATE); for(let i=0;i<5;i++) c.rect(x+width*(.24+i*.13),y+43,5,horizon-y-43,SLATE);
    c.rect(x+width*.34,horizon+6,width*.32,6,[126,91,60]);
    for(const dx of [.28,.72]){c.circle(x+width*dx,horizon+2,5,CRIMSON);c.rect(x+width*dx-3,horizon+7,6,12,SLATE);}
    c.line(x+width*.18,y+11,x+width*.18,y+39,2,SLATE); c.polygon([[x+width*.18,y+12],[x+width*.31,y+16],[x+width*.18,y+22]],AMBER);
    c.line(x+width*.82,y+11,x+width*.82,y+39,2,SLATE); c.polygon([[x+width*.82,y+12],[x+width*.69,y+16],[x+width*.82,y+22]],SEA);
  } else if (name === 'port') {
    c.rect(x,horizon-8,width,height*.36,SEA); c.polygon([[x+width*.12,horizon+1],[x+width*.65,horizon+1],[x+width*.58,horizon+14],[x+width*.22,horizon+14]],SLATE);
    c.rect(x+width*.32,horizon-14,width*.16,15,SLATE); c.line(x+width*.76,y+15,x+width*.76,horizon,3,SLATE); c.line(x+width*.76,y+16,x+width*.55,y+31,3,SLATE); c.line(x+width*.55,y+31,x+width*.55,horizon-3,2,SLATE);
    c.circle(x+width*.79,y+29,11,AMBER); c.circle(x+width*.84,y+23,6,CRIMSON); c.circle(x+width*.74,y+20,5,CRIMSON);
    c.line(x+8,bottom-6,x+width*.92,bottom-6,2,[229,235,230]);
  } else if (name === 'refinery') {
    c.rect(x,horizon,width,height*.28,[84,89,84]); c.ellipse(x+width*.2,horizon-2,width*.1,7,SLATE); c.rect(x+width*.1,horizon-2,width*.2,height*.23,SLATE);
    c.rect(x+width*.42,y+24,width*.07,horizon-y-24,SLATE); c.rect(x+width*.58,y+34,width*.1,horizon-y-34,SLATE); c.rect(x+width*.76,y+18,width*.06,horizon-y-18,SLATE);
    c.polygon([[x+width*.45,y+22],[x+width*.49,y+8],[x+width*.53,y+23]],CRIMSON); c.circle(x+width*.5,y+13,7,AMBER);
    c.polygon([[x+width*.12,y+18],[x+width*.38,y+24],[x+width*.2,y+29]],COLORS.ink); c.line(x+width*.04,y+18,x+width*.4,y+18,2,COLORS.ink);
  } else if (name === 'rescue') {
    c.rect(x+width*.1,y+18,width*.8,horizon-y-18,[218,207,184]); c.rect(x+width*.1,y+18,width*.8,13,CRIMSON); c.rect(x+width*.18,y+39,width*.17,horizon-y-39,SLATE); c.rect(x+width*.42,y+39,width*.17,horizon-y-39,SLATE); c.rect(x+width*.67,y+39,width*.15,horizon-y-39,SLATE);
    c.rect(x+width*.6,horizon+5,width*.25,10,[76,82,80]); c.circle(x+width*.65,horizon+16,4,COLORS.ink); c.circle(x+width*.8,horizon+16,4,COLORS.ink);
    for(const dx of [.22,.35,.48]){c.circle(x+width*dx,horizon+3,3,AMBER);c.rect(x+width*dx-2,horizon+6,4,11,COLORS.ink);}
    c.line(x+width*.15,y+36,x+width*.85,y+36,2,AMBER);
  } else if (name === 'tariffs') {
    c.rect(x,horizon-6,width,height*.34,SEA); for(let i=0;i<5;i++) c.rect(x+12+i*25,horizon-17-(i%2)*10,22,17+(i%2)*10,[i%2?177:198, i%2?82:135, i%2?61:52]);
    c.line(x+width*.78,y+12,x+width*.78,horizon,3,SLATE); c.line(x+width*.78,y+13,x+width*.55,y+30,3,SLATE); c.line(x+width*.55,y+30,x+width*.55,horizon-18,2,SLATE);
    c.polygon([[x+width*.08,horizon+2],[x+width*.92,horizon+2],[x+width*.78,horizon+16],[x+width*.22,horizon+16]],SLATE);
  } else {
    c.rect(x,horizon-9,width,height*.4,SEA); c.polygon([[x,horizon],[x+width*.18,horizon-20],[x+width*.34,horizon],[x+width*.7,horizon],[x+width*.85,horizon-16],[x+width,horizon]], [117,107,80]);
    for(const sx of [.26,.68]){c.polygon([[x+width*(sx-.16),horizon+2],[x+width*(sx+.16),horizon+2],[x+width*(sx+.1),horizon+13],[x+width*(sx-.1),horizon+13]],SLATE);c.rect(x+width*sx-7,horizon-11,14,13,SLATE);}
    for(const sx of [.45,.55,.82]){c.circle(x+width*sx,horizon+19,4,CRIMSON);c.line(x+width*sx-7,horizon+19,x+width*sx+7,horizon+19,1.5,CRIMSON);}
  }
}

function drawWrapped(c: Canvas, font: typeof HALDEN, text: string, x: number, y: number, size: number, width: number, color: Color, maxLines: number, lineHeight: number): number {
  const lines = wrapText(font, text, size, width).slice(0, maxLines);
  lines.forEach((line, index) => drawText(c, font, line, x, y + index * lineHeight, size, color));
  return lines.length;
}

function regionLine(story: LeadStory): string { return `${story.region} · ${story.place}`; }

export function drawHeroLead(c: Canvas, story: LeadStory, x: number, y: number, width: number, height: number): void {
  const accent = REGION_COLORS[story.region];
  scene(c, story.scene, x, y, width, 96);
  c.circle(x + 18, y + 18, 13, accent); drawCentered(c, HALDEN_BOLD, String(story.number), x + 18, y + 9, 14, COLORS.white);
  drawText(c, HALDEN_BOLD, regionLine(story), x, y + 104, 13, accent);
  const headlineSize = fitSize(MERIDIAN_BOLD, story.headline, 27, width, 23);
  drawWrapped(c, MERIDIAN_BOLD, story.headline, x, y + 123, headlineSize, width, COLORS.ink, 2, 27);
  drawWrapped(c, HALDEN, story.deck, x, y + 176, 13.5, width, COLORS.grey, 2, 15);
  drawText(c, HALDEN, story.source, x, y + height - 14, 13, accent);
}

export function drawMidLead(c: Canvas, story: LeadStory, x: number, y: number, width: number, height: number): void {
  const accent = REGION_COLORS[story.region];
  scene(c, story.scene, x, y, width, 70);
  c.circle(x + 15, y + 15, 11, accent); drawCentered(c, HALDEN_BOLD, String(story.number), x + 15, y + 7, 12, COLORS.white);
  if (story.claim) { c.rect(x + width - 49, y + 5, 44, 17, CRIMSON); drawCentered(c, HALDEN_BOLD, 'CLAIM', x + width - 27, y + 8, 10.5, COLORS.white); }
  drawText(c, HALDEN_BOLD, regionLine(story), x, y + 77, 12, accent);
  const headlineSize = fitSize(MERIDIAN_BOLD, story.headline, 21, width, 18.5);
  drawWrapped(c, MERIDIAN_BOLD, story.headline, x, y + 95, headlineSize, width, COLORS.ink, 2, 22);
  drawWrapped(c, HALDEN, story.deck, x, y + 141, 13, width, COLORS.grey, 2, 14);
  drawWrapped(c, HALDEN, story.source, x, y + 184, 13, width, accent, 2, 14);
}
