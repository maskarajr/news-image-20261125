# PROMPT-5 — news-image-20261125 (editorial broadsheet + fontzz + design skills)

## Before pasting into OpenCode (Sameer's one-time PC setup)

1. Install the two chosen design skills into OpenCode's user skills directory (outside the git repo so they do not affect repo authorship checks; do **not** read or overwrite `opencode.json` or any secrets under `%USERPROFILE%\.config\opencode`). Run in PowerShell:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.config\opencode\skills\unslop" | Out-Null
New-Item -ItemType Directory -Force "$env:USERPROFILE\.config\opencode\skills\better-typography" | Out-Null
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/heydamir/unslop/main/skills/unslop/SKILL.md" -OutFile "$env:USERPROFILE\.config\opencode\skills\unslop\SKILL.md"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/jakubkrehel/skills/main/skills/better-typography/SKILL.md" -OutFile "$env:USERPROFILE\.config\opencode\skills\better-typography\SKILL.md"
```

2. Open a fresh (or continued) OpenCode session in `D:\_xfiles\make.fun\news-image-20261125` and paste the **Build prompt** below as one typed message.
3. **Bundling after commit:** Because OpenCode uses those two skills, **omit `--instructions none`** and pass both skill files with `--context`:

```powershell
node cli/makefun.mjs bundle `
  --repo D:\_xfiles\make.fun\news-image-20261125 `
  --harness opencode --harness-version 2.4.1 `
  --provider agentrouter --model gpt-5.6-sol --effort high `
  --system-prompt "$env:USERPROFILE\opencode-system-prompt.txt" `
  --mcp none `
  --context "$env:USERPROFILE\.config\opencode\skills\unslop\SKILL.md" `
  --context "$env:USERPROFILE\.config\opencode\skills\better-typography\SKILL.md" `
  --prompt-origin typed `
  --out my-bundle.tar.gz
```

---

## Build prompt (paste everything below this line into OpenCode)

Load and apply your installed `unslop` and `better-typography` skills directly to this TypeScript PNG broadsheet rebuild—do **not** output HTML/CSS mockups and do **not** pause to ask for direction approval. Commit and push to `main` when done.

### Why `fd1234d` needs a structural editorial redesign
`fd1234d` got all 19 verified stories, a crisp audit, and zero garbles, but next to the #1 broadsheet (~0.988) it still reads like an all-caps dashboard:
1. **Typography:** One condensed all-caps stroke font across the whole page. It needs a **serif masthead and sentence-case serif headlines** paired with a **clean sans-serif** for kickers, stats, decks, wire items, and DATE CHECK.
2. **Art:** 12 small 56×54 flat icons inside cards. Replace them with **8 rich flat-editorial vector scene panels** (sky, horizon, architecture, silhouettes, event action drawn in code) above the headline.
3. **Headlines & copy:** 3–4-word all-caps labels (`ODESA AND KYIV HIT`). Write crisp **sentence-case news headlines** (≤8 words) with a **1-line factual deck** and source line underneath.
4. **Density & 300 px legibility:** 12 lead boxes + 7 wires + a 2-column 175 px DATE CHECK box + a huge dark-navy map box crowd the page and turn small text to noise at 300 px. Move to **8 illustrated leads + an 11-item numbered wire + a small light-field Natural Earth locator map + a slim one-paragraph DATE CHECK footer**.
5. **Two factual/editorial fixes:**
   - **Rosstat date:** Mediazona first published the leaked Rosstat analysis on **23 Nov** (Reuters picked it up 25 Nov). Label it **23 Nov** in DATE CHECK, not 24 Nov.
   - **Region list:** Drop `'SOUTHERN OCEAN'` as a separate region. Use only **6 regions**: Asia (6), Oceania (3 — includes Balleny Islands), Middle East (3), Europe (3), Americas (3), World (1).

### Output and runtime constraints (keep strictly)
- Output path: `process.env.MAKEFUN_OUTPUT_DIR ?? '/output'`, `mkdirSync(..., { recursive: true })`, filename `entry.png`.
- `1024×1024` PNG, **under 1 MiB**, **Node 22 stdlib only** (`npm` dependencies forbidden, no network at runtime), finish well under 60 s / 512 MB.
- **Deterministic:** two runs must produce byte-identical PNGs (no `Date.now()`, no `Math.random()`).
- Date on the page: **Wednesday 25 November 2026**.

### Typography: vendor `Nutlope/fontzz` static TTFs (SIL OFL 1.1)
Download the static TTFs for **Meridian** (transitional serif with large x-height and even color—stays legible at 300 px) and **Halden** (neutral neo-grotesque with tabular figures) from `Nutlope/fontzz` into `fonts/`:
- `https://raw.githubusercontent.com/Nutlope/fontzz/main/site/public/downloads/Meridian.zip` -> extract `Meridian/static/Meridian-Bold.ttf` (and optionally `Meridian-Regular.ttf`) to `fonts/`
- `https://raw.githubusercontent.com/Nutlope/fontzz/main/site/public/downloads/Halden.zip` -> extract `Halden/static/Halden-Regular.ttf` and `Halden/static/Halden-Bold.ttf` to `fonts/`
- Save `Meridian/OFL.txt` as `fonts/LICENSE-OFL.txt` (that filename keeps license text properly attributed under SIL OFL 1.1), and add one short note in `README.md` stating that the code is MIT and files in `fonts/` are licensed under SIL Open Font License 1.1 (`Nutlope/fontzz`).

In `font.ts`, replace the monoline stroke alphabet with a clean stdlib **TrueType outline parser + rasterizer**:
- Parse `head`, `hhea`, `maxp`, `hmtx`, `cmap` (format 4), `loca` (short & long offsets), and `glyf` (**must support both simple glyphs and composite glyphs**—`Meridian-Bold.ttf` has 122 composite glyphs).
- Flatten quadratic Bezier curves (`onCurve` / off-curve midpoint interpolation) into contour polygons and rasterize on the 2× supersampled canvas using a crisp scanline winding/even-odd fill. Cache rasterized glyphs or contours by `(font, size, char)` so rendering stays under ~100 ms.
- Use **only characters present in the TTFs** (285 glyphs, including `−`, `–`, `—`, `é`, `É`, `’`, `‘`, `×`, `°`). Note: `≈` is not in the TTF; use `~` instead.
- Use **sentence case** (not all caps) for masthead date, lead headlines, decks, wire summaries, and DATE CHECK. Apply `better-typography` and `unslop` discipline: strong size contrast between masthead / lead headlines / decks / meta; never shrink body text below 13–14 px or over-condense lines horizontally; keep dark ink (`#111820`) on warm newsprint (`#F6F1E5` / `#FBF8F1`) for ≥7:1 contrast.

### Broadsheet layout (`1024×1024`, top to bottom)
Design like a classic broadsheet front page—clean hairline rules and whitespace instead of heavy bordered boxes:
1. **Running top bar (~22 px):** Thin top rule; left `THE WORLD IN ONE DAY`, right `ALL 19 STORIES DATED WEDNESDAY 25 NOV` in small crisp `Halden-Bold`.
2. **Masthead date (~76 px):** Centered **`Wednesday 25 November 2026`** in `Meridian-Bold` (≥64 px cap/em height, readable immediately at 300 px), flanked by crisp horizontal rules.
3. **Audit bar (~20 px):** One centered `Halden` line: `19 stories, all dated 25 November 2026 · Asia 6 · Middle East 3 · Europe 3 · Americas 3 · Oceania 3 · World 1 · All sourced`.
4. **Kicker strip (~26 px):** 3 short sentence-case `Meridian` items separated by `◆` (e.g., `Shenzhou-24 docks with Pakistani pilot ◆ KOSPI plunges 6.16% ◆ Australia–Solomons pact signed`).
5. **Stat strip (~50 px, max 6 items):** Light warm-stone tint (`#ECE5D5`) with subtle vertical hairlines—**at most 6** large figures in `Halden-Bold` (28–30 px) with concise sentence-case 2-line labels (12–13 px):
   `−6.16%` (KOSPI close), `4.9%` (Australia Oct CPI), `+36%` (Dhaka garment wage), `~30` (Cartagena hostages), `03:56` (Tiangong docking UTC), `M5.9` (Balleny Islands quake).
6. **Illustrated leads (8 total — 2 rows, ~475 px total):**
   - **Row 1 (2 or 3 hero leads across full width, ~245 px tall):** e.g., **1. Shenzhou-24 docks**, **2. Seoul chipmakers / KOSPI −6.16%**, **7. Australia–Solomons security treaty**. Each has a wide landscape editorial vector scene (~90–100 px tall), a small colored region/place kicker (`ASIA · JIUQUAN`), a 2-line `Meridian-Bold` sentence-case headline (22–26 px, readable at 300 px), a concise 2-line `Halden` factual deck (13–14 px), and a muted source line.
   - **Row 2 (5 or 6 mid leads across 3 columns or 3+2, ~220 px tall):** e.g., **10. Hodeidah port strikes**, **13. Samara refinery drones**, **16. Cartagena supermarket rescue**, **17. US Section 301 tariffs**, **12. Hormuz tanker mines** (with crisp red `CLAIM` tag), plus optionally **14. Odesa & Kyiv strikes** (or **11. Ras Tanura drones** if 3+5=8). Each has an illustrated landscape vector scene (~62–72 px tall), place kicker, sentence-case `Meridian-Bold` headline (19–22 px), 1-line `Halden` deck (13 px), and source line.
   - Every scene panel must be a **composed editorial illustration** in code (layered sky/ground/buildings/ships/drones/refineries/horizon/figures in a cohesive 5-color editorial palette: deep ink, newsprint cream, slate blue, ochre/amber, crimson)—never a centered geometric icon on a grey square.
7. **Lower broadsheet: “Also on 25 November — 11 more stories” + small locator map (~235 px tall):**
   - **Left column (~270 px wide):** **Where it happened** small light-field map (`#E7E4DA` ocean, `#C8CEBF` land, crisp 1 px `#5B6860` coastlines) using Natural Earth 110m simplified land polygons passed through `map.ts`'s `project()` (`x = 315 + 1.9794·lon − 0.00001994·lon³`, `y = 308 − 1.6·lat`). Plot all 19 numbered pins colored by the **6 regions**; offset Canberra `7` and `8` slightly with short leader lines; place Balleny `9` cleanly in the Southern Ocean south-east of New Zealand; place `15` at Darmstadt (ESA). Keep a compact 2-line region legend + Canberra offset note underneath.
   - **Right two columns (~690 px wide):** Compact numbered wire list for the **11 remaining stories** not in the 8 illustrated leads (6 in one column, 5 in the next, or similar balanced split). Each item: bold number badge/numeral + **Place** + crisp sentence-case summary with key figure + source (`13 px` `Halden`, sharp at 1024 px).
8. **Slim one-paragraph `DATE CHECK` footer (~54 px tall):**
   - Thin top border, vertical red accent bar on left, bold `DATE CHECK` label, and **one clean wrapped paragraph** (`12.5–13 px` `Halden`) stating that all 19 items above occurred or were first reported on 25 Nov 2026, while separating earlier stories with their real dates: **23 Nov** — leaked Rosstat analysis (~490k Russian military deaths, Mediazona; Reuters pickup 25 Nov); **24 Nov** — Riyadh PIF tower strike (11 wounded), Huawei Brooklyn verdict, Real Madrid 5–1 PSV, Gaza strikes (7 killed), CAS restores Senegal AFCON title, UNODC/UN Women 47k femicide brief, Anmer Hall arrests (incident 23 Nov), Thomas Markle indictment.

### Verified 25 November 2026 stories (use ONLY these 19 — never invent stories, numbers, or dates)
**Asia (6)**
1. **Jiuquan, China** — China launches Shenzhou-24 with Pakistan's first astronaut: lift-off ~00:18–00:21 UTC, docked with Tiangong at 03:56 UTC; Tang Hongbo, Wu Yi, Pakistani pilot Muhammad Zeeshan Ali (~5–10 day stay). `[100.30, 40.96]`. Reuters / AP / BBC.
2. **Seoul, South Korea** — Seoul shares drop 6.16% as chipmakers slump: KOSPI 4,697.51 (−6.16%); Samsung −9.87%, SK hynix −11.05%; 09:09 KST sidecar. `[126.98, 37.57]`. Yonhap.
3. **Tokyo, Japan** — Japan services PPI rises +4.2% y/y in October, 36-year high (fastest since 1990; freight, leasing, hotels). `[139.65, 35.68]`. Reuters / CNA / BOJ.
4. **Dhaka, Bangladesh** — Bangladesh raises garment minimum wage 36% (Tk 12,500 to Tk 17,000/month from 1 Dec) after protests. `[90.41, 23.81]`. AP / Al Jazeera / The Straits Times.
5. **Pyongyang, North Korea** — North Korea expels Swiss diplomat Sylvain Astier (48 hours to leave) and orders new Swiss office shut after Songdowon sanctions. `[125.76, 39.04]`. AP / Euronews / The Korea Times.
6. **Jakarta, Indonesia** — OECD reviews Indonesia's accession in Jakarta: Sec-Gen Mathias Cormann says technical reviews across 25 policy areas ~80% done; no fixed 2028 date. `[106.85, -6.21]`. ANTARA / CNBC Indonesia.

**Oceania (3)**
7. **Canberra, Australia** — Australia and Solomon Islands sign security treaty: Albanese and Matthew Wale; Australia security partner of choice; no foreign military bases; 2022 China pact understood not to be renewed (expires Apr 2027). `[149.13, -35.28]`. BBC / NYT / AP / AAP.
8. **Canberra, Australia** — Australia October CPI jumps to 4.9% y/y (+0.5% m/m, 3-year high; trimmed mean 3.8%; electricity +25.2%). `[149.13, -35.28]`. ABC / ABS.
9. **Balleny Islands (Oceania)** — M5.9 earthquake hits Balleny Islands region at 01:38 UTC, ~10 km deep; green alert, no population exposure. `[170.94, -63.09]`. USGS.

**Middle East (3)**
10. **Hodeidah, Yemen** — Saudi-led coalition strikes Hodeidah port capabilities plus Saada and Amran after evacuation warning. `[42.95, 14.80]`. Arab News / Al Arabiya / Reuters.
11. **Ras Tanura, Saudi Arabia** — Saudi air defences intercept seven drones, including four over Ras Tanura in Eastern Province; no initial injuries. `[50.16, 26.64]`. Al Arabiya / Anadolu.
12. **Strait of Hormuz** — Iran's IRGC Navy claims two tankers hit mines on an "unauthorized route" early Wednesday (unverified). **Tag: CLAIM**. `[56.25, 26.57]`. Reuters / Arab News / Anadolu.

**Europe (3)**
13. **Samara, Russia** — Ukrainian drones hit Rosneft's Syzran and Kuibyshev refineries ~800 km inside Russia; 145 drones intercepted, one killed. `[50.15, 53.20]`. Kyiv Post / The Independent.
14. **Odesa & Kyiv, Ukraine** — Russian overnight strikes kill two in Odesa region (incl. a 17-year-old), injure two in Kyiv apartment fire, kill one near Bila Tserkva. `[30.62, 48.47]`. The Independent / Ukrinform / Reuters.
15. **Darmstadt, Germany** — ESA's Hera spacecraft arrives at asteroid Dimorphos to inspect the 2022 NASA DART impact; first images due Wednesday. `[8.65, 49.87]`. BBC News.

**Americas (3)**
16. **Cartagena, Colombia** — Hostages rescued in early-Wednesday raid on Éxito supermarket after failed armoured-car robbery; ~30 held, 10 freed in talks, rest rescued; one gunman killed. `[-75.48, 10.39]`. Euronews / AFP / El Universal.
17. **Washington, US** — US preparing new Section 301 tariffs on 14+ trading partners including China, EU, and Japan; announcement as early as Wednesday. `[-77.04, 38.90]`. BBC News.
18. **Middletown, Iowa** — US Army conducts controlled blast of ~5 tons of unstable lead azide at Iowa Army Ammunition Plant (~09:00 CST). `[-91.26, 40.83]`. AP / US Army.

**World (1)**
19. **New York, UN** — UN marks International Day for the Elimination of Violence against Women (25 Nov), launching 16 Days of Activism to 10 Dec; Guterres urges prevention. `[-74.00, 40.75]`. UN Press / UN Women.

### Self-checks before committing
1. **Text audit (`scripts/text-audit.ts`):** Update for mixed-case/sentence-case strings and the TTF's 285-glyph set; fail if any required name (`Strait of Hormuz`, `Ras Tanura`, `Hodeidah`, `Shenzhou-24`, `Zeeshan Ali`, `Dimorphos`, `Cartagena`, `Sylvain Astier`, `Yonhap`, `Ukrinform`, `Al Jazeera`, `Al-Monitor`, `Balleny`, `Middletown`, `Éxito`) is missing or garbled, if any string has `...`/`…`, if `'SOUTHERN OCEAN'` appears as a region, if Rosstat says `24 Nov` instead of `23 Nov`, or if story/pin numbering `1–19` mismatches.
2. **Determinism & runtime:** Run twice and confirm byte-identical `entry.png`, `1024×1024`, `< 1 MiB`, under 60 s.
3. **300×300 visual self-check:** Downscale `entry.png` to `300×300` and inspect it: verify the serif masthead date, stat strip (≤6 items), all 8 lead headlines, and continent silhouettes are crisp and legible.
4. Commit and push to `main`. Report: head SHA, `entry.png` size & dimensions, story count (8 illustrated + 11 wire = 19), text-audit result, 300 px check summary, and pin check summary.
