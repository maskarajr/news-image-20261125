# PROMPT-3 — news-image-20261125 (legibility pass)

Paste this as one message in the OpenCode session for the public repo `https://github.com/maskarajr/news-image-20261125` (head 75cb97d). When you're done, commit and push to **main**.

Our entry scored 0.963 (9 wins, 2 draws, 1 loss). The wins came from breadth: 16 dated, sourced stories across six regions, plus the DATE CHECK. The loss and both draws were all about **legibility at about 300 px**. The judge said the dense pixel-font text "shrinks to unreadable specks". It flagged garbled strings ("STRAIT OF HAHNUZ", "RAN TANURA", "ALONI FACTS") as breaking the no-garbled-text rule, and called the map "a smeared, distorted blob". Keep the content and fix the readability.

## Keep
- The same 16 verified 25 Nov stories, with the same facts, numbers and sources (see the existing code and PROMPT-2). Don't add or invent anything.
- The masthead "Wednesday 25 November 2026", the region spread, the source marks, the "not independently confirmed" hedge on the Hormuz tankers, and the DATE CHECK box with its five 24 Nov items.
- The output path `process.env.MAKEFUN_OUTPUT_DIR ?? '/output'` + `entry.png`. Keep the output 1024×1024, under 1 MiB, standard library only, no network, under 60 s, and byte-identical across runs.

## Change
1. **Fonts:** drop the pixel/bitmap font for all text. Use a clean, bold, high-contrast vector-style font, either rendered from glyph outlines or as a crisp, well-hinted built-in bitmap at large sizes. Minimum cap heights at 1024 px:
   - masthead: 56 px or more
   - lead headlines: 28 px or more
   - fact lines: 18 px or more
   - wire and DATE CHECK lines: 15 px or more
   Use dark text on a light background, or the reverse, with strong contrast. No outlined or dithered text.
2. **No garbled text.** Spell every place name correctly: Strait of Hormuz, Ras Tanura, Hodeidah, Shenzhou-24, Dimorphos, Cartagena. Write `scripts/text-audit` (or a test) that lists every string drawn on the page, and check that none is truncated or misspelled and that no glyph is missing. Every non-ASCII character (−, é, ’) needs a real glyph; otherwise use its ASCII form.
3. **Hierarchy for a 300 px glance:**
   - Use 6–8 big lead tiles, each with a bold short headline (no more than 6 words), one large icon or illustration, and one fact line.
   - Pick the leads by consequence and spread: Shenzhou-24, KOSPI −6%, Australia–Solomons treaty, Hodeidah strikes, Samara refineries, Cartagena hostages, US Section 301 tariffs, and Hormuz tanker mines (claim).
   - The other 8 go into an "Also on 25 November" wire list, one short line each with its source.
4. **Stat strip:** at most 5 figures, each large enough to read at 300 px.
5. **Map:** drop it, or keep a simple clean world silhouette no bigger than 220 px wide, with crisp coastlines and at most 8 numbered pins on the right land. Leave it out if it can't look crisp.
6. **Whitespace:** use clear gutters between tiles and fewer boxes. It should look like a clean front page, not a dashboard.

## When you finish
Downscale the PNG to 300×300 and look at it. The masthead date, every lead headline and the stat figures must be readable at that size. Then commit and push to main. Report:
- the head sha
- the PNG size
- the text-audit output (count of strings and any problems)
- a one-line legibility check at 300 px
