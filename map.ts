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

type GeoPoint = readonly [longitude: number, latitude: number];

// Compact pseudocylindrical projection used to draft the map silhouettes.
// The cubic term compresses the far Pacific edges into the editorial panel.
function project([longitude, latitude]: GeoPoint): readonly [number, number] {
  const x = 315 + 1.9794 * longitude - 0.00001994 * longitude ** 3;
  const y = 308 - 1.6 * latitude;
  return [x, y];
}

function geoPin(c: Canvas, location: GeoPoint, label: string, color: Color = COLORS.orange): void {
  const [x, y] = project(location);
  pin(c, x, y, label, color);
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

  // Every marker is projected from its event location; story 7 has two locations.
  geoPin(c, [100.30, 40.96], '1');                    // Jiuquan
  geoPin(c, [149.13, -35.2809], '2', COLORS.teal);   // Canberra
  geoPin(c, [42.95, 14.80], '3', COLORS.red);         // Hodeidah / Red Sea
  geoPin(c, [30.62, 48.47], '4', COLORS.blue);        // Odesa–Kyiv midpoint
  geoPin(c, [-73.9496, 40.6501], '5', COLORS.orange); // Brooklyn
  geoPin(c, [34.4668, 31.5017], '6', COLORS.red);     // Gaza
  geoPin(c, [-86.7816, 36.1627], '7', COLORS.teal);  // Tennessee
  geoPin(c, [-75.4794, 10.3910], '7', COLORS.teal);  // Cartagena

  drawText(c, 'WORLD DESK / 7 STORIES / 5 BEATS', 45, 394, 1.35, COLORS.white, 0.8);
}

export function drawRocket(c: Canvas, x: number, y: number): void {
  c.polygon([[x, y - 42], [x + 11, y - 20], [x + 9, y + 17], [x - 9, y + 17], [x - 11, y - 20]], COLORS.white);
  c.circle(x, y - 15, 4, COLORS.teal);
  c.polygon([[x - 9, y + 2], [x - 20, y + 19], [x - 8, y + 15]], COLORS.red);
  c.polygon([[x + 9, y + 2], [x + 20, y + 19], [x + 8, y + 15]], COLORS.red);
  c.polygon([[x - 7, y + 18], [x, y + 43], [x + 7, y + 18]], COLORS.orange);
}
