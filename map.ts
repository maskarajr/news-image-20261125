import { Canvas, COLORS, type Color } from './canvas.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, drawCentered, drawText } from './font.ts';
import { MAP_POINTS, MAP_REGION_LABELS, PAGE, REGION_COUNTS, type MapPoint } from './content.ts';
import { REGION_COLORS } from './stories.ts';
import { WORLD_LAND } from './world-land.ts';

type GeoPoint=readonly[longitude:number,latitude:number];export type PinCenter={number:number;cx:number;cy:number;ax:number;ay:number};
const OCEAN:Color=[231,228,218],LAND:Color=[200,206,191],LEADER:Color=[91,104,96];
export function project([lon,lat]:GeoPoint):readonly[number,number]{const lam=lon*Math.PI/180,phi=lat*Math.PI/180,p2=phi*phi,p4=p2*p2,p6=p4*p2;return[lam*(.870700-.131979*p2+p4*(-.013791+p6*(.003971-.001529*p2))),-phi*(1.007226+p2*.015085+p6*(-.044475+p2*(.028874-.005916*p2)))];}
const PROJECTED=WORLD_LAND.map(ring=>ring.map(point=>project(point)));const vertices=PROJECTED.flat();const BOUNDS={minX:Math.min(...vertices.map(p=>p[0])),maxX:Math.max(...vertices.map(p=>p[0])),minY:Math.min(...vertices.map(p=>p[1])),maxY:Math.max(...vertices.map(p=>p[1]))};
const OFFSETS:Readonly<Record<number,readonly[number,number]>>={
  1:[-6,-2],2:[-8,8],3:[-8,8],4:[-10,-7],5:[-5,7],6:[9,-4],7:[9,-8],8:[0,7],9:[8,7],10:[8,6],11:[9,-3],12:[6,-11],13:[-5,-12],
  14:[8,8],15:[-8,7],16:[-7,-11],17:[9,7],18:[1,10],19:[9,-10],20:[2,-1],21:[-12,-4],22:[-9,5],23:[-7,-5],24:[-7,8],25:[4,9],26:[0,9],
  27:[0,2],28:[-10,-7],29:[9,-2],30:[7,-6],31:[-6,5],32:[13,2],33:[-8,9],
};
function transform([px,py]:readonly[number,number],x:number,y:number,w:number,h:number):readonly[number,number]{const pad=.01,rangeX=BOUNDS.maxX-BOUNDS.minX,rangeY=BOUNDS.maxY-BOUNDS.minY,sx=w*(1-pad*2)/rangeX,sy=Math.min(h*(1-pad*2)/rangeY,sx*1.22),usedW=rangeX*sx,usedH=rangeY*sy,left=x+(w-usedW)/2,top=y+(h-usedH)/2;return[left+(px-BOUNDS.minX)*sx,top+(py-BOUNDS.minY)*sy];}
function anchor(point:GeoPoint,x:number,y:number,w:number,h:number):readonly[number,number]{const adjusted:GeoPoint=[point[0],Math.max(-54.8,Math.min(72,point[1]))];return transform(project(adjusted),x,y,w,h);}
export function computePinCenters(x=24,y=671,w=332,h=230):PinCenter[]{return MAP_POINTS.map(p=>{const[a,b]=anchor(p.location,x,y,w,h),o=OFFSETS[p.number]??[0,0];return{number:p.number,ax:a,ay:b,cx:a+o[0],cy:b+o[1]};});}
function pin(c:Canvas,p:MapPoint,v:PinCenter):void{c.line(v.ax,v.ay,v.cx,v.cy,.9,LEADER);c.circle(v.ax,v.ay,1.1,LEADER);c.circle(v.cx,v.cy,5.4,COLORS.white);c.circle(v.cx,v.cy,4.6,REGION_COLORS[p.region]);drawCentered(c,HALDEN_BOLD,String(p.number),v.cx,v.cy-3.6,7.5,COLORS.white,p.number>9?-.35:0);}
export function drawLocator(c:Canvas,x:number,y:number,w:number):void{drawText(c,MERIDIAN_BOLD,PAGE.map,x,y,17,COLORS.ink);const mapY=y+24,mapH=230;c.rect(x,mapY,w,mapH,OCEAN);for(const ring of PROJECTED)c.polygon(ring.map(p=>transform(p,x,mapY,w,mapH)),LAND);const centers=computePinCenters(x,mapY,w,mapH);MAP_POINTS.forEach((p,i)=>pin(c,p,centers[i]));const widths=MAP_REGION_LABELS.map(label=>11+drawWidth(label)),total=widths.reduce((a,b)=>a+b,0)+6*(MAP_REGION_LABELS.length-1);let px=x+(w-total)/2;MAP_REGION_LABELS.forEach((label,i)=>{c.circle(px+3.5,y+265,3.5,REGION_COLORS[REGION_COUNTS[i].region]);drawText(c,HALDEN,label,px+9,y+260,8.5,COLORS.grey);px+=widths[i]+6;});}
function drawWidth(text:string):number{return text.length?text.split('').reduce((sum,char)=>sum+HALDEN.advance(char,8.5),0):0;}
