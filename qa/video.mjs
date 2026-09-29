// Hero film: deferred loading, playback, shot-synced captions, pause control.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// Uses a globally installed Playwright (npm i -g playwright); override with PW_PATH.
const { execSync } = require('child_process');
const { chromium } = require(process.env.PW_PATH || `${execSync('npm root -g').toString().trim()}/playwright`);
const base = process.argv[2] || 'http://127.0.0.1:4321';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
const page = await ctx.newPage();
const reqs = [];
page.on('request', (r) => { if (/\.(mp4|webm)/.test(r.url())) reqs.push({ url: r.url().split('/').pop(), t: Date.now() }); });
const t0 = Date.now();
await page.goto(base + '/', { waitUntil: 'load' });
const loadAt = Date.now();
await page.waitForTimeout(1500);
const s1 = await page.evaluate(() => { const v = document.querySelector('[data-hero-video]'); return { src: v.currentSrc.split('/').pop(), paused: v.paused, t: v.currentTime.toFixed(1), caption: document.querySelector('[data-hero-place]').textContent.trim() }; });
console.log('video requests:', reqs.map((r) => `${r.url} @+${r.t - t0}ms`).join(', '), '| load event @+' + (loadAt - t0) + 'ms');
console.log('after load:', s1);
const seen = new Set([s1.caption]);
for (let i = 0; i < 16; i++) { await page.waitForTimeout(1000); seen.add(await page.evaluate(() => document.querySelector('[data-hero-place]').textContent.trim())); }
console.log('captions seen in 16s:', [...seen]);
await page.click('[data-hero-toggle]');
await page.waitForTimeout(300);
console.log('after pause:', await page.evaluate(() => { const v = document.querySelector('[data-hero-video]'); return { paused: v.paused, label: document.querySelector('[data-hero-toggle]').getAttribute('aria-label') }; }));
await page.screenshot({ path: 'qa/out/video-playing.png' });
// reduced motion: no video requests at all
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const rp = await rm.newPage();
const rmReqs = [];
rp.on('request', (r) => { if (/\.(mp4|webm)/.test(r.url())) rmReqs.push(r.url()); });
await rp.goto(base + '/', { waitUntil: 'load' });
await rp.waitForTimeout(2000);
console.log('reduced-motion video requests:', rmReqs.length, '| paused:', await rp.evaluate(() => document.querySelector('[data-hero]').dataset.paused));
await browser.close();
