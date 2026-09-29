// Text contrast over the hero film. Frames are extracted first with ffmpeg into
// qa/out/contrast/frames/ (Playwright's Chromium can't decode H.264, so each frame
// is shown through the <video> poster). Then run: python3 qa/hero-contrast.py
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// Uses a globally installed Playwright (npm i -g playwright); override with PW_PATH.
const { execSync } = require('child_process');
const { chromium } = require(process.env.PW_PATH || `${execSync('npm root -g').toString().trim()}/playwright`);
const fs = await import('fs');
const base = process.argv[2] || 'http://127.0.0.1:4321';
const out = 'qa/out/contrast';
const frames = fs.readdirSync(`${out}/frames`).filter((f) => f.endsWith('.jpg')).sort();
const targets = {
  small: ['.site-header .wordmark__name', '.site-header .wordmark__firm', '.site-nav a', '.site-header__cta', '.menu-button', '.hero__kicker', '.hero__now-label', '.hero__place', '.hero__toggle'],
  large: ['.hero__title .intro-line > span'],
};
const browser = await chromium.launch();
const result = [];
for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'laptop', width: 1280, height: 720 }, { name: 'mobile', width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.addStyleTag({ content: `.hero *, .site-header * { color: transparent !important; border-color: transparent !important; } .hero .icon, .site-header .icon { visibility: hidden !important; }` });
  const boxes = {};
  for (const [kind, sels] of Object.entries(targets)) {
    boxes[kind] = [];
    for (const sel of sels) for (const el of await page.$$(sel)) {
      const b = await el.boundingBox();
      if (b && b.width > 2 && b.height > 2 && b.y < vp.height) boxes[kind].push({ sel, ...b });
    }
  }
  for (const f of frames) {
    const data = 'data:image/jpeg;base64,' + fs.readFileSync(`${out}/frames/${f}`).toString('base64');
    await page.evaluate((src) => new Promise((res) => {
      const v = document.querySelector('[data-hero-video]');
      const img = new Image(); img.onload = () => { v.poster = src; setTimeout(res, 150); }; img.src = src;
    }), data);
    const file = `${out}/${vp.name}-${f.replace('.jpg', '.png')}`;
    await page.screenshot({ path: file });
    result.push({ viewport: vp.name, t: f, file, boxes });
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(`${out}/boxes.json`, JSON.stringify(result, null, 1));
console.log('frames measured:', result.length);
