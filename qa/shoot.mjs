// QA screenshots: node qa/shoot.mjs [baseUrl] [outDir] [--motion]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// Uses a globally installed Playwright (npm i -g playwright); override with PW_PATH.
const { execSync } = require('child_process');
const { chromium } = require(process.env.PW_PATH || `${execSync('npm root -g').toString().trim()}/playwright`);

const base = process.argv[2] || 'http://127.0.0.1:4321';
const out = process.argv[3] || 'qa/out/shots';
const motion = process.argv.includes('--motion');
const pages = [['home', '/'], ['listing', '/listing/37-serene-hills-dr/'], ['about', '/about/'], ['credits', '/credits/'], ['thanks', '/thanks/']];
const viewports = [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]];

const fs = await import('fs');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const [vname, vp] of viewports) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: motion ? 'no-preference' : 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const [pname, path] of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += vp.height * 0.8) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(motion ? 700 : 120); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/${pname}-${vname}.png`, fullPage: true });
  }
  if (errors.length) console.log(vname, 'console errors:', errors.slice(0, 10));
  await ctx.close();
}
await browser.close();
console.log('done');
