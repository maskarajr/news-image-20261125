import { Canvas, COLORS, type Color } from './canvas.ts';
import { HALDEN, HALDEN_BOLD, MERIDIAN_BOLD, drawCentered, drawText } from './font.ts';
import { LEADS, PAGE, type Location } from './content.ts';
import { REGION_COLORS, type Box } from './stories.ts';
import { WORLD_LAND } from './world-land.ts';

export const MAP_BOX: Box = { x: 24, y: 754, w: 344, h: 177 };
export const PIN_RADIUS = 6.5;
const OCEAN: Color = [225, 235, 228], LAND: Color = [145, 165, 149];

// Natural Earth I projection. Land vertices and datelines use the same transform.
export function project([longitude, latitude]: Location): readonly [number, number] {
  const lambda = longitude * Math.PI / 180, phi = latitude * Math.PI / 180;
  const p2 = phi * phi, p4 = p2 * p2, p6 = p4 * p2;
  return [lambda * (.870700 - .131979 * p2 + p4 * (-.013791 + p6 * (.003971 - .001529 * p2))),
    -phi * (1.007226 + p2 * .015085 + p6 * (-.044475 + p2 * (.028874 - .005916 * p2)))];
}

const rings = WORLD_LAND.map(ring => ring.map(project));
const vertices = rings.flat();
const minX = Math.min(...vertices.map(p => p[0])), maxX = Math.max(...vertices.map(p => p[0]));
const minY = Math.min(...vertices.map(p => p[1])), maxY = Math.max(...vertices.map(p => p[1]));

function viewport({ x, y, w, h }: Box) {
  const scale = Math.min((w - 8) / (maxX - minX), (h - 8) / (maxY - minY));
  const left = x + (w - scale * (maxX - minX)) / 2, top = y + (h - scale * (maxY - minY)) / 2;
  return ([px, py]: readonly [number, number]): [number, number] => [left + (px - minX) * scale, top + (py - minY) * scale];
}

export function computePinCenters(box = MAP_BOX) {
  const screen = viewport(box);
  const pins = LEADS.map(({ number, region, location }) => {
    const [ax, ay] = screen(project(location));
    return { number, region, ax, ay, cx: ax, cy: ay };
  });
  const diameter = 2 * PIN_RADIUS;
  for (let i = 0; i < pins.length; i++) for (let j = i + 1; j < pins.length; j++) {
    const a = pins[i], b = pins[j], dx = b.cx - a.cx, dy = b.cy - a.cy, distance = Math.hypot(dx, dy);
    if (distance >= diameter) continue;
    const shift = (diameter + 1 - distance) / 2;
    const nx = distance ? dx / distance : 1, ny = distance ? dy / distance : 0;
    a.cx -= nx * shift; a.cy -= ny * shift;
    b.cx += nx * shift; b.cy += ny * shift;
    if (Math.hypot(a.cx - a.ax, a.cy - a.ay) > 3 || Math.hypot(b.cx - b.ax, b.cy - b.ay) > 3)
      throw new Error(`Map too small to separate pins ${a.number} and ${b.number} within 3 px`);
  }
  return pins;
}

export function drawLocator(c: Canvas): void {
  const { x, y, w, h } = MAP_BOX, screen = viewport(MAP_BOX);
  drawText(c, MERIDIAN_BOLD, PAGE.map, x, y - 26, 18, COLORS.ink);
  c.rect(x, y, w, h, COLORS.line);
  c.rect(x + 1, y + 1, w - 2, h - 2, OCEAN);
  for (const ring of rings) c.polygon(ring.map(screen), LAND);
  for (const pin of computePinCenters()) {
    c.circle(pin.cx, pin.cy, PIN_RADIUS, COLORS.white);
    c.circle(pin.cx, pin.cy, PIN_RADIUS - 1, REGION_COLORS[pin.region]);
    drawCentered(c, HALDEN_BOLD, String(pin.number), pin.cx, pin.cy - 5, 8.6, COLORS.white, -.15);
  }
  drawText(c, HALDEN, PAGE.mapCredit, x, y + h + 1, 10, COLORS.grey);
}
