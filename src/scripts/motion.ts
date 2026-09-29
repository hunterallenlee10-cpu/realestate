/**
 * Motion — three ideas, used everywhere, nothing else:
 *   1. Text rises into place (headlines line by line out of a mask; blocks fade up)
 *   2. Images are revealed with a slow upward wipe
 *   3. Large images drift in a slow Ken Burns zoom (scroll-linked here; the hero's
 *      is a CSS loop)
 * Lenis supplies the smooth, weighted scroll. None of this runs when the visitor
 * prefers reduced motion: the `.motion` class is never added and content is static.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

export function initMotion() {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  window.__motionReady = true;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // ---- Smooth scroll -------------------------------------------------------
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, autoRaf: false });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // In-page links glide instead of jumping, then hand focus to the target.
  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    const header = document.querySelector<HTMLElement>('[data-site-header]');
    lenis.scrollTo(target, {
      offset: target.id === 'main' ? 0 : -(header?.offsetHeight ?? 0) * 0.5,
      duration: 1.6,
      onComplete: () => {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      },
    });
    history.pushState(null, '', url.hash);
  });

  // Every reveal animation, keyed by its element — so focus can finish it early.
  const reveals = new WeakMap<Element, gsap.core.Animation>();
  const reveal = (el: Element) => ((el as HTMLElement).style.opacity = '1');

  // Keyboard users must never land on something invisible.
  document.addEventListener('focusin', (event) => {
    let el = (event.target as Element | null)?.closest('[data-reveal]');
    while (el) {
      reveals.get(el)?.progress(1);
      reveal(el);
      el = el.parentElement?.closest('[data-reveal]') ?? null;
    }
  });

  // ---- 1a. Blocks fade up --------------------------------------------------
  gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 1.3,
        ease: 'power3.out',
        delay: el.closest('[data-hero]') ? 0.9 : 0,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      },
    );
    reveals.set(el, tween);
  });

  // ---- 2. Image wipes ------------------------------------------------------
  gsap.utils.toArray<HTMLElement>('[data-reveal="wipe"]').forEach((frame) => {
    const img = frame.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 88%', once: true } });
    gsap.set(frame, { opacity: 1, clipPath: 'inset(100% 0% 0% 0%)' });
    reveals.set(frame, tl);
    tl.to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' });
    // Images that also carry a scroll Ken Burns keep that transform to themselves.
    if (img && !img.hasAttribute('data-kenburns')) {
      tl.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 2.2, ease: 'expo.out' }, 0.1);
    }
  });

  // ---- 3. Scroll-linked Ken Burns ------------------------------------------
  gsap.utils.toArray<HTMLElement>('[data-kenburns]').forEach((img) => {
    const frame = img.closest('.frame') ?? img;
    gsap.fromTo(
      img,
      { scale: 1.16 },
      {
        scale: 1.02,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // ---- 1b. Headlines rise line by line (after fonts, so lines break correctly)
  const lineTargets = gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]');
  document.fonts.ready.then(() => {
    lineTargets.forEach((el) => {
      try {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          // Lines only (words stay intact), so the text reads naturally — no ARIA rewriting needed.
          aria: 'none',
          autoSplit: true,
          onSplit(self) {
            reveal(el);
            const inHero = Boolean(el.closest('[data-hero]'));
            const tween = gsap.from(self.lines, {
              yPercent: 108,
              duration: inHero ? 1.7 : 1.4,
              ease: 'expo.out',
              stagger: 0.09,
              delay: inHero ? 0.25 : 0,
              scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 88%', once: true },
            });
            reveals.set(el, tween);
            return tween;
          },
        });
      } catch {
        reveal(el);
      }
    });
    ScrollTrigger.refresh();
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
