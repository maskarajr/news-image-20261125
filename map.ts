import { Canvas, COLORS, type Color } from './canvas.ts';
import { drawCentered, drawText } from './font.ts';
import { REGION_COLORS, STORIES, type NewsStory } from './stories.ts';

type GeoPoint = readonly [longitude: number, latitude: number];

// Compact pseudocylindrical projection retained from the original edition.
function project([longitude, latitude]: GeoPoint): readonly [number, number] {
  const x = 315 + 1.9794 * longitude - 0.00001994 * longitude ** 3;
  const y = 308 - 1.6 * latitude;
  return [x, y];
}

// Simplified, offline world coastlines in lon/lat, comparable in detail to a
// tiny Natural Earth overview. Every point is passed through project().
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
];

const PIN_OFFSETS: Readonly<Record<number, readonly [number, number]>> = {
  1: [-5, 2], 2: [-8, 0], 3: [8, 7], 4: [-3, 8], 5: [7, -7],
  6: [-7, -4], 7: [7, 5], 8: [-8, 6], 9: [-2, -7], 10: [10, 5],
  11: [6, -7], 12: [6, 5], 13: [-7, -4], 14: [0, 0], 15: [-7, 5], 16: [7, -5],
};

function fitPoint(point: GeoPoint, x: number, y: number, width: number, height: number): readonly [number, number] {
  const [px, py] = project(point);
  const minX = 70, maxX = 560, minY = 170, maxY = 405;
  const scale = Math.min((width - 16) / (maxX - minX), (height - 28) / (maxY - minY));
  const drawnWidth = (maxX - minX) * scale;
  const drawnHeight = (maxY - minY) * scale;
  const left = x + (width - drawnWidth) / 2;
  const top = y + (height - drawnHeight) / 2;
  return [left + (px - minX) * scale, top + (py - minY) * scale];
}

function pin(c: Canvas, story: NewsStory, x: number, y: number, width: number, height: number): void {
  const anchor = fitPoint(story.location, x, y, width, height);
  const offset = PIN_OFFSETS[story.number] ?? [0, 0];
  const cx = anchor[0] + offset[0];
  const cy = anchor[1] + offset[1];
  const color = REGION_COLORS[story.region];
  c.line(anchor[0], anchor[1], cx, cy, 1, COLORS.white);
  c.circle(anchor[0], anchor[1], 1.5, COLORS.white);
  c.circle(cx, cy, 6.5, COLORS.white);
  c.circle(cx, cy, 5, color);
  drawCentered(c, String(story.number), cx, cy - 2.6, story.number > 9 ? 0.55 : 0.72, COLORS.ink, 0.25);
}

export function drawLocatorMap(c: Canvas, x: number, y: number, width: number, height: number): void {
  c.rect(x, y, width, height, COLORS.ink);
  for (const lat of [-30, 0, 30, 60]) {
    const left = fitPoint([-175, lat], x, y, width, height);
    const right = fitPoint([175, lat], x, y, width, height);
    c.line(left[0], left[1], right[0], right[1], 0.7, [49, 76, 94]);
  }
  for (const outline of LAND) c.polygon(outline.map((point) => fitPoint(point, x, y, width, height)), COLORS.paleTeal);
  for (const story of STORIES) pin(c, story, x, y, width, height);
}

export function drawRegionKey(c: Canvas, x: number, y: number): void {
  const entries: readonly [string, number, Color][] = [
    ['ASIA', 5, REGION_COLORS.ASIA], ['OCEANIA', 2, REGION_COLORS.OCEANIA],
    ['M.E.', 3, REGION_COLORS['MIDDLE EAST']], ['EUROPE', 3, REGION_COLORS.EUROPE],
    ['AMERICAS', 2, REGION_COLORS.AMERICAS], ['WORLD', 1, REGION_COLORS.WORLD],
  ];
  entries.forEach(([label, count, color], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const px = x + col * 164;
    const py = y + row * 17;
    c.rect(px, py + 1, 9, 9, color);
    drawText(c, `${label} ${count}`, px + 14, py, 0.9, COLORS.ink, 0.55);
  });
}
