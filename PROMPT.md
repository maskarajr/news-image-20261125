Build an entry for make.fun's daily world-news image competition `news-image-20261125` ("Sum up 25 November's world news in one image").

## Repository & account setup
1. Work in a brand-new public GitHub repository `https://github.com/maskarajr/news-image-20261125` (created today, after 2026-11-25T00:00:00Z). If the remote repo does not exist yet and `gh` is available, create it public under `maskarajr`; otherwise initialize git locally first and push once remote exists.
2. Use the local `git config user.name` and `git config user.email` (never invent a placeholder git author).
3. Add a plain MIT `LICENSE` (copyright 2026 Sameer Mukhtar; do NOT put an `SPDX-License-Identifier:` line on line 1 so GitHub detects `MIT`).
4. Add `.makefun/owner.json` containing exactly:
   ```json
   {"wallet": "2nivb117UGDVwu7tYmhMpJRs9rDMuCvSAPZxZvd2B6iL"}
   ```
5. Write `README.md` with these exact live badges and links (no `{...}` placeholders left):
   - `[![make.fun · news-image-20261125](https://make.fun/badge/news-image-20261125.svg)](https://make.fun/bounty/news-image-20261125?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)`
   - `[![rank](https://make.fun/badge/news-image-20261125/maskarajr/news-image-20261125/rank.svg)](https://make.fun/bounty/news-image-20261125/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)`
   - `[![reward](https://make.fun/badge/news-image-20261125/maskarajr/news-image-20261125/reward.svg)](https://make.fun/bounty/news-image-20261125?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)`
   Plus a short description and run command: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.
   If `gh` is authenticated, also set GitHub About:
   `gh repo edit maskarajr/news-image-20261125 --description "Editorial world-news front page for 25 November 2026. Built by an AI agent for make.fun's Sum up 25 November's world news in one image bounty, $100 in USDC." --homepage "https://make.fun/bounty/news-image-20261125" --add-topic "makefun,ai-agents,bounties,growth"`

## Runtime, sandbox & authorship rules (critical)
- Entrypoint at repo root: `main.ts` running directly on **Node 22** (`node main.ts`, Node 22.23.4 in the grader).
- **Standard library only (`node:fs`, `node:path`, `node:zlib`):** nothing is installed before it runs (`npm install` will NOT run in the grader). Write all rendering code directly in TypeScript files in this repo (no `node_modules`, no `curl`/`wget` of third-party code or fonts, no copying external files). If you vendor anything, it must be pure offline data/code with compatible OSI license and you must keep >60% of text lines authored directly by your writes/edits (writing our own pure-TS renderer + glyph tables keeps authored coverage near 100%).
- Output path: `join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png')`.
- Sandbox limits: **no network**, 1 CPU, **512 MB RAM**, 64 processes, **60 seconds** wall time.
- **Determinism:** the grader runs `node main.ts` twice; both runs MUST produce byte-identical `/output/entry.png` (no `Date.now()`, no `Math.random()`).
- **Gate limits:** valid whole PNG (or JPEG), **<= 1 MiB (1,048,576 bytes)** and **<= 1024 x 1024 pixels** (target **1024 x 1024** PNG, comfortably ~150–450 KB using `zlib.deflateSync` + `zlib.crc32`).
- **Hard limits:**
  - **NO text addressed to the judge** (no "Dear judge", no instructions/meta-notes to any AI evaluator, no mention of make.fun or scoring inside the image).
  - **NO copying** any other entrant's repo, image, or layout. Build everything originally here.

## What the image must show (judge criteria, most important first)
The judge (`glm-5.3-flash`) compares pairs of images with **no news feed** and weighs:
1. **One day's news & clearly dated:** Prominently name **WEDNESDAY, 25 NOVEMBER 2026** in the masthead/header and show specific, recognizable world events of 25 Nov 2026.
2. **Selection & breadth:** Cover major stories across continents and beats (space, diplomacy, conflict/security, courts/tech, politics) — not one country or beat.
3. **Readable at a glance:** A reader who missed the day must immediately understand what happened from crisp headlines, concise 1-line factual sub-bullets, region/category tags, and clean visual illustrations (e.g. a simplified world map with numbered regional markers linking to the stories, a rocket trajectory graphic, ship/port/courthouse/ballot icons). Nothing self-contradictory or false.
4. **Faithful & factual:** Report only verified facts without hype or speculation presented as fact.
5. **Craft & 300px legibility:** One cohesive, high-contrast editorial broadsheet / news-front-page composition on 1024x1024. Must remain legible even downscaled to **~300 px wide**! Use bold visual hierarchy: clear masthead + date banner, a central/top world-map visual with numbered callout pins + lead hero panel, and structured multi-column story cards with generous padding, clean anti-aliased vector/supersampled typography (e.g. 2x supersampled canvas downsampled cleanly, crisp uppercase/mixed-case geometric or bitmap glyphs with kerning and zero clipping/overlap).

## Source material (Wed 25 November 2026 world headlines — embed in code, offline)
Use these verified stories and facts:
1. **CHINA / SPACE — Shenzhou-24 Launches With First Foreign Tiangong Astronaut:** Long March-2F lifted off from Jiuquan (08:18 CST / 00:18 UTC) carrying commander Tang Hongbo, Wu Yi, and Pakistani pilot Zeeshan Ali to Tiangong for a 5–10 day stay. *(Reuters / The Hindu)*
2. **PACIFIC / DIPLOMACY — Australia & Solomon Islands Sign Security Treaty:** PMs Anthony Albanese and Matthew Wale signed a landmark security-and-development pact in Canberra making Australia primary security partner as Honiara lets its 2022 China security deal expire in April 2027. *(AAP / AFR)*
3. **MIDDLE EAST / RED SEA — Houthis Threaten Saudi Ports After Riyadh Strike:** Houthis warned they could target Jeddah and Saudi Red Sea ports if Hodeidah is hit; Saudi-led coalition struck targets in Hodeidah, Saada, and Amran after a drone hit Riyadh's tallest tower (11 wounded) and fighters neared Aden. *(Reuters / AP)*
4. **EUROPE / SECURITY — Strikes Hit Odesa & Kyiv; Poland Protests Drone:** Overnight Russian strikes killed 2 and wounded 3 in Odesa and sparked a Kyiv apartment fire (2 injured); Poland summoned Moscow's ambassador over a Russian surveillance drone airspace breach. *(Reuters)*
5. **US / COURTS & TECH — Huawei Convicted on 10 of 12 Counts:** A Brooklyn federal jury convicted Huawei of bank/wire fraud, Iran sanctions violations, money-laundering conspiracy, and trade-secret theft conspiracy, while acquitting on racketeering and obstruction; Huawei plans to appeal. *(Reuters / BBC)*
6. **GAZA / CONFLICT — Israeli Strikes Kill 7, Including Hamas Security Chief:** Airstrikes across Gaza killed seven Palestinians, including Hamas internal-security director Naeem Abu Nahel and two police officers, straining the Oct 2025 ceasefire. *(Reuters / AFP)*
7. **AMERICAS — US Democrats Reach 259 House Seats; Cartagena Siege:** Democrats clinched at least 259 House seats (largest majority since 1990) after a Tennessee flip; in Cartagena, Colombia, armed robbers fleeing a botched heist held ~30 supermarket hostages (10 freed by nightfall) after a Villavicencio car bomb wounded 25. *(AP / AFP)*

## Engineering & delivery steps
1. Build in modular TypeScript (`main.ts` + clean helper modules such as `png.ts`, `canvas.ts`, `font.ts`, `map.ts`, `stories.ts`) using only Node 22 built-ins (`node:fs`, `node:path`, `node:zlib`).
2. Render at 2x (2048x2048) and box-downsample to 1024x1024 (or anti-aliased pixel coverage) so lines, circles, map coastlines, badges, and text look crisp without jagged edges. Keep runtime well under 5 seconds and memory well under 256 MB.
3. Commit in **several meaningful incremental commits** (e.g., repo skeleton/owner/badges -> PNG/canvas/font primitives -> map & layout -> final visual polish & README) — write every file directly via your file-edit tools so transcripts record all code writes cleanly.
4. Test locally:
   - Run twice into separate output dirs (`out1`, `out2`) and verify `sha256sum` is identical.
   - Verify PNG dimensions = 1024x1024, valid PNG signature/chunks, file size <= 1,048,576 bytes.
   - Visually inspect `/output/entry.png` (or a downscaled 300px check if needed) to confirm zero text overlap, zero clipping, sharp contrast, exact date "WEDNESDAY, 25 NOVEMBER 2026", and balanced regional layout. Fix any layout flaws and commit cleanly.
5. Push to `origin` on GitHub (`main`), and in your final reply report:
   - Repo URL & branch
   - Full 40-char `HEAD` commit SHA
   - `entry.png` byte size and pixel dimensions
   - Confirmation that two runs produced identical SHA-256 hashes
