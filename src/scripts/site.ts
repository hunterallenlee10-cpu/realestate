import { initHeader } from './header';
import { initHero } from './hero';
import { initMotion } from './motion';

/** Horizontal galleries are keyboard-scrollable only when they overflow (mobile). */
function initScrollRegions() {
  const regions = document.querySelectorAll<HTMLElement>('[data-scroll-region]');
  const update = () =>
    regions.forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 1) el.tabIndex = 0;
      else el.removeAttribute('tabindex');
    });
  update();
  window.addEventListener('resize', update, { passive: true });
}

initMotion();
initScrollRegions();
initHeader();
initHero();
