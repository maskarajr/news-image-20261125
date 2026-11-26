import { Canvas, COLORS, type Color } from './canvas.ts';
import { HALDEN_BOLD, MERIDIAN_BOLD, MIN_TEXT_SIZE, drawText, inkBounds, textWidth } from './font.ts';
import { MAP_POINTS, MAP_REGION_LABELS, PAGE, REGION_COUNTS, type MapPoint } from './content.ts';
import { REGION_COLORS, labelInk } from './stories.ts';
import { WORLD_LAND } from './world-land.ts';

type GeoPoint = MapPoint['location'];
export type PinCenter = {number: number; cx: number; cy: number; ax: number; ay: number; radius: number; inkCenterX: number; inkCenterY: number};
const OCEAN:Color=[231,228,218],LAND:Color=[200,206,191],LEADER:Color=[91,104,96];
export function project([lon,lat]:GeoPoint):readonly[number,number]{const lam=lon*Math.PI/180,phi=lat*Math.PI/180,p2=phi*phi,p4=p2*p2,p6=p4*p2;return[lam*(.870700-.131979*p2+p4*(-.013791+p6*(.003971-.001529*p2))),-phi*(1.007226+p2*.015085+p6*(-.044475+p2*(.028874-.005916*p2)))];}
const PROJECTED=WORLD_LAND.map(ring=>ring.map(point=>project(point)));const vertices=PROJECTED.flat();const BOUNDS={minX:Math.min(...vertices.map(p=>p[0])),maxX:Math.max(...vertices.map(p=>p[0])),minY:Math.min(...vertices.map(p=>p[1])),maxY:Math.max(...vertices.map(p=>p[1]))};
function transform([px,py]:readonly[number,number],x:number,y:number,w:number,h:number):readonly[number,number]{const pad=.01,rangeX=BOUNDS.maxX-BOUNDS.minX,rangeY=BOUNDS.maxY-BOUNDS.minY,sx=w*(1-pad*2)/rangeX,sy=Math.min(h*(1-pad*2)/rangeY,sx*1.22),usedW=rangeX*sx,usedH=rangeY*sy,left=x+(w-usedW)/2,top=y+(h-usedH)/2;return[left+(px-BOUNDS.minX)*sx,top+(py-BOUNDS.minY)*sy];}
export const MAP_WIDTH = 332, MAP_HEIGHT = 230;
export const PIN_RIM = .8;
const PIN_SIZE = MIN_TEXT_SIZE, PIN_GAP = 1.5, MAX_LEADER = 14;

export function computePinCenters(x = 0, y = 0, w = MAP_WIDTH, h = MAP_HEIGHT): PinCenter[] {
  const centers = MAP_POINTS.map(({number, location}) => {
    const [ax, ay] = transform(project(location), x, y, w, h);
    const ink = inkBounds({font: HALDEN_BOLD, text: String(number), size: PIN_SIZE, x: 0, y: 0, letterSpacing: 0});
    const inkCenterX = (ink.left + ink.right) / 2, inkCenterY = (ink.top + ink.bottom) / 2;
    // Enclose all four ink-box corners, with room for coloured padding and the rim.
    const radius = Math.hypot(ink.right - ink.left, ink.bottom - ink.top) / 2 + 2;
    return {number, ax, ay, cx: ax, cy: ay, radius, inkCenterX, inkCenterY};
  });

  // Separate neighbouring outlines, then project each centre back into its
  // allowed 14px disk. The gentle pull keeps uncrowded pins on their anchors.
  for (let pass = 0; pass < 150; pass++) {
    const pull = .04 * (1 - pass / 150) ** 2;
    for (const p of centers) {
      p.cx += (p.ax - p.cx) * pull;
      p.cy += (p.ay - p.cy) * pull;
    }
    for (const [i, a] of centers.entries()) {
      for (let j = i + 1; j < centers.length; j++) {
        const b = centers[j], dx = b.cx - a.cx, dy = b.cy - a.cy, distance = Math.hypot(dx, dy);
        const overlap = a.radius + b.radius + PIN_GAP - distance;
        if (overlap <= 0) continue;
        // Identical coordinates (the two Canberra stories) split horizontally.
        const shiftX = (distance ? dx / distance : 1) * overlap / 2;
        const shiftY = (distance ? dy / distance : 0) * overlap / 2;
        a.cx -= shiftX; a.cy -= shiftY;
        b.cx += shiftX; b.cy += shiftY;
      }
    }
    for (const p of centers) {
      p.cx = Math.min(x + w - p.radius, Math.max(x + p.radius, p.cx));
      p.cy = Math.min(y + h - p.radius, Math.max(y + p.radius, p.cy));
      const dx = p.cx - p.ax, dy = p.cy - p.ay, length = Math.hypot(dx, dy);
      if (length > MAX_LEADER) {
        p.cx = p.ax + dx * MAX_LEADER / length;
        p.cy = p.ay + dy * MAX_LEADER / length;
      }
    }
  }
  return centers;
}

function regionLegend(c: Canvas, x: number, y: number): void {
  const size = 12, columns = 4;
  const widths = MAP_REGION_LABELS.map(label => 12 + textWidth(HALDEN_BOLD, label, size));
  let left = x;
  MAP_REGION_LABELS.forEach((label, i) => {
    const col = i % columns, top = y + Math.floor(i / columns) * 17;
    if (col === 0) left = x;
    c.circle(left + 3.5, top + 7, 3.5, REGION_COLORS[REGION_COUNTS[i].region]);
    drawText(c, HALDEN_BOLD, label, left + 11, top, size, COLORS.ink);
    left += Math.max(widths[col], widths[col + columns] ?? 0) + 12;
  });
}

export function drawLocator(c: Canvas, x: number, y: number, w: number): void {
  drawText(c, MERIDIAN_BOLD, PAGE.map, x, y, 17, COLORS.ink);
  const mapY = y + 24;
  c.rect(x, mapY, w, MAP_HEIGHT, OCEAN);
  for (const ring of PROJECTED) c.polygon(ring.map(p => transform(p, x, mapY, w, MAP_HEIGHT)), LAND);
  const centers = computePinCenters(x, mapY, w);
  for (const p of centers) {
    c.line(p.ax, p.ay, p.cx, p.cy, 1, LEADER);
    c.circle(p.ax, p.ay, 1.4, LEADER);
  }
  centers.forEach((p, i) => {
    const accent = REGION_COLORS[MAP_POINTS[i].region];
    c.circle(p.cx, p.cy, p.radius, COLORS.white);
    c.circle(p.cx, p.cy, p.radius - PIN_RIM, accent);
    drawText(c, HALDEN_BOLD, String(p.number), p.cx - p.inkCenterX, p.cy - p.inkCenterY, PIN_SIZE, labelInk(accent));
  });
  regionLegend(c, x, mapY + MAP_HEIGHT + 5);
}
