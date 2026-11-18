# japan-anniversary-2027

Standalone static travel report. `index.html` is the original itinerary;
`experiences.html` is a separate bilingual comparison. Alternatives do not change
the itinerary. No build step is needed.

For a local preview, run `python -m http.server 8767` in this directory and open
`http://localhost:8767/experiences.html`.

Google Forms voting is disabled until a real owner-created form is configured.
See [GOOGLE_FORM_SETUP.md](GOOGLE_FORM_SETUP.md) for the bilingual question list,
response privacy settings, embed URL insertion and pre-merge verification.

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
missing/invalid/configured form states, iframe preservation on language changes,
external fallback navigation, and all 36 original itinerary configurations.
Original guide content is compared with the pre-feature commit `6573174` (the
repository history must include that commit).

External requests are blocked or stubbed for repeatability. The form fixture is
test-only; these checks do not submit votes, validate Google account settings or
prove that a real Form can load. Follow the owner checklist in the setup document
before enabling voting. Nothing here deploys or publishes the site.
