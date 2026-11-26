import { Canvas, COLORS, type Color } from './canvas.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, MIN_TEXT_SIZE, balancedWrapText, drawCentered, drawText, fitSize, fitWrappedSize, textWidth, type TrueTypeFont } from './font.ts';
import type { Badge, LeadStory, Region, Scene } from './content.ts';

export const REGION_COLORS:Record<Region,Color>={Asia:[185,112,33],Europe:[47,79,105],Africa:[83,119,76],Americas:[100,72,120],'Middle East':[177,55,48],Oceania:[35,112,113],World:[162,73,103]};
export const BADGE_COLORS:Record<Badge,Color>={OFFICIAL:REGION_COLORS.Europe,CONFIRMED:REGION_COLORS.Oceania,REPORTED:REGION_COLORS.Asia,CLAIM:REGION_COLORS['Middle East']};
const SKY:Color=[219,226,222],STONE:Color=[236,229,213],SLATE:Color=[54,82,105],AMBER:Color=[214,139,51],RED:Color=[177,55,48],SEA:Color=[107,153,158];

export function labelInk(fill: Color): Color {
  return fill === REGION_COLORS.Asia ? COLORS.ink : COLORS.white;
}

function base(c:Canvas,x:number,y:number,w:number,h:number,night=false):void{c.rect(x,y,w,h,night?[34,54,69]:SKY);c.rect(x,y+h*.72,w,h*.28,night?[55,66,70]:STONE);}
function scene(c:Canvas,name:Scene,x:number,y:number,w:number,h:number):void{
  base(c,x,y,w,h,name==='asteroid');const hz=y+h*.72,b=y+h;
  if(name==='rocket'){c.circle(x+w*.70,y+14,7,AMBER);c.polygon([[x,hz],[x+w*.25,hz-10],[x+w*.5,hz],[x+w*.76,hz-8],[x+w,hz],[x+w,b],[x,b]],[202,177,126]);const r=x+w*.48;c.rect(r-12,y+14,3,hz-y-14,SLATE);c.polygon([[r+5,y+8],[r+12,y+21],[r+11,hz-5],[r+1,hz-5],[r,y+21]],COLORS.white);c.circle(r+6,y+22,2.5,SEA);c.polygon([[r+2,hz-4],[r+6,b-2],[r+10,hz-4]],RED);}
  else if(name==='market'||name==='stocks'){c.rect(x,hz,w,h*.28,[61,73,78]);for(let i=0;i<8;i++){const bh=8+(i%4)*5;c.rect(x+6+i*(w-12)/8,hz-bh,w*.065,bh,[95,115,116]);}c.rect(x+w*.56,y+8,w*.36,h*.5,[246,242,230]);const color=name==='stocks'?RED:RED;c.line(x+w*.59,y+16,x+w*.68,y+25,2.5,color);c.line(x+w*.68,y+25,x+w*.77,y+19,2.5,color);c.line(x+w*.77,y+19,x+w*.89,y+35,2.5,color);}
  else if (name === 'priceCap') {
    const higher = h * .57, lower = higher / 1.26;
    c.rect(x + w * .25, hz - lower, w * .14, lower, SLATE);
    c.rect(x + w * .43, hz - higher, w * .14, higher, AMBER);
    c.line(x + w * .19, hz, x + w * .63, hz, 1.5, SLATE);
  }
  else if(name==='tariffs'){c.rect(x,hz-5,w,h*.34,SEA);for(let i=0;i<5;i++)c.rect(x+8+i*w*.16,hz-14-(i%2)*8,w*.13,14+(i%2)*8,i%2?RED:AMBER);c.line(x+w*.78,y+7,x+w*.78,hz,2.5,SLATE);c.line(x+w*.78,y+8,x+w*.55,y+22,2.5,SLATE);c.polygon([[x+w*.08,hz+2],[x+w*.92,hz+2],[x+w*.79,hz+12],[x+w*.2,hz+12]],SLATE);}
  else if(name==='treaty'){c.polygon([[x+w*.12,hz],[x+w*.5,y+10],[x+w*.88,hz]],[201,194,174]);c.circle(x+w*.5,y+18,9,SLATE);c.rect(x+w*.18,hz-4,w*.64,4,SLATE);for(let i=0;i<5;i++)c.rect(x+w*(.27+i*.115),y+29,4,hz-y-29,SLATE);for(const dx of [.22,.78]){c.line(x+w*dx,y+7,x+w*dx,y+30,1.5,SLATE);c.polygon([[x+w*dx,y+8],[x+w*(dx+(dx<.5?.13:-.13)),y+12],[x+w*dx,y+17]],dx<.5?AMBER:SEA);}}
  else if(name==='court'){c.polygon([[x+w*.13,y+24],[x+w*.5,y+6],[x+w*.87,y+24]],SLATE);c.rect(x+w*.15,y+24,w*.7,4,SLATE);for(let i=0;i<5;i++)c.rect(x+w*(.22+i*.14),y+28,4,hz-y-28,SLATE);c.line(x+w*.5,y+12,x+w*.5,hz-5,1.5,AMBER);c.line(x+w*.36,y+20,x+w*.64,y+20,1.5,AMBER);c.circle(x+w*.35,y+26,5,AMBER);c.circle(x+w*.65,y+26,5,AMBER);}
  else if(name==='tankers'){c.rect(x,hz-6,w,h*.38,SEA);c.polygon([[x,hz],[x+w*.17,hz-16],[x+w*.32,hz],[x+w*.72,hz],[x+w*.86,hz-13],[x+w,hz]],[117,107,80]);for(const sx of [.28,.7]){c.polygon([[x+w*(sx-.15),hz+1],[x+w*(sx+.15),hz+1],[x+w*(sx+.1),hz+10],[x+w*(sx-.1),hz+10]],SLATE);c.rect(x+w*sx-6,hz-9,12,10,SLATE);}for(const sx of [.46,.56,.84])c.circle(x+w*sx,b-4,2.5,RED);}
  else if(name==='refinery'){c.rect(x,hz,w,h*.28,[84,89,84]);c.ellipse(x+w*.2,hz,w*.09,5,SLATE);c.rect(x+w*.11,hz,w*.18,h*.22,SLATE);c.rect(x+w*.43,y+13,w*.07,hz-y-13,SLATE);c.rect(x+w*.62,y+20,w*.1,hz-y-20,SLATE);c.polygon([[x+w*.46,y+12],[x+w*.5,y+3],[x+w*.54,y+13]],RED);c.polygon([[x+w*.08,y+11],[x+w*.34,y+16],[x+w*.18,y+21]],COLORS.ink);}
  else if(name==='rescue'){c.rect(x+w*.08,y+9,w*.84,hz-y-9,[218,207,184]);c.rect(x+w*.08,y+9,w*.84,9,RED);for(const dx of [.18,.42,.67])c.rect(x+w*dx,y+25,w*.16,hz-y-25,SLATE);c.rect(x+w*.58,hz+3,w*.27,8,[76,82,80]);for(const dx of [.2,.33,.47]){c.circle(x+w*dx,hz+2,2.5,AMBER);c.rect(x+w*dx-1.5,hz+4,3,8,COLORS.ink);}}
  else if(name==='port'){c.rect(x,hz-5,w,h*.34,SEA);c.polygon([[x+w*.1,hz+1],[x+w*.65,hz+1],[x+w*.57,hz+11],[x+w*.2,hz+11]],SLATE);c.line(x+w*.78,y+8,x+w*.78,hz,2.5,SLATE);c.line(x+w*.78,y+9,x+w*.56,y+21,2.5,SLATE);c.circle(x+w*.8,y+20,7,AMBER);c.circle(x+w*.85,y+15,4,RED);}
  else if(name==='clinic'){c.rect(x+w*.08,y+10,w*.84,hz-y-10,[216,211,196]);c.rect(x+w*.38,y+20,w*.24,hz-y-20,SLATE);c.rect(x+w*.46,y+6,w*.08,22,RED);c.rect(x+w*.4,y+13,w*.2,8,RED);for(const dx of [.2,.3,.7,.8]){c.circle(x+w*dx,hz+1,2.5,AMBER);c.rect(x+w*dx-1.5,hz+3,3,8,COLORS.ink);}}
  else if(name==='city'){c.rect(x,hz,w,h*.28,[75,82,82]);c.rect(x+w*.1,y+15,w*.19,hz-y-15,SLATE);c.rect(x+w*.35,y+8,w*.24,hz-y-8,SLATE);c.rect(x+w*.66,y+21,w*.17,hz-y-21,SLATE);c.line(x+w*.84,y+8,x+w*.84,hz,2,RED);c.line(x+w*.75,y+20,x+w*.91,y+20,2,RED);c.line(x+w*.78,y+14,x+w*.89,y+28,2,RED);}
  else if(name==='asteroid'){for(const p of [[.14,.24,1.5],[.3,.15,1],[.8,.18,1.3],[.68,.4,1]])c.circle(x+w*p[0],y+h*p[1],p[2],COLORS.white);c.circle(x+w*.68,y+h*.55,h*.2,[142,139,128]);c.circle(x+w*.58,y+h*.45,h*.09,[178,171,151]);c.polygon([[x+w*.2,y+h*.38],[x+w*.36,y+h*.43],[x+w*.26,y+h*.49]],COLORS.white);c.line(x+w*.1,y+h*.38,x+w*.38,y+h*.38,1.5,AMBER);}
}

function boxedLabel(c: Canvas, text: string, right: number, top: number, size: number, fill: Color): void {
  const width = textWidth(HALDEN_BOLD, text, size) + 12, height = size + 6;
  c.rect(right - width, top, width, height, fill);
  drawCentered(c, HALDEN_BOLD, text, right - width / 2, top + height / 2 - size * .59, size, labelInk(fill));
}

function cardScene(c: Canvas, story: LeadStory, x: number, y: number, w: number, h: number, hero: boolean): void {
  scene(c, story.scene, x, y, w, h);
  const radius = hero ? 11.5 : 10, inset = radius + 3, size = hero ? 14 : 12;
  const accent = REGION_COLORS[story.region];
  c.circle(x + inset, y + inset, radius, accent);
  drawCentered(c, HALDEN_BOLD, String(story.number), x + inset, y + inset - size * .59, size, labelInk(accent));
  const right = x + w - 3, calloutSize = hero ? 20 : 12;
  boxedLabel(c, story.badge, right, y + 3, hero ? 12 : MIN_TEXT_SIZE, BADGE_COLORS[story.badge]);
  boxedLabel(c, story.callout, right, y + h - 3 - (calloutSize + 6), calloutSize, COLORS.ink);
  const region = `${story.region} · ${story.place}`;
  drawText(c, HALDEN_BOLD, region, x, y + h + 1, fitSize(HALDEN_BOLD, region, hero ? 13 : 12, w, MIN_TEXT_SIZE), story.region === 'Asia' ? SLATE : accent);
}

function headline(c: Canvas, text: string, x: number, y: number, w: number, preferred: number, floor: number, step: number): void {
  const size = fitWrappedSize(MERIDIAN_BOLD, text, preferred, w, floor);
  balancedWrapText(MERIDIAN_BOLD, text, size, w).forEach((line, i) => drawText(c, MERIDIAN_BOLD, line, x, y + i * step, size, COLORS.ink));
}

function deck(c: Canvas, text: string, x: number, y: number, w: number, font: TrueTypeFont, preferred: number, step: number): void {
  const size = fitWrappedSize(font, text, preferred, w, MIN_TEXT_SIZE);
  let lines = balancedWrapText(font, text, size, w);
  if (lines.length === 2) {
    // Keep a whole clause (and its figures) together when the measure allows it.
    const boundary = text.indexOf('; ') >= 0 ? text.indexOf('; ') : text.indexOf(', ');
    if (boundary >= 0) {
      const clauses = [text.slice(0, boundary + 1), text.slice(boundary + 2)];
      if (clauses.every(line => textWidth(font, line, size) <= w)) lines = clauses;
    }
  }
  lines.forEach((line, i) => drawText(c, font, line, x, y + i * step, size, COLORS.ink));
}

export function drawHeroCard(c: Canvas, story: LeadStory, x: number, y: number, w: number, h: number): void {
  cardScene(c, story, x, y, w, 78, true);
  headline(c, story.headline, x, y + 92.5, w, 24, 21, 25.5);
  deck(c, story.deck, x, y + 146.5, w, HALDEN_BOLD, 14.5, 16);
  drawText(c, HALDEN, story.source, x, y + h - 14, fitSize(HALDEN, story.source, 12, w, MIN_TEXT_SIZE), SLATE);
}

export function drawMidCard(c: Canvas, story: LeadStory, x: number, y: number, w: number, h: number, compact = false): void {
  const sceneH = compact ? 44 : 48;
  cardScene(c, story, x, y, w, sceneH, false);
  headline(c, story.headline, x, y + sceneH + 15, w, compact ? 18 : 18.5, 16, compact ? 19 : 20.75);
  deck(c, story.deck, x, y + sceneH + (compact ? 57 : 59), w, HALDEN, 13, 14.5);
  drawText(c, HALDEN, story.source, x, y + h - 14, fitSize(HALDEN, story.source, 12, w, MIN_TEXT_SIZE), SLATE);
}
