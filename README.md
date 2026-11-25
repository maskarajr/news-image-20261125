# The World Today — 25 November 2026

[![make.fun · news-image-20261125](https://make.fun/badge/news-image-20261125.svg)](https://make.fun/bounty/news-image-20261125?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)
[![rank](https://make.fun/badge/news-image-20261125/maskarajr/news-image-20261125/rank.svg)](https://make.fun/bounty/news-image-20261125/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)
[![reward](https://make.fun/badge/news-image-20261125/maskarajr/news-image-20261125/reward.svg)](https://make.fun/bounty/news-image-20261125?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)

An original, deterministic editorial world-news front page for Wednesday, 25 November 2026. A dependency-free TypeScript renderer draws the complete edition offline and writes a 1024 × 1024 PNG.

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Requires Node.js 22. No package installation or network access is needed at runtime; all assets are vendored.

The rendering code is MIT licensed. Font files in `fonts/` are from
[`Nutlope/fontzz`](https://github.com/Nutlope/fontzz) and licensed under the
SIL Open Font License 1.1; see `fonts/LICENSE-OFL.txt`.
