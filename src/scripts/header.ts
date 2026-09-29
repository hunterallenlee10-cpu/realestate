/**
 * Header: transparent over the hero, solid ivory once past it, tucked away
 * while scrolling down and back on scroll-up. Menu is a native <dialog>
 * (focus trap + Escape for free).
 */
export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const overHero = header.dataset.mode === 'over' && hero;

  if (overHero) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        header.dataset.state = entry.isIntersecting ? 'over' : 'solid';
      },
      { rootMargin: `-${header.offsetHeight}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(hero);
  } else {
    header.dataset.state = 'solid';
  }

  // Hide on scroll down, reveal on scroll up (never while it holds focus).
  let lastY = window.scrollY;
  let queued = false;
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        const holdsFocus = header.contains(document.activeElement);
        if (y < window.innerHeight * 0.5 || delta < -6 || holdsFocus) {
          header.dataset.hidden = 'false';
        } else if (delta > 8) {
          header.dataset.hidden = 'true';
        }
        lastY = y;
        queued = false;
      });
    },
    { passive: true },
  );
  header.addEventListener('focusin', () => {
    header.dataset.hidden = 'false';
  });

  // Menu
  const dialog = document.querySelector<HTMLDialogElement>('[data-menu]');
  const openButton = header.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!dialog || !openButton) return;

  openButton.setAttribute('aria-expanded', 'false');
  openButton.addEventListener('click', () => {
    dialog.showModal();
    openButton.setAttribute('aria-expanded', 'true');
    window.__lenis?.stop();
  });
  dialog.addEventListener('close', () => {
    openButton.setAttribute('aria-expanded', 'false');
    window.__lenis?.start();
  });
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => dialog.close());
  });
}
