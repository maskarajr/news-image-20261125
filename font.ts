import type { Canvas, Color } from './canvas.ts';

type Glyph = { width: number; strokes: readonly (readonly number[])[] };
const g = (width: number, ...strokes: readonly number[][]): Glyph => ({ width, strokes });

// Original monoline geometric alphabet. Coordinates are normalized outlines
// rendered as anti-aliased vector strokes by the 2x canvas, never bitmap cells.
const GLYPHS: Record<string, Glyph> = {
  A:g(.72,[.02,1,.36,0,.70,1],[.16,.62,.56,.62]), B:g(.68,[.04,1,.04,0,.44,0,.62,.14,.62,.38,.45,.50,.04,.50],[.45,.50,.65,.62,.65,.84,.48,1,.04,1]),
  C:g(.68,[.64,.10,.50,0,.18,0,.03,.18,.03,.82,.18,1,.50,1,.64,.90]), D:g(.70,[.04,1,.04,0,.42,0,.66,.22,.66,.78,.42,1,.04,1]),
  E:g(.62,[.60,0,.04,0,.04,1,.60,1],[.04,.50,.50,.50]), F:g(.62,[.04,1,.04,0,.60,0],[.04,.50,.50,.50]),
  G:g(.70,[.66,.14,.52,0,.18,0,.03,.18,.03,.82,.18,1,.52,1,.67,.84,.67,.57,.42,.57]), H:g(.70,[.04,0,.04,1],[.66,0,.66,1],[.04,.50,.66,.50]),
  I:g(.38,[.04,0,.34,0],[.19,0,.19,1],[.04,1,.34,1]), J:g(.58,[.54,0,.54,.78,.40,1,.15,1,.03,.84]),
  K:g(.68,[.04,0,.04,1],[.64,0,.04,.56,.66,1]), L:g(.58,[.04,0,.04,1,.56,1]),
  M:g(.88,[.04,1,.04,0,.44,.62,.84,0,.84,1]), N:g(.74,[.04,1,.04,0,.70,1,.70,0]),
  O:g(.72,[.18,0,.54,0,.68,.18,.68,.82,.54,1,.18,1,.04,.82,.04,.18,.18,0]), P:g(.66,[.04,1,.04,0,.45,0,.62,.16,.62,.39,.45,.54,.04,.54]),
  Q:g(.74,[.18,0,.54,0,.68,.18,.68,.78,.54,1,.18,1,.04,.82,.04,.18,.18,0],[.43,.70,.72,1]), R:g(.68,[.04,1,.04,0,.45,0,.62,.16,.62,.39,.45,.54,.04,.54],[.39,.54,.67,1]),
  S:g(.66,[.62,.12,.48,0,.18,0,.04,.15,.04,.39,.18,.50,.48,.50,.62,.62,.62,.85,.48,1,.16,1,.03,.88]), T:g(.66,[.02,0,.64,0],[.33,0,.33,1]),
  U:g(.70,[.04,0,.04,.78,.18,1,.52,1,.66,.78,.66,0]), V:g(.72,[.02,0,.36,1,.70,0]),
  W:g(.98,[.02,0,.22,1,.49,.42,.76,1,.96,0]), X:g(.70,[.03,0,.67,1],[.67,0,.03,1]),
  Y:g(.70,[.02,0,.35,.50,.68,0],[.35,.50,.35,1]), Z:g(.66,[.03,0,.63,0,.03,1,.63,1]),
  '0':g(.70,[.18,0,.52,0,.66,.18,.66,.82,.52,1,.18,1,.04,.82,.04,.18,.18,0],[.12,.88,.58,.12]),
  '1':g(.44,[.05,.20,.23,0,.23,1],[.05,1,.42,1]), '2':g(.66,[.04,.18,.18,0,.48,0,.62,.17,.62,.36,.04,1,.64,1]),
  '3':g(.64,[.04,.10,.18,0,.47,0,.61,.16,.61,.38,.48,.50,.24,.50],[.48,.50,.62,.62,.62,.84,.48,1,.17,1,.03,.90]),
  '4':g(.68,[.49,1,.49,0,.03,.68,.65,.68]), '5':g(.64,[.61,0,.08,0,.04,.48,.46,.48,.61,.63,.61,.84,.47,1,.17,1,.03,.90]),
  '6':g(.66,[.58,.10,.46,0,.18,0,.04,.20,.04,.82,.18,1,.48,1,.62,.84,.62,.61,.48,.48,.04,.48]),
  '7':g(.64,[.02,0,.62,0,.17,1]), '8':g(.66,[.18,0,.48,0,.62,.15,.62,.36,.48,.50,.18,.50,.04,.36,.04,.15,.18,0],[.18,.50,.04,.64,.04,.85,.18,1,.48,1,.62,.85,.62,.64,.48,.50]),
  '9':g(.66,[.62,.52,.18,.52,.04,.38,.04,.16,.18,0,.48,0,.62,.18,.62,.82,.48,1,.18,1,.07,.90]),
  '.':g(.22,[.11,.94,.11,1]), ',':g(.24,[.14,.90,.08,1]), ':':g(.24,[.12,.28,.12,.34],[.12,.83,.12,.89]),
  ';':g(.24,[.12,.28,.12,.34],[.14,.82,.08,.96]), '!':g(.24,[.12,0,.12,.72],[.12,.94,.12,1]),
  '?':g(.58,[.03,.17,.16,0,.42,0,.55,.16,.55,.36,.29,.55,.29,.70],[.29,.94,.29,1]),
  '-':g(.42,[.03,.52,.39,.52]), '/':g(.54,[.02,1,.52,0]), '\\':g(.54,[.02,0,.52,1]),
  '+':g(.54,[.03,.52,.51,.52],[.27,.28,.27,.76]), '=':g(.54,[.03,.39,.51,.39],[.03,.65,.51,.65]),
  '%':g(.74,[.04,1,.70,0],[.13,.05,.23,.05,.27,.13,.27,.25,.23,.33,.13,.33,.09,.25,.09,.13,.13,.05],[.51,.67,.61,.67,.65,.75,.65,.87,.61,.95,.51,.95,.47,.87,.47,.75,.51,.67]),
  '~':g(.58,[.03,.57,.16,.47,.30,.47,.43,.57,.56,.47]), "'":g(.20,[.12,0,.09,.20]),
  '(' :g(.34,[.29,0,.12,.18,.06,.50,.12,.82,.29,1]), ')' :g(.34,[.05,0,.22,.18,.28,.50,.22,.82,.05,1]),
  '&':g(.72,[.62,.88,.49,1,.19,1,.04,.84,.04,.66,.52,.15,.48,0,.27,0,.16,.12,.16,.30,.68,1]),
  ' ':g(.34),
};

export const SUPPORTED_CHARS = new Set(Object.keys(GLYPHS));

function glyphFor(char: string): Glyph {
  const glyph = GLYPHS[char.toUpperCase()];
  if (!glyph) throw new Error(`Unsupported glyph: ${JSON.stringify(char)}`);
  return glyph;
}

export function textWidth(text: string, height: number, tracking = 0.10, widthScale = 1): number {
  let width = 0;
  for (const char of text) width += glyphFor(char).width * height * widthScale + tracking * height;
  return Math.max(0, width - tracking * height);
}

export function drawText(canvas: Canvas, text: string, x: number, y: number, height: number, color: Color, tracking = 0.10, widthScale = 1): number {
  let cursor = x;
  const strokeWidth = Math.max(1.1, height * 0.105);
  for (const char of text) {
    const glyph = glyphFor(char);
    for (const path of glyph.strokes) {
      for (let i = 0; i + 3 < path.length; i += 2) {
        canvas.line(cursor + path[i] * height * widthScale, y + path[i + 1] * height, cursor + path[i + 2] * height * widthScale, y + path[i + 3] * height, strokeWidth, color);
      }
    }
    cursor += (glyph.width * widthScale + tracking) * height;
  }
  return cursor;
}

export function drawCentered(canvas: Canvas, text: string, centerX: number, y: number, height: number, color: Color, tracking = 0.10, widthScale = 1): void {
  drawText(canvas, text, centerX - textWidth(text, height, tracking, widthScale) / 2, y, height, color, tracking, widthScale);
}

export function fitTextHeight(text: string, maxWidth: number, preferredHeight: number, tracking = 0.10, widthScale = 1): number {
  const width = textWidth(text, preferredHeight, tracking, widthScale);
  return width <= maxWidth ? preferredHeight : preferredHeight * maxWidth / width;
}
