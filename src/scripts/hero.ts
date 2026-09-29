/**
 * Hero pause/play (WCAG 2.2.2): stops the background video — or the slow
 * Ken Burns on the poster when no video is set — and pauses the video
 * whenever the hero is off-screen to save battery.
 */
export function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const button = hero?.querySelector<HTMLButtonElement>('[data-hero-toggle]');
  if (!hero || !button) return;

  const video = hero.querySelector<HTMLVideoElement>('[data-hero-video]');
  const text = button.querySelector('[data-hero-toggle-text]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

  // Attach the film's sources only once the page has loaded, then start it.
  if (video && !reduce && !saveData) {
    const start = () => {
      video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
        source.src = source.dataset.src!;
        source.removeAttribute('data-src');
      });
      video.load();
      if (hero.dataset.paused !== 'true') video.play().catch(() => undefined);
    };
    if (document.readyState === 'complete') window.setTimeout(start, 150);
    else window.addEventListener('load', () => window.setTimeout(start, 150), { once: true });
  }

  const play = () => video?.play().catch(() => undefined);

  const setPaused = (paused: boolean) => {
    hero.dataset.paused = String(paused);
    button.setAttribute('aria-label', paused ? 'Play background motion' : 'Pause background motion');
    if (text) text.textContent = paused ? 'Play' : 'Pause';
    if (video) {
      if (paused) video.pause();
      else play();
    }
  };

  if (reduce) {
    setPaused(true);
  }

  button.addEventListener('click', () => setPaused(hero.dataset.paused !== 'true'));

  // "Now showing" follows the film from place to place.
  const place = hero.querySelector<HTMLElement>('[data-hero-place]');
  const captions: { from: number; text: string }[] = place?.dataset.captions ? JSON.parse(place.dataset.captions) : [];
  if (video && place && captions.length) {
    let current = place.textContent?.trim() ?? '';
    video.addEventListener('timeupdate', () => {
      const t = video.currentTime;
      const next = [...captions].reverse().find((c) => t >= c.from)?.text ?? captions[0].text;
      if (next === current) return;
      current = next;
      place.dataset.swapping = '';
      window.setTimeout(() => {
        place.textContent = next;
        delete place.dataset.swapping;
      }, 450);
    });
  }

  if (video) {
    new IntersectionObserver(([entry]) => {
      if (hero.dataset.paused === 'true') return;
      if (entry.isIntersecting) play();
      else video.pause();
    }).observe(hero);
  }
}
