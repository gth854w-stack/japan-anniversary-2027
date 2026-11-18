// Run with Node.js and Playwright installed: node tests/experiences.cjs
// Google Forms is stubbed: this never submits a vote or claims to test Google privacy.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
// Pin the pre-feature guide so the preservation check still runs after merging.
const baseline = execFileSync('git', ['show', '6573174:index.html'], { cwd: root, encoding: 'utf8' });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const name = new URL(req.url, 'http://localhost').pathname.replace(/^\/japan-anniversary-2027(?=\/)/, '');
  if (name === '/baseline.html') { res.setHeader('Content-Type', 'text/html'); return res.end(baseline); }
  const file = path.join(root, name === '/' ? 'index.html' : name);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', types[path.extname(file)] || 'text/plain'); res.end(data);
  });
});
const fixture = 'https://docs.google.com/forms/d/e/test_fixture_only/viewform';
let browser;
let comparisons = 0, regressions = 0, invalidCases = 0;
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({
    executablePath: process.env.BROWSER_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    headless: true, args: ['--no-sandbox']
  });
  const context = await browser.newContext();
  context.setDefaultTimeout(10000);
  context.setDefaultNavigationTimeout(10000);
  // Avoid spending the matrix run on long smooth-scroll animations between controls.
  await context.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = 'html{scroll-behavior:auto!important}';
    document.head.append(style);
  }));
  const errors = [];
  const external = [];
  context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  await context.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith(origin)) return route.continue();
    external.push(url);
    if (url.startsWith(fixture)) return route.fulfill({ contentType: 'text/html', body: '<title>Form fixture</title><label>Test preference<input id="preference"></label>' });
    return route.abort();
  });
  const page = await context.newPage();
  for (const configured of [false, true]) {
    await page.route('**/experiences-config.js', route => route.fulfill({
      contentType: 'text/javascript', body: `window.EXPERIENCE_FORM={embedUrl:${JSON.stringify(configured ? fixture + '?embedded=true' : '')}};`
    }));
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(origin + '/experiences.html');
      for (const lang of ['zh', 'en']) {
        await page.locator('#lang-' + lang).click();
        assert.equal(await page.locator('html').getAttribute('lang'), lang === 'zh' ? 'zh-CN' : 'en');
        assert.equal(await page.locator('#lang-' + lang).getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('.category').count(), 4);
        assert.equal(await page.locator('.card').count(), 13);
        assert.equal(await page.locator('.card.current').count(), 4);
        assert.equal(await page.locator('.card.traveler').count(), 3);
        assert.equal(await page.locator('.card.researched').count(), 6);
        for (const id of ['tokaan', 'taihoan', 'fukujuen-uji']) {
          assert.equal(await page.locator(`[data-candidate="${id}"] .chip`).textContent(), lang === 'en' ? 'Suggested by travelers (wife/user)' : '旅行者提出（妻子／用户）');
        }
        assert.equal(await page.locator('[data-candidate="green-cuisine"] .chip.type').textContent(), lang === 'en' ? 'Different type of experience' : '不同类型的体验');
        assert.equal(await page.locator('dd').count(), 39);
        assert.equal(await page.locator('.source .checked').count(), 13);
        for (const link of await page.locator('.source a').all()) {
          assert.ok((await link.getAttribute('href')).startsWith('https://'));
          assert.equal(await link.getAttribute('target'), '_blank');
          assert.equal(await link.getAttribute('rel'), 'noopener noreferrer');
          assert.ok(await link.getAttribute('aria-label'));
        }
        const status = await page.locator('#form-status').textContent();
        assert.ok(status.trim());
        assert.equal(await page.locator('#form-embed iframe').count(), configured ? 1 : 0);
        assert.equal(await page.locator('#form-fallback').isVisible(), configured);
        if (configured) {
          const frame = page.locator('#form-embed iframe');
          assert.equal(await frame.getAttribute('src'), fixture + '?embedded=true');
          assert.equal(await frame.getAttribute('title'), lang === 'en' ? 'Traveler preferences · English and Simplified Chinese' : '旅行者偏好 · 英文与简体中文');
          assert.equal(await page.locator('#form-link').getAttribute('href'), fixture);
          await frame.scrollIntoViewIfNeeded();
          const input = page.frameLocator('#form-embed iframe').locator('#preference');
          // Language changes must not destroy a partially completed response.
          if (lang === 'zh') await input.fill('fixture preference');
          else assert.equal(await input.inputValue(), 'fixture preference');
          const popupPromise = page.waitForEvent('popup');
          await page.locator('#form-link').click();
          const popup = await popupPromise; await popup.waitForLoadState('domcontentloaded');
          assert.equal(popup.url(), fixture); await popup.close();
        } else {
          assert.equal(await page.locator('#form-link').getAttribute('href'), null);
          assert.equal(await page.locator('input,select,textarea,button[type="submit"]').count(), 0);
        }
        const layout = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          blank: [...document.querySelectorAll('h1,h2,h3,dd,.chip,[data-copy]')].some(e => !e.textContent.trim()),
          invisible: [...document.querySelectorAll('.card,.category')].some(e => !e.getBoundingClientRect().width || !e.getBoundingClientRect().height)
        }));
        assert.deepEqual(layout, { overflow: false, blank: false, invisible: false });
        const output = process.env.SCREENSHOT_DIR;
        if (output && !configured && [390, 1440].includes(width)) {
          fs.mkdirSync(output, { recursive: true });
          await page.screenshot({ path: path.join(output, `comparison-${width}-${lang}.png`), fullPage: true });
        }
        comparisons++;
      }
    }
    await page.unroute('**/experiences-config.js');
    console.error(`Comparison states passed: ${configured ? 'configured fixture' : 'unconfigured'}`);
  }
  for (const bad of [
    'javascript:alert(1)', 'http://docs.google.com/forms/d/e/x/viewform?embedded=true',
    'https://docs.google.com.evil.invalid/forms/d/e/x/viewform?embedded=true',
    'https://user:password@docs.google.com/forms/d/e/x/viewform?embedded=true',
    'https://docs.google.com/forms/d/x/edit', 'https://forms.gle/fake',
    fixture + '?embedded=true&entry.1=private', fixture + '?embedded=true#private',
    '<iframe src="' + fixture + '"></iframe>', 42, null
  ]) {
    await page.route('**/experiences-config.js', route => route.fulfill({ contentType: 'text/javascript', body: `window.EXPERIENCE_FORM={embedUrl:${JSON.stringify(bad)}};` }));
    await page.goto(origin + '/experiences.html');
    assert.equal(await page.locator('.card').count(), 13);
    assert.equal(await page.locator('#form-embed iframe').count(), 0);
    assert.equal(await page.locator('#form-fallback').isVisible(), false);
    await page.unroute('**/experiences-config.js'); invalidCases++;
  }
  // Missing config file also leaves a useful, read-only page.
  await page.route('**/experiences-config.js', route => route.abort());
  await page.goto(origin + '/experiences.html?lang=zh');
  assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
  assert.equal(await page.locator('.card').count(), 13);
  assert.equal(await page.locator('#form-embed iframe').count(), 0);
  await page.unroute('**/experiences-config.js');
  // The original guide must differ only by its new translated navigation link.
  const oldPage = await context.newPage();
  await oldPage.goto(origin + '/baseline.html'); await page.goto(origin + '/index.html');
  await page.bringToFront();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const plan of ['A', 'B']) for (const lang of ['en', 'zh']) for (const currency of ['usd', 'jpy', 'cny']) {
      // Render expected baseline data directly; exercise the changed page's real controls.
      // This avoids background-tab animation throttling during baseline clicks.
      await oldPage.evaluate(state => {
        opt = state.plan; lang = state.lang; currency = state.currency; update();
      }, { plan, lang, currency: currency.toUpperCase() });
      await page.locator(`.pick[onclick="choosePlan('${plan}')"]`).click();
      await page.locator('#lang-' + lang).click(); await page.locator('#cur-' + currency).click();
      const snapshot = target => target.evaluate(() => {
        const main = document.querySelector('main').cloneNode(true);
        main.querySelector('[data-t="navExperiencesCompare"]')?.parentElement.remove();
        // Image error fallbacks run at different times as lazy images enter view.
        main.querySelectorAll('.photo,.photo img').forEach(node => node.removeAttribute('style'));
        return main.innerHTML;
      });
      assert.equal(await snapshot(page), await snapshot(oldPage), `${width}/${plan}/${lang}/${currency}: guide changed`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.locator('[data-t="navExperiencesCompare"]').isVisible(), true);
      regressions++;
    }
    console.error(`Original guide regressions passed: ${width}px`);
  }
  // Verify ordinary relative navigation works under GitHub Pages' repository prefix.
  await page.goto(origin + '/japan-anniversary-2027/index.html');
  const nav = page.locator('a[href="experiences.html"]');
  await nav.click(); await page.waitForURL('**/japan-anniversary-2027/experiences.html');
  await page.locator('.back').click(); await page.waitForURL('**/japan-anniversary-2027/index.html');
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ comparisonConfigurations: comparisons, invalidConfigs: invalidCases, missingConfig: 'passed', guideRegressionConfigurations: regressions, jsErrors: errors, externalNetwork: 'stubbed/blocked; no real form submissions tested' }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  await browser?.close(); server.close();
});
