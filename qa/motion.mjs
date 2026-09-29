// Motion + interaction checks against the preview server.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// Uses a globally installed Playwright (npm i -g playwright); override with PW_PATH.
const { execSync } = require('child_process');
const { chromium } = require(process.env.PW_PATH || `${execSync('npm root -g').toString().trim()}/playwright`);
const base = process.argv[2] || 'http://127.0.0.1:4321';
const out = 'qa/out/motion';
(await import('fs')).mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const errors = [];
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(250);
await page.screenshot({ path: `${out}/home-t0.png` });
await page.waitForTimeout(2600);
await page.screenshot({ path: `${out}/home-t1.png` });
console.log('motion class:', await page.evaluate(() => document.documentElement.classList.contains('motion')), 'ready:', await page.evaluate(() => window.__motionReady));
console.log('lenis:', await page.evaluate(() => !!window.__lenis));

// Scroll slowly through the whole page with the mouse wheel (Lenis-driven).
let last = -1;
for (let i = 0; i < 400; i++) {
  await page.mouse.wheel(0, 420);
  await page.waitForTimeout(90);
  const y = await page.evaluate(() => window.scrollY);
  if (i % 25 === 0) console.log('scrollY', y);
  if (y === last && i > 10) break;
  last = y;
}
await page.waitForTimeout(2500);
const hidden = await page.evaluate(() =>
  [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).visibility === 'hidden' || parseFloat(getComputedStyle(el).opacity) < 0.99).map((el) => el.className + ' ' + (el.textContent || '').trim().slice(0, 40)),
);
console.log('still hidden after full scroll:', hidden.length, hidden.slice(0, 8));
console.log('header state at bottom:', await page.evaluate(() => document.querySelector('[data-site-header]').dataset.state));

// Anchor link: scroll to top then click "Neighborhoods" in the nav.
await page.evaluate(() => window.__lenis.scrollTo(0, { immediate: true }));
await page.waitForTimeout(400);
await page.click('.site-nav a[href="/#neighborhoods"]');
await page.waitForTimeout(2400);
const nb = await page.evaluate(() => { const r = document.getElementById('neighborhoods').getBoundingClientRect(); return { top: Math.round(r.top), focused: document.activeElement?.id, hash: location.hash }; });
console.log('after nav click:', nb);
await page.screenshot({ path: `${out}/home-neighborhoods.png` });

// Hero pause toggle
await page.evaluate(() => window.__lenis.scrollTo(0, { immediate: true }));
await page.waitForTimeout(300);
const btn = page.locator('[data-hero-toggle]');
console.log('toggle before:', await btn.getAttribute('aria-label'));
await btn.click();
console.log('toggle after:', await btn.getAttribute('aria-label'), 'paused:', await page.evaluate(() => document.querySelector('[data-hero]').dataset.paused));

// Keyboard: first tab stops
await page.goto(base + '/', { waitUntil: 'networkidle' });
const stops = [];
for (let i = 0; i < 9; i++) {
  await page.keyboard.press('Tab');
  stops.push(await page.evaluate(() => { const a = document.activeElement; return `${a.tagName.toLowerCase()}:${(a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30)}`; }));
}
console.log('tab order:', stops.join(' | '));
await page.screenshot({ path: `${out}/home-focus.png` });
await ctx.close();

// Mobile menu dialog
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference', hasTouch: true, isMobile: true });
const mp = await m.newPage();
mp.on('pageerror', (e) => errors.push('mobile: ' + String(e)));
await mp.goto(base + '/', { waitUntil: 'networkidle' });
await mp.waitForTimeout(2500);
await mp.screenshot({ path: `${out}/mobile-hero.png` });
await mp.click('[data-menu-open]');
await mp.waitForTimeout(600);
console.log('menu open:', await mp.evaluate(() => document.querySelector('[data-menu]').open), 'expanded:', await mp.getAttribute('[data-menu-open]', 'aria-expanded'), 'focus:', await mp.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 20)));
await mp.screenshot({ path: `${out}/mobile-menu.png` });
await mp.keyboard.press('Escape');
await mp.waitForTimeout(500);
console.log('menu after Esc:', await mp.evaluate(() => document.querySelector('[data-menu]').open), 'focus back on:', await mp.evaluate(() => document.activeElement?.textContent?.trim()));
await m.close();

await browser.close();
console.log('errors:', errors.length ? errors : 'none');
