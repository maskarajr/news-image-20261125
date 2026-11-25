import { Canvas, COLORS, type Color } from './canvas.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, drawCentered, drawText, fitSize } from './font.ts';
import { MAP_POINTS, PAGE, type MapPoint, type Region } from './content.ts';

type GeoPoint = readonly [longitude: number, latitude: number];
const OCEAN: Color = [231, 228, 218], LAND_FILL: Color = [200, 206, 191], COAST: Color = [91, 104, 96];
const PIN_COLORS: Record<Region, Color> = {
  Asia:[185,112,33], Oceania:[35,112,113], 'Middle East':[177,55,48], Europe:[47,79,105], Americas:[100,72,120], World:[162,73,103],
};

function project([longitude, latitude]: GeoPoint): readonly [number, number] {
  const x = 315 + 1.9794 * longitude - 0.00001994 * longitude ** 3;
  const y = 308 - 1.6 * latitude;
  return [x, y];
}

const LAND: readonly (readonly GeoPoint[])[] = [
  [[-168,72],[-145,70],[-126,56],[-124,42],[-117,32],[-103,24],[-83,25],[-79,32],[-66,45],[-60,55],[-82,70],[-110,74],[-140,72]],
  [[-97,23],[-86,21],[-80,10],[-77,8],[-83,8],[-91,16]],
  [[-81,12],[-70,11],[-52,5],[-35,-8],[-42,-24],[-54,-55],[-69,-51],[-76,-25]],
  [[-55,60],[-48,82],[-22,80],[-18,65],[-38,59]],
  [[-11,36],[-10,58],[5,70],[30,72],[55,75],[90,72],[120,66],[150,59],[178,51],[160,38],[140,30],[122,18],[106,5],[82,8],[64,24],[48,30],[38,42],[20,38],[8,42]],
  [[-17,36],[7,37],[33,32],[51,12],[43,-12],[32,-35],[16,-35],[3,-25],[-10,0]],
  [[34,31],[49,30],[57,23],[53,13],[44,12],[39,24]], [[68,24],[78,29],[89,24],[82,7],[73,8]],
  [[95,21],[109,18],[120,8],[107,-7],[97,2]], [[112,-11],[132,-10],[154,-25],[151,-39],[132,-43],[115,-33]],
  [[130,32],[143,45],[146,39],[139,31]], [[47,-13],[51,-25],[47,-26],[44,-16]], [[166,-35],[178,-38],[174,-47],[167,-45]],
  [[-8,50],[2,58],[1,51]], [[-180,-62],[-120,-66],[-60,-64],[0,-67],[60,-65],[120,-68],[180,-63],[180,-78],[-180,-78]],
];

const OFFSETS: Readonly<Record<number, readonly [number, number]>> = {
  1:[-10,-2],2:[-9,-14],3:[8,14],4:[-10,11],5:[10,-6],6:[5,11],7:[-14,-7],8:[6,-2],9:[-8,6],
  10:[-12,12],11:[0,-13],12:[11,-2],13:[10,-9],14:[-4,12],15:[-9,-8],16:[0,6],17:[4,11],18:[-9,-5],19:[14,-6],
};

function fit(point: GeoPoint, x: number, y: number, width: number, height: number): readonly [number, number] {
  const [px, py] = project(point); const minX=70,maxX=570,minY=170,maxY=425;
  const scale=Math.min((width-10)/(maxX-minX),(height-10)/(maxY-minY));
  const left=x+(width-(maxX-minX)*scale)/2, top=y+(height-(maxY-minY)*scale)/2;
  return [left+(px-minX)*scale,top+(py-minY)*scale];
}

function outline(c: Canvas, points: readonly (readonly [number, number])[]): void {
  for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];c.line(a[0],a[1],b[0],b[1],1,COAST);}
}

function pin(c: Canvas, point: MapPoint, x: number, y: number, width: number, height: number): void {
  const anchor=fit(point.location,x,y,width,height),offset=OFFSETS[point.number]??[0,0],cx=anchor[0]+offset[0],cy=anchor[1]+offset[1];
  c.line(anchor[0],anchor[1],cx,cy,1,COAST); c.circle(anchor[0],anchor[1],1.5,COAST); c.circle(cx,cy,6.5,COLORS.white); c.circle(cx,cy,5.2,PIN_COLORS[point.region]);
  drawCentered(c,HALDEN_BOLD,String(point.number),cx,cy-4.5,8.5,COLORS.white,point.number>9?-0.5:0);
}

export function drawLocator(c: Canvas,x:number,y:number,width:number,height:number):void{
  drawText(c,MERIDIAN_BOLD,PAGE.map,x,y,18,COLORS.ink);
  const mapY=y+24,mapHeight=154;c.rect(x,mapY,width,mapHeight,OCEAN);
  for(const polygon of LAND){const fitted=polygon.map((p)=>fit(p,x,mapY,width,mapHeight));c.polygon(fitted,LAND_FILL);outline(c,fitted);}
  for(const point of MAP_POINTS) pin(c,point,x,mapY,width,mapHeight);
  const s1=fitSize(HALDEN,PAGE.mapLegendOne,11.5,width,10);drawText(c,HALDEN,PAGE.mapLegendOne,x,y+184,s1,COLORS.grey);
  const s2=fitSize(HALDEN,PAGE.mapLegendTwo,11.5,width,10);drawText(c,HALDEN,PAGE.mapLegendTwo,x,y+199,s2,COLORS.grey);
}
