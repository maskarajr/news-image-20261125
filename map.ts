import { Canvas, COLORS, type Color } from './canvas.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, drawCentered, drawText } from './font.ts';
import { MAP_POINTS, PAGE, REGION_COUNTS, type MapPoint } from './content.ts';
import { REGION_COLORS } from './stories.ts';
import { WORLD_LAND } from './world-land.ts';

type GeoPoint=readonly[longitude:number,latitude:number];export type PinCenter={number:number;cx:number;cy:number;ax:number;ay:number};
const OCEAN:Color=[231,228,218],LAND:Color=[200,206,191],LEADER:Color=[91,104,96];
export function project([lon,lat]:GeoPoint):readonly[number,number]{const lam=lon*Math.PI/180,phi=lat*Math.PI/180,p2=phi*phi,p4=p2*p2,p6=p4*p2;return[lam*(.870700-.131979*p2+p4*(-.013791+p6*(.003971-.001529*p2))),-phi*(1.007226+p2*.015085+p6*(-.044475+p2*(.028874-.005916*p2)))];}
const PROJECTED=WORLD_LAND.map(ring=>ring.map(point=>project(point)));const vertices=PROJECTED.flat();const BOUNDS={minX:Math.min(...vertices.map(p=>p[0])),maxX:Math.max(...vertices.map(p=>p[0])),minY:Math.min(...vertices.map(p=>p[1])),maxY:Math.max(...vertices.map(p=>p[1]))};
const OFFSETS:Readonly<Record<number,readonly[number,number]>>={
  1:[-8,-2],2:[-7,-15],3:[-11,13],4:[-10,-7],5:[-5,8],6:[15,-3],7:[12,-12],8:[0,8],9:[-16,14],10:[11,7],11:[5,13],12:[10,-13],13:[-14,-18],
  14:[12,13],15:[-10,12],16:[11,-5],17:[14,9],18:[1,14],19:[-1,-17],20:[-14,3],21:[-18,-9],22:[9,-8],23:[-8,-6],24:[-9,11],25:[0,-18],26:[-14,-5],
  27:[0,2],28:[-14,-10],29:[10,8],30:[8,-8],31:[-7,5],32:[15,3],33:[-2,15],
};
function transform([px,py]:readonly[number,number],x:number,y:number,w:number,h:number):readonly[number,number]{const pad=.02,s=Math.min(w*(1-pad*2)/(BOUNDS.maxX-BOUNDS.minX),h*(1-pad*2)/(BOUNDS.maxY-BOUNDS.minY)),usedW=(BOUNDS.maxX-BOUNDS.minX)*s,usedH=(BOUNDS.maxY-BOUNDS.minY)*s,left=x+(w-usedW)/2,top=y+(h-usedH)/2;return[left+(px-BOUNDS.minX)*s,top+(py-BOUNDS.minY)*s];}
function anchor(point:GeoPoint,x:number,y:number,w:number,h:number):readonly[number,number]{const adjusted:GeoPoint=[point[0],Math.max(-59.2,Math.min(75,point[1]))];return transform(project(adjusted),x,y,w,h);}
export function computePinCenters(x=24,y=658,w=332,h=192):PinCenter[]{return MAP_POINTS.map(p=>{const[a,b]=anchor(p.location,x,y,w,h),o=OFFSETS[p.number]??[0,0];return{number:p.number,ax:a,ay:b,cx:a+o[0],cy:b+o[1]};});}
function pin(c:Canvas,p:MapPoint,v:PinCenter):void{c.line(v.ax,v.ay,v.cx,v.cy,.9,LEADER);c.circle(v.ax,v.ay,1.1,LEADER);c.circle(v.cx,v.cy,5.4,COLORS.white);c.circle(v.cx,v.cy,4.6,REGION_COLORS[p.region]);drawCentered(c,HALDEN_BOLD,String(p.number),v.cx,v.cy-3.6,7.5,COLORS.white,p.number>9?-.35:0);}
export function drawLocator(c:Canvas,x:number,y:number,w:number):void{drawText(c,MERIDIAN_BOLD,PAGE.map,x,y,17,COLORS.ink);const mapY=y+24,mapH=192;c.rect(x,mapY,w,mapH,OCEAN);for(const ring of PROJECTED)c.polygon(ring.map(p=>transform(p,x,mapY,w,mapH)),LAND);const centers=computePinCenters(x,mapY,w,mapH);MAP_POINTS.forEach((p,i)=>pin(c,p,centers[i]));REGION_COUNTS.forEach((r,i)=>{const col=i%3,row=Math.floor(i/3),px=x+col*108,py=y+222+row*15;c.circle(px+4,py+5,4,REGION_COLORS[r.region]);drawText(c,HALDEN,`${r.region} ${r.count}`,px+11,py,9.5,COLORS.grey);});}
