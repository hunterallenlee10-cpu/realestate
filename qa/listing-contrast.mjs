// Text contrast over the listing hero photo (static). Then: python3 qa/hero-contrast.py
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// Uses a globally installed Playwright (npm i -g playwright); override with PW_PATH.
const { execSync } = require('child_process');
const { chromium } = require(process.env.PW_PATH || `${execSync('npm root -g').toString().trim()}/playwright`);
const fs = await import('fs');
const base = process.argv[2] || 'http://127.0.0.1:4321';
const out = 'qa/out/contrast';
fs.mkdirSync(out, { recursive: true });
const targets = {
  small: ['.site-header .wordmark__name', '.site-header .wordmark__firm', '.site-nav a', '.site-header__cta', '.menu-button', '.lhero__copy > .label', '.lhero__status', '.lhero__meta .specs', '.lhero__toggle'],
  large: ['.lhero__title .intro-line > span', '.lhero__town', '.lhero__price'],
};
const browser = await chromium.launch();
const result = [];
for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'laptop', width: 1280, height: 720 }, { name: 'mobile', width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/listing/37-serene-hills-dr/', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: `.lhero *, .site-header * { color: transparent !important; border-color: transparent !important; } .lhero .icon, .site-header .icon { visibility: hidden !important; }` });
  const boxes = {};
  for (const [kind, sels] of Object.entries(targets)) {
    boxes[kind] = [];
    for (const sel of sels) for (const el of await page.$$(sel)) {
      const b = await el.boundingBox();
      if (b && b.width > 2 && b.height > 2 && b.y < vp.height) boxes[kind].push({ sel, ...b });
    }
  }
  const file = `${out}/listing-${vp.name}.png`;
  await page.screenshot({ path: file });
  result.push({ viewport: vp.name, t: 'still', file, boxes });
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${out}/boxes.json`, JSON.stringify(result, null, 1));
console.log('measured:', result.length);
