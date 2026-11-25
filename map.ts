import { Canvas, COLORS, type Color } from './canvas.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, drawCentered, drawText } from './font.ts';
import { MAP_POINTS, PAGE, REGION_COUNTS, type MapPoint } from './content.ts';
import { REGION_COLORS } from './stories.ts';

type GeoPoint=readonly[longitude:number,latitude:number];type PinCenter={number:number;cx:number;cy:number;ax:number;ay:number};
const OCEAN:Color=[231,228,218],LAND_FILL:Color=[200,206,191],COAST:Color=[91,104,96];
function project([longitude,latitude]:GeoPoint):readonly[number,number]{return[315+1.9794*longitude-0.00001994*longitude**3,308-1.6*latitude];}
const LAND:readonly(readonly GeoPoint[])[]=[
  [[-168,72],[-145,70],[-126,56],[-124,42],[-117,32],[-103,24],[-83,25],[-79,32],[-66,45],[-60,55],[-82,70],[-110,74],[-140,72]],
  [[-97,23],[-86,21],[-80,10],[-77,8],[-83,8],[-91,16]],[[-81,12],[-70,11],[-52,5],[-35,-8],[-42,-24],[-54,-55],[-69,-51],[-76,-25]],[[-55,60],[-48,82],[-22,80],[-18,65],[-38,59]],
  [[-11,36],[-10,58],[5,70],[30,72],[55,75],[90,72],[120,66],[150,59],[178,51],[160,38],[140,30],[122,18],[106,5],[82,8],[64,24],[48,30],[38,42],[20,38],[8,42]],
  [[-17,36],[7,37],[33,32],[51,12],[43,-12],[32,-35],[16,-35],[3,-25],[-10,0]],[[34,31],[49,30],[57,23],[53,13],[44,12],[39,24]],[[68,24],[78,29],[89,24],[82,7],[73,8]],
  [[95,21],[109,18],[120,8],[107,-7],[97,2]],[[112,-11],[132,-10],[154,-25],[151,-39],[132,-43],[115,-33]],[[130,32],[143,45],[146,39],[139,31]],[[47,-13],[51,-25],[47,-26],[44,-16]],
  [[166,-35],[178,-38],[174,-47],[167,-45]],[[-8,50],[2,58],[1,51]],[[-180,-62],[-120,-66],[-60,-64],[0,-67],[60,-65],[120,-68],[180,-63],[180,-78],[-180,-78]],
];
const OFFSETS:Readonly<Record<number,readonly[number,number]>>={
  1:[-8,-2],2:[-7,-15],3:[-11,13],4:[-10,-7],5:[-5,8],6:[15,-3],7:[12,-12],8:[0,8],9:[-16,14],10:[11,7],11:[5,13],12:[10,-13],13:[-14,-11],
  14:[12,13],15:[-10,12],16:[11,-5],17:[14,9],18:[1,14],19:[-1,-17],20:[-14,3],21:[-18,-9],22:[9,-8],23:[-8,-6],24:[-9,11],25:[-6,-14],26:[-14,-5],
  27:[0,2],28:[-14,-10],29:[10,8],30:[8,-8],31:[-7,5],32:[15,3],33:[11,11],
};
function fit(point:GeoPoint,x:number,y:number,w:number,h:number):readonly[number,number]{const[px,py]=project(point),minX=70,maxX=570,minY=170,maxY=425,s=Math.min((w-10)/(maxX-minX),(h-10)/(maxY-minY)),left=x+(w-(maxX-minX)*s)/2,top=y+(h-(maxY-minY)*s)/2;return[left+(px-minX)*s,top+(py-minY)*s];}
export function computePinCenters(x=24,y=658,w=332,h=192):PinCenter[]{return MAP_POINTS.map(p=>{const[a,b]=fit(p.location,x,y,w,h),o=OFFSETS[p.number]??[0,0];return{number:p.number,ax:a,ay:b,cx:a+o[0],cy:b+o[1]};});}
function outline(c:Canvas,p:readonly(readonly[number,number])[]):void{for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];c.line(a[0],a[1],b[0],b[1],1,COAST);}}
function pin(c:Canvas,p:MapPoint,center:PinCenter):void{c.line(center.ax,center.ay,center.cx,center.cy,1,COAST);c.circle(center.ax,center.ay,1.2,COAST);c.circle(center.cx,center.cy,5.4,COLORS.white);c.circle(center.cx,center.cy,4.6,REGION_COLORS[p.region]);drawCentered(c,HALDEN_BOLD,String(p.number),center.cx,center.cy-3.6,7.5,COLORS.white, p.number>9?-0.35:0);}
export function drawLocator(c:Canvas,x:number,y:number,w:number):void{drawText(c,MERIDIAN_BOLD,PAGE.map,x,y,17,COLORS.ink);const mapY=y+24,mapH=192;c.rect(x,mapY,w,mapH,OCEAN);for(const poly of LAND){const fp=poly.map(p=>fit(p,x,mapY,w,mapH));c.polygon(fp,LAND_FILL);outline(c,fp);}const centers=computePinCenters(x,mapY,w,mapH);MAP_POINTS.forEach((p,i)=>pin(c,p,centers[i]));
  REGION_COUNTS.forEach((r,i)=>{const col=i%3,row=Math.floor(i/3),px=x+col*108,py=y+222+row*15;c.circle(px+4,py+5,4,REGION_COLORS[r.region]);drawText(c,HALDEN,`${r.region} ${r.count}`,px+11,py,9.5,COLORS.grey);});
  drawText(c,HALDEN,'Canberra 4/29 offset',x+118,y+252,9.5,COLORS.grey);
}
