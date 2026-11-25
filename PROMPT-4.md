# PROMPT-4 — news-image-20261125 (broadsheet rebuild)

Paste this as one message in the **same public repo** `https://github.com/maskarajr/news-image-20261125` (continue the existing OpenCode session if it is still open; otherwise start a new session in this repo after 05:00 PKT on 25 Nov 2026). Commit and push to **main** when done.

We have two scored entries. The first (`75cb97d`, 16 stories, pixel font, map) scored 0.963 (9W / 2D / 1L). The judge liked the dated, sourced breadth and the DATE CHECK, and rejected the page on **legibility**: dense pixel text “shrinks to unreadable specks” at about 300 px, place names garbled into strings such as “STRAIT OF HAHNUZ”, “RAN TANURA” and “ALONI FACTS”, and the map was “a smeared, distorted blob”. The second (`d259ef9`, 8 large leads, no map) fixed the headlines at 300 px and scored **worse** (0.948, 7W / 1D / 4L): it looks like a thin magazine cover, the wire and DATE CHECK still collapse at 300 px, source lines are hyphen-smashed, and there is no map.

The pages winning this bounty (board #1–#3, ~0.987–0.988) are **dense one-day broadsheets**, not 8-card posters: a huge dated masthead, a kicker of three headlines, a stat strip, 10–12 illustrated leads, a compact “Also on 25 November” wire, a DATE CHECK, and a small sharp locator map with numbered pins. Recreate that **form** with only the verified Wednesday stories below. Do not invent stories, numbers, death tolls or datelines to match their “35” or “50” counts. Some top pages also run Tuesday 24 Nov events (the Huawei verdict, the PIF-tower strike that wounded 11, the CAS Senegal ruling, Real Madrid–PSV, the Sandringham arrests, the Rosstat death-toll leak) as if they were Wednesday leads. **Do not do that.** Those belong only in DATE CHECK.

## Output and constraints
- Write `/output/entry.png` via the existing helper: `process.env.MAKEFUN_OUTPUT_DIR ?? '/output'`, `mkdir` recursive, filename `entry.png`. Do not hardcode a local `out` folder as the default.
- 1024×1024 PNG or JPEG, under 1 MiB, standard library only, no network, finish in 60 s. Two runs must be byte-identical (no `Date.now()`, no `Math.random()`).
- Date on the page: Wednesday, 25 November 2026.

## Typography and 300 px test (non-negotiable)
Drop every pixel/bitmap/display font that breaks up when shrunk. Use one clean high-contrast grotesque or a simple serif for the masthead and a grotesque for everything else, drawn from glyph outlines (or a crisp hinted bitmap at large sizes only). Dark text on a light newsprint/cream field, or the reverse, with strong contrast. No outlined, dithered, or stroked-then-filled text. Every non-ASCII character (−, é, ’, ×) needs a real glyph; otherwise use ASCII.

Minimum cap heights at 1024 px:
- masthead date: 56 px or more
- kicker / lead headlines: 26 px or more (each headline ≤ 8 words)
- stat figures: 28 px or more
- fact lines and card decks: 16 px or more
- wire, DATE CHECK, sources, map labels: 14 px or more

Before you finish, downscale the PNG to 300×300 (lanczos or equivalent) and look at it. The masthead date, every lead headline, and every stat figure must be readable at that size. Wire and DATE CHECK may be too small to read at 300 px, but they must stay sharp and correctly spelled at 1024 px — never a smear, never a truncated word.

Spell every name correctly: Strait of Hormuz, Ras Tanura, Hodeidah, Shenzhou-24, Zeeshan Ali, Dimorphos, Cartagena, Sylvain Astier, Yonhap, Ukrinform, Al Jazeera, Al-Monitor, Balleny, Middletown. Do not hyphen-smash sources (`YON-HAP`, `INDEP-UKRINFORM`). Write a small text audit (script or test) that lists every string drawn on the page and fails if any required name is missing, misspelled, or truncated.

## Layout (match the winning broadsheet, not a card grid)
1. **Masthead** — a large, sharp “Wednesday 25 November 2026”. One line with the true story count and the regions we actually have (Asia, Oceania, Middle East, Europe, Americas, World, and Antarctica if you use the Balleny quake). “All dated 25 November, all sourced.” Do not claim Africa, and do not claim 35 or 50 stories.
2. **Kicker** — three short Wednesday headlines drawn only from the verified list (example: Shenzhou-24 with Pakistan’s first astronaut · Australia–Solomons security treaty · KOSPI −6.16%).
3. **Stat strip** — 5–7 large quotable figures from the list only (examples: KOSPI −6.16%, CPI 4.9%, wage +36%, 7 drones, ~30 hostages, 03:56 docking, M5.9, 5 tons).
4. **10–12 illustrated leads** — original flat vector scenes (limited palette, silhouettes, no stock photos, no pixel-art icons). Each lead has: place, a short headline, one fact line with a key number, a source mark, and a CLAIM/unconfirmed tag only when the source is a state-media or unverified claim (the Hormuz mines). Spread the leads across regions. Suggested leads, adjust only if the layout needs it: Shenzhou-24; KOSPI slump; Australia–Solomons treaty; Hodeidah strikes; Samara refineries; Cartagena hostages; Section 301 tariffs; Hormuz mines (CLAIM); Australia CPI; Ras Tanura drones; Odesa/Kyiv strikes; OECD Jakarta review or Iowa detonation or Balleny quake.
5. **“Also on 25 November” wire** — every remaining verified Wednesday item as one compact sourced line. Number the wire so the numbers match the map pins.
6. **DATE CHECK box** — state that every 25 Nov item happened or was first reported that day, and name the earlier well-known stories below with their real dates. Do not pass those off as Wednesday news.
7. **“Where it happened” locator** — a small sharp map, not the hero, not omitted. Embed a simplified Natural Earth 110m land set (or an equivalent coastline you ship in the repo) and run it through the existing `project()` in `map.ts` (`x = 315 + 1.9794·lon − 0.00001994·lon³`, `y = 308 − 1.6·lat`). Scale and crop the land so continents are recognisable at 1024 px and still a clean silhouette at 300 px: crisp 1 px (or tidy 2 px) coasts, solid fills, no blur, no soft brushes, no pixel-dither. Numbered pins must match story numbers and sit on the correct land or sea; verify every pin. Colour pins or counts by region. Story 13 (Hera) may sit as a Europe/ESA mark, not a fake asteroid on Earth. The Balleny quake, if used, may sit in the Southern Ocean / Antarctica, off New Zealand, not on Australia. If two stories share a city (Canberra 6 and 7), offset the pins slightly and say so in a one-line key.

## Editorial rules
- Use **only** the verified 25 November 2026 stories listed below (19 items). Do not invent events, numbers or datelines to fill space. You may add a story only if you independently verify, from a reputable wire, that it happened or was first reported on 25 Nov 2026, and you put the source on the page.
- There is no separately verified Africa breaking story for 25 Nov. Do not invent one. African items from 24 Nov belong only in DATE CHECK.
- Keep the Hormuz tanker mines tagged as a claim, not independently confirmed.

## Verified 25 November 2026 stories (use these)

Asia
1. China launches Shenzhou-24 with first foreign astronaut — Jiuquan lift-off ~00:18–00:21 UTC, docked with Tiangong at 03:56 UTC; Tang Hongbo, Wu Yi, Pakistani pilot Muhammad Zeeshan Ali, stay about 5–10 days. ~40.96N, 100.30E. Reuters / AP / BBC.
2. Seoul shares fall 6% as chipmakers slump — KOSPI −6.16% to 4,697.51; Samsung −9.87%; SK hynix −11.05%; 09:09 KST sidecar. ~37.57N, 126.98E. Yonhap.
3. Japan services inflation hits a 36-year high — October services PPI +4.2% y/y, fastest since 1990 (freight, leasing, hotels). ~35.68N, 139.65E. Reuters / CNA / BOJ.
4. Bangladesh raises garment minimum wage 36% — Tk 12,500 to Tk 17,000 a month, from 1 December, after protests. ~23.81N, 90.41E. AP / Al Jazeera / The Straits Times.
5. North Korea expels Swiss diplomat, orders office shut — Sylvain Astier persona non grata, 48 hours to leave; new Swiss office in Pyongyang to close, after sanctions on the Songdowon camp. ~39.04N, 125.76E. AP / Euronews / The Korea Times.
6. OECD reviews Indonesia’s accession in Jakarta — Secretary-General Mathias Cormann in Jakarta; technical reviews across 25 policy areas about 80% done; no fixed 2028 accession date. ~6.21S, 106.85E. ANTARA / CNBC Indonesia.

Oceania / Southern Ocean
7. Australia and Solomon Islands sign security treaty — Canberra; Albanese and Matthew Wale; Australia the security partner of choice; no foreign military bases; 2022 China pact is understood not to be renewed (expires April 2027). ~35.28S, 149.13E. BBC / NYT / AP / AAP.
8. Australia inflation jumps to 4.9% — October CPI +0.5% m/m, 4.9% y/y (three-year high); trimmed mean 3.8%; electricity +25.2%. ~35.28S, 149.13E. ABC / ABS.
9. M5.9 quake in the Balleny Islands region — 01:38 UTC, about 10 km deep, ~63.09S, 170.94E; green alert, no population exposure. USGS.

Middle East
10. Saudi-led coalition strikes Hodeidah, Saada and Amran — port “operational capabilities” and northern targets, after an evacuation warning. ~14.80N, 42.95E. Arab News / Al Arabiya / Reuters.
11. Saudi air defences intercept seven drones — including four over Ras Tanura, Eastern Province; no injuries in the initial assessment. ~26.64N, 50.16E. Al Arabiya / Anadolu.
12. Iran says two tankers hit mines in the Strait of Hormuz — IRGC Navy via state media, early Wednesday, “unauthorized route”; not independently confirmed. ~26.57N, 56.25E. Reuters (via Arab News) / Anadolu. Tag: CLAIM.

Europe
13. Ukrainian drones hit two Samara oil refineries — fires at Rosneft Syzran and Kuibyshev, ~800 km inside Russia; 145 drones intercepted, one person killed. ~53.20N, 50.15E. Kyiv Post / The Independent.
14. Russian overnight strikes kill civilians in Odesa and Kyiv region — two dead in Odesa region (including a 17-year-old); Kyiv apartment fire from drone debris, two injured; one killed near Bila Tserkva. ~46.48N, 30.73E / 50.45N, 30.52E. The Independent / Ukrinform / Reuters.
15. ESA’s Hera arrives at asteroid Dimorphos — inspect the 2022 NASA DART impact; first images due Wednesday. ESA / Darmstadt ~49.87N, 8.65E. BBC News.

Americas
16. Cartagena supermarket hostages all rescued — early-Wednesday raid on the Éxito store after a failed armoured-vehicle robbery; ~30 held, 10 freed in talks, rest rescued; one gunman killed. ~10.39N, 75.48W. Euronews / AFP / El Universal.
17. US preparing new tariffs on 14+ trading partners — Section 301 duties; China, the EU and Japan among those named; announcement as early as Wednesday. ~38.90N, 77.04W. BBC News.
18. US Army detonates unstable explosives in Iowa — controlled, mitigated blast of about 5 tons of degraded lead azide at the Iowa Army Ammunition Plant, Middletown, around 09:00 CST. ~40.83N, 91.26W. AP / US Army.

World
19. UN marks Day for the Elimination of Violence against Women — 25 November; 16 Days of Activism to 10 December; Guterres calls for justice and prevention. New York ~40.75N, 74.00W. UN Press / UN Women. (UNODC/UN Women published the 47,000 partner/family femicide brief on 24 Nov to mark this day — do not present that brief as a 25 Nov exclusive; you may mention the Day itself.)

## DATE CHECK (real earlier dates — show these, do not treat as 25 Nov news)
- 24 Nov — Houthi drone hits a KAFD/PIF tower in Riyadh; 11 wounded (a second strike on that tower in six days; the first was 19 Nov). Reuters / Arab News / Al Jazeera.
- 24 Nov — Brooklyn jury convicts Huawei on fraud, sanctions and trade-secret counts; acquits racketeering. US DOJ / Reuters / AP.
- 24 Nov — Real Madrid 5–1 PSV Eindhoven in the Champions League. UEFA / BBC Sport.
- 24 Nov — Israeli strikes in Gaza kill seven, including Hamas security chief Naeem Abu Nahel. BBC / Al-Monitor / Dawn.
- 24 Nov — CAS reinstates Senegal as 2025 AFCON champions (CAF had awarded the title to Morocco). Anadolu / BBC Sport / CAS.
- 24 Nov — UNODC and UN Women publish the 2026 Femicide Brief (~47,000 women and girls killed by a partner or family member in 2025) ahead of the 25 Nov day. UNODC / UN Women.
- 24 Nov — Mediazona / BBC Russian / Reuters analysis of leaked Rosstat records: about 490,000 recorded Russian military deaths. Mediazona (23 Nov) / Reuters (25 Nov pickup of the same analysis). Keep it in DATE CHECK, not as a Wednesday lead.
- 24 Nov — Two arrested over a suspected burglary at Anmer Hall, Sandringham (incident 23 Nov evening). BBC / Guardian / AP.
- 24 Nov — Federal grand jury in Los Angeles indicts Thomas Markle on two counts of possessing child sexual-abuse material. AP / LA Times.

## When you finish
Downscale to 300×300 and check: date, lead headlines and stat figures readable; no garbled or truncated names; pins on the right land; DATE CHECK readable at 1024 px; 1024×1024, under 1 MiB. Run the text audit. Commit and push to main. Report the head sha, PNG size and dimensions, story count on the page, the text-audit result, a one-line 300 px check, and a one-line pin check.
