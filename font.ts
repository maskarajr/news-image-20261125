import type { Canvas, Color } from './canvas.ts';

const G: Record<string, string> = {
  'A':'01110100011000111111100011000110001','B':'11110100011000111110100011000111110','C':'01111100001000010000100001000001111','D':'11110100011000110001100011000111110','E':'11111100001000011110100001000011111','F':'11111100001000011110100001000010000','G':'01111100001000010111100011000101111','H':'10001100011000111111100011000110001','I':'11111001000010000100001000010011111','J':'00111000100001000010100101001001100','K':'10001100101010011000101001001010001','L':'10000100001000010000100001000011111','M':'10001110111010110101100011000110001','N':'10001110011010110011100011000110001','O':'01110100011000110001100011000101110','P':'11110100011000111110100001000010000','Q':'01110100011000110001101011001001101','R':'11110100011000111110101001001010001','S':'01111100001000001110000010000111110','T':'11111001000010000100001000010000100','U':'10001100011000110001100011000101110','V':'10001100011000110001100010101000100','W':'10001100011000110101101011101110001','X':'10001100010101000100010101000110001','Y':'10001100010101000100001000010000100','Z':'11111000010001000100010001000011111',
  '0':'01110100011001110101110011000101110','1':'00100011000010000100001000010001110','2':'01110100010000100010001000100011111','3':'11110000010000101110000010000111110','4':'00010001100101010010111110001000010','5':'11111100001000011110000010000111110','6':'01110100001000011110100011000101110','7':'11111000010001000100010000100001000','8':'01110100011000101110100011000101110','9':'01110100011000101111000010000101110',
  '.':'00000000000000000000000000011000110',',':'00000000000000000000001100011000100',':':'00000011000110000000011000110000000',';':'00000011000110000000011000110001000','!':'00100001000010000100001000000000100','?':'01110100010000100110001000000000100','-':'00000000000000011111000000000000000','/':'00001000100001000100010001000010000','&':'01100100101010001000101011001001101','+':'00000001000010011111001000010000000','(':'00010001000100001000010000010000010',')':'01000001000010000010001000100001000','\'':'00100001000010000000000000000000000','%':'11001110100001000100010001011110011','=':'00000111110000011111000000000000000',' ':'00000000000000000000000000000000000',
};

function patternFor(char: string): string {
  return G[char.toUpperCase()] ?? G['?'];
}

export function textWidth(text: string, size: number, tracking = 1): number {
  if (!text.length) return 0;
  return text.length * 5 * size + (text.length - 1) * tracking * size;
}

export function drawText(canvas: Canvas, text: string, x: number, y: number, size: number, color: Color, tracking = 1): number {
  let cursor = x;
  for (const char of text) {
    const pattern = patternFor(char);
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (pattern[row * 5 + col] === '1') canvas.rect(cursor + col * size, y + row * size, size, size, color);
      }
    }
    cursor += (5 + tracking) * size;
  }
  return cursor;
}

export function drawCentered(canvas: Canvas, text: string, centerX: number, y: number, size: number, color: Color, tracking = 1): void {
  drawText(canvas, text, centerX - textWidth(text, size, tracking) / 2, y, size, color, tracking);
}

export function wrapText(text: string, maxWidth: number, size: number, tracking = 1): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && textWidth(candidate, size, tracking) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function drawWrapped(canvas: Canvas, text: string, x: number, y: number, maxWidth: number, size: number, color: Color, lineGap = 1, maxLines = 99): number {
  const lines = wrapText(text, maxWidth, size).slice(0, maxLines);
  const lineHeight = (7 + lineGap) * size;
  lines.forEach((line, index) => drawText(canvas, line, x, y + index * lineHeight, size, color));
  return y + lines.length * lineHeight;
}
