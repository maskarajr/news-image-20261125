# PROMPT-2 — news-image-20261125 (OpenCode rebuild)

Paste this as one message in the **same public repo** `https://github.com/maskarajr/news-image-20261125` (continue the existing OpenCode session if it is still open; otherwise start a new session in this repo after 05:00 PKT on 25 Nov 2026). Commit and push to **main** when done.

You already have a working pixel/retro front page with seven story cards and a world map. Rework it into a **dense one-day newspaper front page** in the same flat retro/pixel style. Do not turn it into a 7-card magazine cover.

## Output and constraints
- Write `/output/entry.png` via the existing path helper: `process.env.MAKEFUN_OUTPUT_DIR ?? '/output'`, `mkdir` recursive, filename `entry.png`. Do not hardcode a local `out` folder as the default (that folder is only for a local run that sets `MAKEFUN_OUTPUT_DIR=out`).
- 1024×1024 PNG or JPEG, under 1 MiB, standard library only, no network, finish in 60 s. Two runs must be byte-identical (no `Date.now()`, no `Math.random()`).
- Keep typography sharp at 1024 px; no label/icon overlaps; date on the page is Wednesday, 25 November 2026.

## Layout (match what is winning on this bounty)
1. **Masthead** — title plus “Wednesday 25 November 2026”, a count of stories and regions, and “all dated, all sourced”.
2. **Kicker / stat strip** — 5–8 quotable figures drawn only from the verified list below (examples: KOSPI −6.16%, CPI 4.9%, wage +36%, 7 drones, ~30 hostages, 11:56 docking).
3. **10–16 illustrated lead items** — simple geometric scene art (not stock photos), each with place, a short headline, one fact line, a source mark, and a confirmation-style tag only if the source supports it.
4. **“Also on 25 November” wire list** — the remaining verified 25 Nov items in compact sourced lines.
5. **DATE CHECK box** — state that every 25 Nov item happened or was first reported that day, and name the earlier well-known stories below with their real dates (24 Nov). Do not pass those off as Wednesday news.
6. **“Where it happened” locator** — a small map, not the hero. Embed simplified Natural Earth 110m land (or an equivalent coastline set you ship in the repo), run through the existing `project()` in `map.ts` (`x = 315 + 1.9794·lon − 0.00001994·lon³`, `y = 308 − 1.6·lat`). Crop/scale the land so continents are recognisable in the panel. **Numbered pins must match story numbers and sit on the correct landmass — verify every pin.** Colour pins or counts by region (Asia, Oceania, Middle East, Europe, Americas, World). Story 13 (Hera) may sit as a Europe/ESA or “space” mark, not a fake asteroid on Earth.

## Editorial rules
- Use **only** the verified 25 November 2026 stories listed below. There are **16** (not 35). Do not invent events, numbers, death tolls, or datelines to fill space. You may add a story only if you independently verify, from a reputable wire, that it happened or was first reported on 25 Nov 2026.
- Cover the regions we actually have: Asia, Oceania, Middle East, Europe, Americas, plus the UN day. There is no separately verified Africa breaking story for 25 Nov; do not invent one. African items from 24 Nov belong only in DATE CHECK.
- Split Tuesday items out of the old seven-card set: Huawei, the Gaza strike that killed seven, the 259-seat House result, the Riyadh tower attack, and Poland’s drone protest are **not** 25 Nov leads (Poland was earlier than 24 Nov). The Cartagena raid **is** 25 Nov; the overnight Odesa/Kyiv strikes may run as 25 Nov overnight news.

## Verified 25 November 2026 stories (use these)

Asia
1. China launches Shenzhou-24 with first foreign astronaut — Jiuquan lift-off ~00:18–00:21 UTC, docked with Tiangong at 03:56 UTC; Tang Hongbo, Wu Yi, Pakistani pilot Muhammad Zeeshan Ali, stay about 5–10 days. ~40.96N, 100.30E. Reuters / AP / BBC.
2. Seoul shares fall 6% as chipmakers slump — KOSPI −6.16% to 4,697.51; Samsung −9.87%; SK hynix −11.05%; 09:09 KST sidecar. ~37.57N, 126.98E. Yonhap.
3. Japan services inflation hits a 36-year high — October services PPI +4.2% y/y, fastest since 1990 (freight, leasing, hotels). ~35.68N, 139.65E. Reuters / CNA / BOJ.
4. Bangladesh raises garment minimum wage 36% — Tk 12,500 to Tk 17,000 a month, from 1 December, after protests. ~23.81N, 90.41E. AP / Al Jazeera / The Straits Times.
5. North Korea expels Swiss diplomat, orders office shut — Sylvain Astier persona non grata, 48 hours to leave; new Swiss office in Pyongyang to close, after sanctions on the Songdowon camp. ~39.04N, 125.76E. AP / Euronews / The Korea Times.

Oceania
6. Australia and Solomon Islands sign security treaty — Canberra; Albanese and Matthew Wale; Australia the security partner of choice; no foreign military bases; 2022 China pact understood not to be renewed (expires April 2027). ~35.28S, 149.13E. BBC / NYT / AP / AAP.
7. Australia inflation jumps to 4.9% — October CPI +0.5% m/m, 4.9% y/y (three-year high); trimmed mean 3.8%; electricity +25.2%. ~35.28S, 149.13E. ABC / ABS.

Middle East
8. Saudi-led coalition strikes Hodeidah, Saada and Amran — port “operational capabilities” and northern targets, after an evacuation warning. ~14.80N, 42.95E. Arab News / Al Arabiya / Reuters.
9. Saudi air defences intercept seven drones — including four over Ras Tanura, Eastern Province; no injuries in the initial assessment. ~26.64N, 50.16E. Al Arabiya / Anadolu.
10. Iran says two tankers hit mines in the Strait of Hormuz — IRGC Navy via state media, early Wednesday, “unauthorized route”; not independently confirmed. ~26.57N, 56.25E. Reuters (via Arab News) / Anadolu.

Europe
11. Ukrainian drones hit two Samara oil refineries — fires at Rosneft Syzran and Kuibyshev, ~800 km inside Russia; 145 drones intercepted, one person killed. ~53.20N, 50.15E. Kyiv Post / The Independent.
12. Russian overnight strikes kill civilians in Odesa and Kyiv region — two dead in Odesa region (including a 17-year-old); Kyiv apartment fire from drone debris, two injured; one killed near Bila Tserkva. ~46.48N, 30.73E / 50.45N, 30.52E. The Independent / Ukrinform / Reuters.
13. ESA’s Hera arrives at asteroid Dimorphos — inspect the 2022 NASA DART impact; first images due Wednesday. ESA / Darmstadt ~49.87N, 8.65E. BBC News.

Americas
14. Cartagena supermarket hostages all rescued — early-Wednesday raid on the Éxito store after a failed armoured-vehicle robbery; ~30 held, 10 freed in talks, rest rescued; one gunman killed. ~10.39N, 75.48W. Euronews / AFP / El Universal.
15. US preparing new tariffs on 14+ trading partners — Section 301 duties, China, the EU and Japan among those named; announcement as early as Wednesday. ~38.90N, 77.04W. BBC News.

World
16. UN marks Day for the Elimination of Violence against Women — 25 November; 16 Days of Activism to 10 December; Guterres calls for justice and prevention. New York ~40.75N, 74.00W. UN Press / UN Women.

## DATE CHECK (real earlier dates — show these, do not treat as 25 Nov news)
- 24 Nov — Houthi drone hits a KAFD/PIF tower in Riyadh; 11 wounded. Reuters / Arab News.
- 24 Nov — Brooklyn jury convicts Huawei on fraud, sanctions and trade-secret counts; acquits racketeering. US DOJ / Reuters / AP.
- 24 Nov — Real Madrid 5–1 PSV Eindhoven in the Champions League. UEFA / BBC Sport.
- 24 Nov — Israeli strikes in Gaza kill seven, including Hamas security chief Naeem Abu Nahel. BBC / Al-Monitor / Dawn.
- 24 Nov — CAS reinstates Senegal as 2025 AFCON champions (CAF had awarded the title to Morocco). Anadolu / BBC Sport / CAS.

## When you finish
Visually check: no overlaps, pins on the right land, DATE CHECK readable, 1024×1024, under 1 MiB. Commit and push to main. Report the head sha, PNG size and dimensions, story count on the page, and a one-line pin check.
