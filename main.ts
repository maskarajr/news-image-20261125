import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Canvas, COLORS } from './canvas.ts';
import { ALL_DRAWN_STRINGS, DATE_PARAGRAPH, KICKERS, LEADS, PAGE, STATS, WIRES } from './content.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, drawCentered, drawText, fitSize, textWidth, wrapText } from './font.ts';
import { drawLocator } from './map.ts';
import { drawHeroLead, drawMidLead } from './stories.ts';
import { encodePng } from './png.ts';

const WIDTH=1024,HEIGHT=1024,canvas=new Canvas(WIDTH,HEIGHT,2,[246,241,229]);
const INK=COLORS.ink, MUTED:[number,number,number]=[91,98,96], STONE:[number,number,number]=[236,229,213], RED:[number,number,number]=[177,55,48];

function masthead():void{
  canvas.rect(24,0,976,2,INK);
  drawText(canvas,HALDEN_BOLD,PAGE.runningLeft,24,5,12,INK);
  drawText(canvas,HALDEN_BOLD,PAGE.runningRight,1000-textWidth(HALDEN_BOLD,PAGE.runningRight,12),5,12,INK);
  canvas.line(24,22,1000,22,1,[126,127,119]);
  drawCentered(canvas,MERIDIAN_BOLD,PAGE.date,512,25,64,INK,-0.35);
  canvas.line(24,96,1000,96,1.5,INK);
  const auditSize=fitSize(HALDEN,PAGE.audit,12.5,960,11.5);
  drawCentered(canvas,HALDEN,PAGE.audit,512,101,auditSize,MUTED);
  canvas.line(24,121,1000,121,1,[172,169,158]);
}

function kicker():void{
  const widths=KICKERS.map((item)=>textWidth(MERIDIAN_BOLD,item,16));
  const diamond=12,total=widths.reduce((a,b)=>a+b,0)+diamond*2+48;
  let x=(1024-total)/2;
  KICKERS.forEach((item,index)=>{
    drawText(canvas,MERIDIAN_BOLD,item,x,127,16,INK);x+=widths[index]+16;
    if(index<2){canvas.polygon([[x+6,133],[x+11,138],[x+6,143],[x+1,138]],[185,112,33]);x+=diamond+8;}
  });
}

function stats():void{
  const x=24,y=154,width=976,cell=width/STATS.length;canvas.rect(x,y,width,56,STONE);
  STATS.forEach(([value,label],index)=>{const left=x+index*cell;if(index)canvas.rect(left,y+8,1,40,[202,196,181]);
    drawCentered(canvas,HALDEN_BOLD,value,left+cell/2,y+4,29,index===0?RED:INK);
    const size=fitSize(HALDEN,label,12.5,cell-10,11.5);drawCentered(canvas,HALDEN,label,left+cell/2,y+37,size,MUTED);
  });
}

function leads():void{
  const heroX=[24,354,684];LEADS.slice(0,3).forEach((story,index)=>drawHeroLead(canvas,story,heroX[index],216,316,225));
  const gap=8,width=(976-gap*4)/5;LEADS.slice(3).forEach((story,index)=>drawMidLead(canvas,story,24+index*(width+gap),449,width,224));
  canvas.line(24,680,1000,680,1,INK);
}

function wires():void{
  const x=306,y=686,width=694,colWidth=337;drawText(canvas,MERIDIAN_BOLD,PAGE.wires,x,y,19,INK);
  WIRES.forEach((story,index)=>{const col=index<6?0:1,row=col===0?index:index-6,left=x+col*(colWidth+20),top=y+27+row*36;
    canvas.circle(left+8,top+8,8,[47,79,105]);drawCentered(canvas,HALDEN_BOLD,String(story.number),left+8,top+3,10,COLORS.white);
    const line=`${story.place} · ${story.summary}`,available=colWidth-24,size=fitSize(HALDEN_BOLD,line,13,available,13);
    drawText(canvas,HALDEN_BOLD,line,left+22,top,size,INK);
    const sourceSize=fitSize(HALDEN,story.source,13,available,13);drawText(canvas,HALDEN,story.source,left+22,top+16,sourceSize,MUTED);
    if(row<(col===0?5:4))canvas.line(left+22,top+31,left+colWidth,top+31,1,[215,210,198]);
  });
}

function dateCheck():void{
  const y=936;canvas.line(24,y-5,1000,y-5,1.5,INK);canvas.rect(24,y,4,80,RED);
  drawText(canvas,HALDEN_BOLD,PAGE.dateLabel,36,y+2,13,RED);
  const textX=126,textWidthMax=874,size=12.5,lines=wrapText(HALDEN,DATE_PARAGRAPH,size,textWidthMax);
  lines.slice(0,5).forEach((line,index)=>drawText(canvas,HALDEN,line,textX,y+index*15,size,INK));
}

if(!ALL_DRAWN_STRINGS.length)throw new Error('Text registry is empty');
masthead();kicker();stats();leads();drawLocator(canvas,24,686,270,226);wires();dateCheck();canvas.rect(24,1019,976,5,[214,139,51]);

const outputDirectory=process.env.MAKEFUN_OUTPUT_DIR??'/output';mkdirSync(outputDirectory,{recursive:true});
const outputPath=join(outputDirectory,'entry.png'),png=encodePng(WIDTH,HEIGHT,canvas.downsample());writeFileSync(outputPath,png);
console.log(`Wrote ${outputPath} (${png.length} bytes)`);
