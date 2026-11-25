import { Canvas, COLORS, type Color } from './canvas.ts';
import { drawCentered, drawText } from './font.ts';

function land(c: Canvas, points: readonly (readonly [number, number])[]): void {
  c.polygon(points, COLORS.paleTeal);
}

function pin(c: Canvas, x: number, y: number, label: string, color: Color = COLORS.orange): void {
  c.circle(x, y, 13, COLORS.white);
  c.circle(x, y, 10, color);
  drawCentered(c, label, x, y - 5, label.length === 1 ? 1.45 : 1.1, COLORS.ink, 0.4);
}

export function drawWorldMap(c: Canvas): void {
  // Quiet latitude/longitude guides give the deliberately simplified map context.
  for (const y of [219, 269, 319, 369]) c.line(42, y, 625, y, 1, [67, 105, 127]);
  for (const x of [135, 235, 335, 435, 535]) c.line(x, 183, x, 413, 1, [67, 105, 127]);

  // North America, Central America and Greenland.
  land(c, [[62,220],[82,199],[122,188],[165,196],[192,217],[177,238],[151,243],[137,262],[111,260],[97,246],[76,243]]);
  land(c, [[141,258],[157,266],[168,280],[181,288],[176,296],[158,286]]);
  land(c, [[169,181],[194,168],[219,177],[210,194],[181,196]]);
  // South America.
  land(c, [[183,294],[211,292],[232,310],[230,335],[218,356],[210,388],[194,408],[184,382],[177,350],[163,321]]);
  // Europe, Africa and Asia.
  land(c, [[303,216],[326,200],[359,203],[375,216],[365,231],[336,235],[316,228]]);
  land(c, [[322,241],[359,236],[382,258],[378,294],[363,331],[345,360],[328,334],[317,298],[302,268]]);
  land(c, [[366,204],[404,187],[466,191],[512,205],[559,225],[572,245],[548,261],[512,251],[490,270],[453,257],[421,244],[388,238]]);
  land(c, [[440,260],[461,273],[450,299],[431,285]]); // India
  land(c, [[546,264],[555,268],[552,287],[545,280]]); // Japan
  // Australia and the Pacific arc.
  land(c, [[484,330],[511,313],[548,320],[565,342],[552,365],[516,371],[491,354]]);
  c.circle(584, 332, 4, COLORS.paleTeal); c.circle(596, 341, 3, COLORS.paleTeal);

  // Regional story markers; story 7 appears in both the US and Colombia.
  pin(c, 493, 231, '1');
  pin(c, 544, 338, '2', COLORS.teal);
  pin(c, 389, 282, '3', COLORS.red);
  pin(c, 351, 216, '4', COLORS.blue);
  pin(c, 125, 224, '5', COLORS.orange);
  pin(c, 374, 255, '6', COLORS.red);
  pin(c, 160, 248, '7', COLORS.teal);
  pin(c, 204, 324, '7', COLORS.teal);

  drawText(c, 'WORLD DESK / 7 STORIES / 5 BEATS', 45, 394, 1.35, COLORS.white, 0.8);
}

export function drawRocket(c: Canvas, x: number, y: number): void {
  c.polygon([[x, y - 42], [x + 11, y - 20], [x + 9, y + 17], [x - 9, y + 17], [x - 11, y - 20]], COLORS.white);
  c.circle(x, y - 15, 4, COLORS.teal);
  c.polygon([[x - 9, y + 2], [x - 20, y + 19], [x - 8, y + 15]], COLORS.red);
  c.polygon([[x + 9, y + 2], [x + 20, y + 19], [x + 8, y + 15]], COLORS.red);
  c.polygon([[x - 7, y + 18], [x, y + 43], [x + 7, y + 18]], COLORS.orange);
}
