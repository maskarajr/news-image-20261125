export type Color = readonly [number, number, number, number?];

export interface TextBounds { left: number; top: number; right: number; bottom: number }

export const COLORS = {
  ink: [15, 32, 47] as Color,
  paper: [244, 239, 226] as Color,
  white: [255, 252, 243] as Color,
  red: [201, 55, 50] as Color,
  orange: [239, 145, 48] as Color,
  teal: [41, 124, 126] as Color,
  paleTeal: [171, 207, 195] as Color,
  blue: [45, 85, 117] as Color,
  grey: [106, 111, 108] as Color,
  line: [203, 196, 180] as Color,
} as const;

export class Canvas {
  readonly pixels: Uint8Array;
  readonly width: number;
  readonly height: number;
  readonly scale: number;
  // Optional ink measurements for the text audit, in final (not supersampled) pixels.
  onText?: (text: string, bounds: TextBounds) => void;

  constructor(
    width: number,
    height: number,
    scale = 2,
    background: Color = COLORS.paper,
  ) {
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.pixels = new Uint8Array(width * scale * height * scale * 4);
    this.clear(background);
  }

  get physicalWidth(): number { return this.width * this.scale; }
  get physicalHeight(): number { return this.height * this.scale; }

  clear(color: Color): void {
    const [r, g, b, a = 255] = color;
    for (let i = 0; i < this.pixels.length; i += 4) {
      this.pixels[i] = r;
      this.pixels[i + 1] = g;
      this.pixels[i + 2] = b;
      this.pixels[i + 3] = a;
    }
  }

  private setPhysical(x: number, y: number, color: Color): void {
    if (x < 0 || y < 0 || x >= this.physicalWidth || y >= this.physicalHeight) return;
    const i = (y * this.physicalWidth + x) * 4;
    const alpha = color[3] ?? 255;
    if (alpha === 255) {
      this.pixels[i] = color[0];
      this.pixels[i + 1] = color[1];
      this.pixels[i + 2] = color[2];
      this.pixels[i + 3] = 255;
      return;
    }
    const inv = 255 - alpha;
    this.pixels[i] = Math.round((color[0] * alpha + this.pixels[i] * inv) / 255);
    this.pixels[i + 1] = Math.round((color[1] * alpha + this.pixels[i + 1] * inv) / 255);
    this.pixels[i + 2] = Math.round((color[2] * alpha + this.pixels[i + 2] * inv) / 255);
    this.pixels[i + 3] = 255;
  }

  rect(x: number, y: number, width: number, height: number, color: Color): void {
    const x0 = Math.max(0, Math.round(x * this.scale));
    const y0 = Math.max(0, Math.round(y * this.scale));
    const x1 = Math.min(this.physicalWidth, Math.round((x + width) * this.scale));
    const y1 = Math.min(this.physicalHeight, Math.round((y + height) * this.scale));
    for (let py = y0; py < y1; py++) {
      for (let px = x0; px < x1; px++) this.setPhysical(px, py, color);
    }
  }

  circle(cx: number, cy: number, radius: number, color: Color): void {
    const s = this.scale;
    const x0 = Math.max(0, Math.floor((cx - radius) * s));
    const y0 = Math.max(0, Math.floor((cy - radius) * s));
    const x1 = Math.min(this.physicalWidth - 1, Math.ceil((cx + radius) * s));
    const y1 = Math.min(this.physicalHeight - 1, Math.ceil((cy + radius) * s));
    const cr = radius * s;
    const ccx = cx * s;
    const ccy = cy * s;
    for (let py = y0; py <= y1; py++) {
      for (let px = x0; px <= x1; px++) {
        const dx = px + 0.5 - ccx;
        const dy = py + 0.5 - ccy;
        if (dx * dx + dy * dy <= cr * cr) this.setPhysical(px, py, color);
      }
    }
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, color: Color): void {
    const s = this.scale;
    const x0 = Math.max(0, Math.floor((cx - rx) * s));
    const y0 = Math.max(0, Math.floor((cy - ry) * s));
    const x1 = Math.min(this.physicalWidth - 1, Math.ceil((cx + rx) * s));
    const y1 = Math.min(this.physicalHeight - 1, Math.ceil((cy + ry) * s));
    for (let py = y0; py <= y1; py++) {
      for (let px = x0; px <= x1; px++) {
        const dx = (px + 0.5) / s - cx;
        const dy = (py + 0.5) / s - cy;
        if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1) this.setPhysical(px, py, color);
      }
    }
  }

  polygon(points: readonly (readonly [number, number])[], color: Color): void {
    const scaled = points.map(([x, y]) => [x * this.scale, y * this.scale] as const);
    const minY = Math.max(0, Math.floor(Math.min(...scaled.map((p) => p[1]))));
    const maxY = Math.min(this.physicalHeight - 1, Math.ceil(Math.max(...scaled.map((p) => p[1]))));
    for (let y = minY; y <= maxY; y++) {
      const scanY = y + 0.5;
      const intersections: number[] = [];
      for (let i = 0, j = scaled.length - 1; i < scaled.length; j = i++) {
        const [xi, yi] = scaled[i];
        const [xj, yj] = scaled[j];
        if ((yi > scanY) !== (yj > scanY)) {
          intersections.push(xi + ((scanY - yi) * (xj - xi)) / (yj - yi));
        }
      }
      intersections.sort((a, b) => a - b);
      for (let i = 0; i + 1 < intersections.length; i += 2) {
        const from = Math.max(0, Math.ceil(intersections[i]));
        const to = Math.min(this.physicalWidth - 1, Math.floor(intersections[i + 1]));
        for (let x = from; x <= to; x++) this.setPhysical(x, y, color);
      }
    }
  }

  multiPolygon(contours: readonly (readonly (readonly [number, number])[])[], color: Color): void {
    const scaled = contours
      .filter((contour) => contour.length >= 3)
      .map((contour) => contour.map(([x, y]) => [x * this.scale, y * this.scale] as const));
    if (!scaled.length) return;
    const allPoints = scaled.flat();
    const minY = Math.max(0, Math.floor(Math.min(...allPoints.map((point) => point[1]))));
    const maxY = Math.min(this.physicalHeight - 1, Math.ceil(Math.max(...allPoints.map((point) => point[1]))));
    for (let y = minY; y <= maxY; y++) {
      const scanY = y + 0.5;
      const intersections: number[] = [];
      for (const contour of scaled) {
        for (let i = 0, j = contour.length - 1; i < contour.length; j = i++) {
          const [xi, yi] = contour[i];
          const [xj, yj] = contour[j];
          if ((yi > scanY) !== (yj > scanY)) intersections.push(xi + ((scanY - yi) * (xj - xi)) / (yj - yi));
        }
      }
      intersections.sort((a, b) => a - b);
      for (let i = 0; i + 1 < intersections.length; i += 2) {
        const from = Math.max(0, Math.ceil(intersections[i]));
        const to = Math.min(this.physicalWidth - 1, Math.floor(intersections[i + 1]));
        for (let x = from; x <= to; x++) this.setPhysical(x, y, color);
      }
    }
  }

  line(x1: number, y1: number, x2: number, y2: number, width: number, color: Color): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    if (length === 0) return this.circle(x1, y1, width / 2, color);
    const nx = (-dy / length) * width / 2;
    const ny = (dx / length) * width / 2;
    this.polygon([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]], color);
    this.circle(x1, y1, width / 2, color);
    this.circle(x2, y2, width / 2, color);
  }

  roundedRect(x: number, y: number, width: number, height: number, radius: number, color: Color): void {
    const r = Math.min(radius, width / 2, height / 2);
    this.rect(x + r, y, width - 2 * r, height, color);
    this.rect(x, y + r, width, height - 2 * r, color);
    this.circle(x + r, y + r, r, color);
    this.circle(x + width - r, y + r, r, color);
    this.circle(x + r, y + height - r, r, color);
    this.circle(x + width - r, y + height - r, r, color);
  }

  downsample(): Uint8Array {
    if (this.scale === 1) return this.pixels.slice();
    const output = new Uint8Array(this.width * this.height * 4);
    const samples = this.scale * this.scale;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        for (let sy = 0; sy < this.scale; sy++) {
          for (let sx = 0; sx < this.scale; sx++) {
            const source = (((y * this.scale + sy) * this.physicalWidth) + x * this.scale + sx) * 4;
            r += this.pixels[source];
            g += this.pixels[source + 1];
            b += this.pixels[source + 2];
            a += this.pixels[source + 3];
          }
        }
        const target = (y * this.width + x) * 4;
        output[target] = Math.round(r / samples);
        output[target + 1] = Math.round(g / samples);
        output[target + 2] = Math.round(b / samples);
        output[target + 3] = Math.round(a / samples);
      }
    }
    return output;
  }
}
