import { readFileSync } from 'node:fs';
import type { Canvas, Color } from './canvas.ts';

type Point = { x: number; y: number; on: boolean };
type Contour = Point[];
type FlatContour = readonly (readonly [number, number])[];

export class TrueTypeFont {
  private readonly data: Buffer;
  private readonly tables = new Map<string, number>();
  private readonly loca: number[];
  private readonly advances: number[];
  private readonly outlineCache = new Map<number, Contour[]>();
  private readonly flatCache = new Map<number, FlatContour[]>();
  private readonly scaledCache = new Map<string, FlatContour[]>();
  private cmapOffset = 0;
  readonly unitsPerEm: number;
  readonly ascender: number;
  readonly descender: number;
  readonly numGlyphs: number;

  constructor(path: URL) {
    this.data = readFileSync(path);
    const numTables = this.u16(4);
    for (let i = 0; i < numTables; i++) {
      const offset = 12 + i * 16;
      this.tables.set(this.data.toString('ascii', offset, offset + 4), this.u32(offset + 8));
    }
    const head = this.table('head');
    const hhea = this.table('hhea');
    const maxp = this.table('maxp');
    this.unitsPerEm = this.u16(head + 18);
    this.ascender = this.i16(hhea + 4);
    this.descender = this.i16(hhea + 6);
    this.numGlyphs = this.u16(maxp + 4);
    const metricCount = this.u16(hhea + 34);
    const hmtx = this.table('hmtx');
    this.advances = new Array(this.numGlyphs);
    let lastAdvance = 0;
    for (let i = 0; i < this.numGlyphs; i++) {
      if (i < metricCount) lastAdvance = this.u16(hmtx + i * 4);
      this.advances[i] = lastAdvance;
    }
    const indexFormat = this.i16(head + 50);
    const loca = this.table('loca');
    this.loca = new Array(this.numGlyphs + 1);
    for (let i = 0; i <= this.numGlyphs; i++) this.loca[i] = indexFormat === 0 ? this.u16(loca + i * 2) * 2 : this.u32(loca + i * 4);
    this.selectCmap();
  }

  private u8(offset: number): number { return this.data[offset]; }
  private i8(offset: number): number { return this.data.readInt8(offset); }
  private u16(offset: number): number { return this.data.readUInt16BE(offset); }
  private i16(offset: number): number { return this.data.readInt16BE(offset); }
  private u32(offset: number): number { return this.data.readUInt32BE(offset); }
  private f2dot14(offset: number): number { return this.i16(offset) / 16384; }
  private table(name: string): number {
    const offset = this.tables.get(name);
    if (offset === undefined) throw new Error(`TrueType table missing: ${name}`);
    return offset;
  }

  private selectCmap(): void {
    const cmap = this.table('cmap');
    const count = this.u16(cmap + 2);
    let selected = 0, score = -1;
    for (let i = 0; i < count; i++) {
      const record = cmap + 4 + i * 8;
      const platform = this.u16(record);
      const encoding = this.u16(record + 2);
      const subtable = cmap + this.u32(record + 4);
      if (this.u16(subtable) !== 4) continue;
      const candidate = platform === 3 && encoding === 10 ? 3 : platform === 3 ? 2 : platform === 0 ? 1 : 0;
      if (candidate > score) { score = candidate; selected = subtable; }
    }
    if (!selected) throw new Error('TrueType cmap format 4 not found');
    this.cmapOffset = selected;
  }

  glyphIndex(char: string): number {
    const code = char.codePointAt(0) ?? 0;
    if (code > 0xffff) return 0;
    const base = this.cmapOffset;
    const segCount = this.u16(base + 6) / 2;
    const endBase = base + 14;
    const startBase = endBase + segCount * 2 + 2;
    const deltaBase = startBase + segCount * 2;
    const rangeBase = deltaBase + segCount * 2;
    for (let i = 0; i < segCount; i++) {
      const end = this.u16(endBase + i * 2);
      if (code > end) continue;
      const start = this.u16(startBase + i * 2);
      if (code < start) return 0;
      const delta = this.i16(deltaBase + i * 2);
      const range = this.u16(rangeBase + i * 2);
      if (range === 0) return (code + delta) & 0xffff;
      const address = rangeBase + i * 2 + range + (code - start) * 2;
      let glyph = this.u16(address);
      if (glyph) glyph = (glyph + delta) & 0xffff;
      return glyph;
    }
    return 0;
  }

  hasGlyph(char: string): boolean { return char === '\n' || this.glyphIndex(char) !== 0; }
  advance(char: string, size: number): number { return this.advances[this.glyphIndex(char)] * size / this.unitsPerEm; }

  private glyphContours(glyph: number, depth = 0): Contour[] {
    const cached = this.outlineCache.get(glyph);
    if (cached) return cached;
    if (depth > 12 || glyph <= 0 || glyph >= this.numGlyphs || this.loca[glyph] === this.loca[glyph + 1]) return [];
    const start = this.table('glyf') + this.loca[glyph];
    const contourCount = this.i16(start);
    const contours = contourCount >= 0 ? this.simpleGlyph(start, contourCount) : this.compositeGlyph(start, depth);
    this.outlineCache.set(glyph, contours);
    return contours;
  }

  private simpleGlyph(start: number, contourCount: number): Contour[] {
    if (!contourCount) return [];
    let cursor = start + 10;
    const ends: number[] = [];
    for (let i = 0; i < contourCount; i++) { ends.push(this.u16(cursor)); cursor += 2; }
    const pointCount = ends[ends.length - 1] + 1;
    const instructionLength = this.u16(cursor); cursor += 2 + instructionLength;
    const flags: number[] = [];
    while (flags.length < pointCount) {
      const flag = this.u8(cursor++); flags.push(flag);
      if (flag & 8) { const repeats = this.u8(cursor++); for (let i = 0; i < repeats; i++) flags.push(flag); }
    }
    const xs: number[] = []; let x = 0;
    for (const flag of flags) {
      if (flag & 2) x += (flag & 16 ? 1 : -1) * this.u8(cursor++);
      else if (!(flag & 16)) { x += this.i16(cursor); cursor += 2; }
      xs.push(x);
    }
    const ys: number[] = []; let y = 0;
    for (const flag of flags) {
      if (flag & 4) y += (flag & 32 ? 1 : -1) * this.u8(cursor++);
      else if (!(flag & 32)) { y += this.i16(cursor); cursor += 2; }
      ys.push(y);
    }
    const contours: Contour[] = []; let from = 0;
    for (const end of ends) {
      const contour: Contour = [];
      for (let i = from; i <= end; i++) contour.push({ x: xs[i], y: ys[i], on: Boolean(flags[i] & 1) });
      contours.push(contour); from = end + 1;
    }
    return contours;
  }

  private compositeGlyph(start: number, depth: number): Contour[] {
    let cursor = start + 10, flags = 0;
    const result: Contour[] = [];
    do {
      flags = this.u16(cursor); const child = this.u16(cursor + 2); cursor += 4;
      let arg1: number, arg2: number;
      if (flags & 1) { arg1 = this.i16(cursor); arg2 = this.i16(cursor + 2); cursor += 4; }
      else { arg1 = this.i8(cursor); arg2 = this.i8(cursor + 1); cursor += 2; }
      const dx = flags & 2 ? arg1 : 0, dy = flags & 2 ? arg2 : 0;
      let a = 1, b = 0, cc = 0, d = 1;
      if (flags & 8) { a = d = this.f2dot14(cursor); cursor += 2; }
      else if (flags & 64) { a = this.f2dot14(cursor); d = this.f2dot14(cursor + 2); cursor += 4; }
      else if (flags & 128) { a = this.f2dot14(cursor); b = this.f2dot14(cursor + 2); cc = this.f2dot14(cursor + 4); d = this.f2dot14(cursor + 6); cursor += 8; }
      for (const contour of this.glyphContours(child, depth + 1)) {
        result.push(contour.map((point) => ({ x: a * point.x + cc * point.y + dx, y: b * point.x + d * point.y + dy, on: point.on })));
      }
    } while (flags & 32);
    return result;
  }

  private flattened(glyph: number): FlatContour[] {
    const cached = this.flatCache.get(glyph);
    if (cached) return cached;
    const flat = this.glyphContours(glyph).map((contour) => flattenContour(contour)).filter((contour) => contour.length >= 3);
    this.flatCache.set(glyph, flat);
    return flat;
  }

  scaledGlyph(char: string, size: number): FlatContour[] {
    const glyph = this.glyphIndex(char);
    const key = `${glyph}:${size}`;
    const cached = this.scaledCache.get(key);
    if (cached) return cached;
    const scale = size / this.unitsPerEm;
    const scaled = this.flattened(glyph).map((contour) => contour.map(([x, y]) => [x * scale, (this.ascender - y) * scale] as const));
    this.scaledCache.set(key, scaled);
    return scaled;
  }
}

function midpoint(a: Point, b: Point): Point { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, on: true }; }

function flattenContour(points: Contour): FlatContour {
  if (!points.length) return [];
  let start: Point, index: number;
  if (points[0].on) { start = points[0]; index = 1; }
  else if (points[points.length - 1].on) { start = points[points.length - 1]; index = 0; }
  else { start = midpoint(points[points.length - 1], points[0]); index = 0; }
  const output: [number, number][] = [[start.x, start.y]];
  let current = start, consumed = 0;
  while (consumed < points.length) {
    const point = points[index % points.length];
    if (point.on) {
      output.push([point.x, point.y]); current = point; index++; consumed++;
    } else {
      const rawNext = points[(index + 1) % points.length];
      const end = rawNext.on ? rawNext : midpoint(point, rawNext);
      for (let step = 1; step <= 8; step++) {
        const t = step / 8, inv = 1 - t;
        output.push([inv * inv * current.x + 2 * inv * t * point.x + t * t * end.x, inv * inv * current.y + 2 * inv * t * point.y + t * t * end.y]);
      }
      current = end; index += rawNext.on ? 2 : 1; consumed += rawNext.on ? 2 : 1;
    }
  }
  return output;
}

export const MERIDIAN_BOLD = new TrueTypeFont(new URL('./fonts/Meridian-Bold.ttf', import.meta.url));
export const HALDEN = new TrueTypeFont(new URL('./fonts/Halden-Regular.ttf', import.meta.url));
export const HALDEN_BOLD = new TrueTypeFont(new URL('./fonts/Halden-Bold.ttf', import.meta.url));

export function textWidth(font: TrueTypeFont, text: string, size: number, letterSpacing = 0): number {
  let width = 0;
  for (const char of text) width += font.advance(char, size) + letterSpacing;
  return Math.max(0, width - letterSpacing);
}

export function drawText(canvas: Canvas, font: TrueTypeFont, text: string, x: number, y: number, size: number, color: Color, letterSpacing = 0): number {
  let cursor = x;
  for (const char of text) {
    const contours = font.scaledGlyph(char, size).map((contour) => contour.map(([px, py]) => [px + cursor, py + y] as const));
    canvas.multiPolygon(contours, color);
    cursor += font.advance(char, size) + letterSpacing;
  }
  return cursor;
}

export function drawCentered(canvas: Canvas, font: TrueTypeFont, text: string, centerX: number, y: number, size: number, color: Color, letterSpacing = 0): void {
  drawText(canvas, font, text, centerX - textWidth(font, text, size, letterSpacing) / 2, y, size, color, letterSpacing);
}

export function fitSize(font: TrueTypeFont, text: string, preferredSize: number, maxWidth: number, floor: number, letterSpacing = 0): number {
  const width = textWidth(font, text, preferredSize, letterSpacing);
  return width <= maxWidth ? preferredSize : Math.max(floor, preferredSize * maxWidth / width);
}

export function wrapText(font: TrueTypeFont, text: string, size: number, maxWidth: number): string[] {
  const words = text.split(' '), lines: string[] = []; let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && textWidth(font, candidate, size) > maxWidth) { lines.push(line); line = word; }
    else line = candidate;
  }
  if (line) lines.push(line);
  return lines;
}
