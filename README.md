# japan-anniversary-2027

Standalone static travel report. `index.html` is the original itinerary;
`experiences.html` is a separate bilingual comparison. Alternatives do not change
the itinerary. No build step is needed.

For a local preview, run `python -m http.server 8767` in this directory and open
`http://localhost:8767/experiences.html`.

Each category has a question number (Q1–Q4) and stable option letters (A–C,
with D for the fourth wagyu choice). Travelers can send a message such as
`Q1 = B` or `Sushi class = B`. The bilingual page includes a blank reply template;
`?` means undecided. These experience letters are separate from trip Option A/B.
No form, account setup, submission or answer storage is involved.

## Browser checks

Requires Node.js and Playwright (tested with 1.62.1). In a fresh development
workspace, install test dependencies with `npm install --no-save --package-lock=false playwright`
and `npx playwright install chromium`, then run:

```sh
node tests/experiences.cjs
```

The test starts its own local server, uses system Chromium when available (or
Playwright's Chromium), and accepts `BROWSER_PATH` to select another Chromium
executable. `SCREENSHOT_DIR=/tmp/japan-comparison-shots` optionally saves captures.

Checks cover both languages, 320/390/768/1440px widths, candidate origins,
stable question/option mappings across languages, reply instructions and template,
absence of forms or answer collection, and all 36 original itinerary configurations.
Original guide content is compared with the pre-feature commit `6573174` (the
repository history must include that commit).

External requests are blocked for repeatability. These checks do not verify
external provider, map or photo loading. Nothing here deploys or publishes the site.
