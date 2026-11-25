import { Canvas, COLORS } from './canvas.ts';
import { MAP_POINTS, PAGE, type MapPoint } from './content.ts';
import { drawCentered, drawText, textWidth } from './font.ts';
import { REGION_COLORS } from './stories.ts';

type GeoPoint = readonly [longitude: number, latitude: number];

// Required compact pseudocylindrical projection.
function project([longitude, latitude]: GeoPoint): readonly [number, number] {
  const x = 315 + 1.9794 * longitude - 0.00001994 * longitude ** 3;
  const y = 308 - 1.6 * latitude;
  return [x, y];
}

// Offline simplified world coastline set in lon/lat.
const LAND: readonly (readonly GeoPoint[])[] = [
  [[-168,72],[-145,70],[-126,56],[-124,42],[-117,32],[-103,24],[-83,25],[-79,32],[-66,45],[-60,55],[-82,70],[-110,74],[-140,72]],
  [[-97,23],[-86,21],[-80,10],[-77,8],[-83,8],[-91,16]],
  [[-81,12],[-70,11],[-52,5],[-35,-8],[-42,-24],[-54,-55],[-69,-51],[-76,-25]],
  [[-55,60],[-48,82],[-22,80],[-18,65],[-38,59]],
  [[-11,36],[-10,58],[5,70],[30,72],[55,75],[90,72],[120,66],[150,59],[178,51],[160,38],[140,30],[122,18],[106,5],[82,8],[64,24],[48,30],[38,42],[20,38],[8,42]],
  [[-17,36],[7,37],[33,32],[51,12],[43,-12],[32,-35],[16,-35],[3,-25],[-10,0]],
  [[34,31],[49,30],[57,23],[53,13],[44,12],[39,24]],
  [[68,24],[78,29],[89,24],[82,7],[73,8]],
  [[95,21],[109,18],[120,8],[107,-7],[97,2]],
  [[112,-11],[132,-10],[154,-25],[151,-39],[132,-43],[115,-33]],
  [[130,32],[143,45],[146,39],[139,31]],
  [[47,-13],[51,-25],[47,-26],[44,-16]],
  [[166,-35],[178,-38],[174,-47],[167,-45]],
  [[-8,50],[2,58],[1,51]],
  [[-180,-62],[-120,-66],[-60,-64],[0,-67],[60,-65],[120,-68],[180,-63],[180,-78],[-180,-78]],
];

const OFFSETS: Readonly<Record<number, readonly [number, number]>> = {
  1:[-13,-3], 2:[-12,-19], 3:[11,18], 4:[-13,14], 5:[13,-7], 6:[7,14],
  7:[-20,-10], 8:[8,-3], 9:[-10,8], 10:[-16,16], 11:[-10,-16], 12:[14,-3],
  13:[13,-12], 14:[2,14], 15:[-12,-10], 16:[0,8], 17:[5,15], 18:[-12,-6], 19:[18,-8],
};

function fit(point: GeoPoint, x: number, y: number, width: number, height: number): readonly [number, number] {
  const [px, py] = project(point);
  const minX = 70, maxX = 570, minY = 170, maxY = 425;
  const scale = Math.min((width - 14) / (maxX - minX), (height - 14) / (maxY - minY));
  const usedWidth = (maxX - minX) * scale;
  const usedHeight = (maxY - minY) * scale;
  const left = x + (width - usedWidth) / 2;
  const top = y + (height - usedHeight) / 2;
  return [left + (px - minX) * scale, top + (py - minY) * scale];
}

function drawPin(c: Canvas, point: MapPoint, x: number, y: number, width: number, height: number): void {
  const anchor = fit(point.location, x, y, width, height);
  const offset = OFFSETS[point.number] ?? [0, 0];
  const cx = anchor[0] + offset[0], cy = anchor[1] + offset[1];
  const color = REGION_COLORS[point.region];
  c.line(anchor[0], anchor[1], cx, cy, 1.2, COLORS.white);
  c.circle(anchor[0], anchor[1], 2, COLORS.white);
  c.circle(cx, cy, 10.5, COLORS.white);
  c.circle(cx, cy, 8.5, color);
  drawCentered(c, String(point.number), cx, cy - 7, 14, COLORS.ink, 0.01, point.number > 9 ? 0.58 : 0.72);
}

function fittedText(c: Canvas, text: string, x: number, y: number, width: number, color = COLORS.ink): void {
  const preferred = 0.72;
  const natural = textWidth(text, 14, 0.01, preferred);
  const scale = natural > width ? preferred * width / natural : preferred;
  drawText(c, text, x, y, 14, color, 0.01, scale);
}

export function drawLocator(c: Canvas, x: number, y: number, width: number): void {
  c.rect(x, y, width, 23, COLORS.blue);
  drawText(c, PAGE.mapSection, x + 8, y + 5, 14, COLORS.white, 0.02, 0.72);
  const mapY = y + 27, mapHeight = 181;
  c.rect(x, mapY, width, mapHeight, COLORS.ink);
  for (const outline of LAND) c.polygon(outline.map((point) => fit(point, x, mapY, width, mapHeight)), COLORS.paleTeal);
  for (const point of MAP_POINTS) drawPin(c, point, x, mapY, width, mapHeight);

  fittedText(c, PAGE.mapLegendOne, x, y + 216, width, COLORS.orange);
  fittedText(c, PAGE.mapLegendTwo, x, y + 234, width, COLORS.blue);
  fittedText(c, PAGE.mapKey, x, y + 254, width, COLORS.grey);
}
