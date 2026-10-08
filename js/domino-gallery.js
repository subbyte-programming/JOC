(() => {
  const gallery = document.querySelector("[data-domino-gallery]");
  if (!gallery) return;

  const cards = Array.from(gallery.querySelectorAll(".domino-card"));
  if (!cards.length) return;

  const wrappers = Array.from(gallery.querySelectorAll(".domino-card-wrap"));
  const currentCount = gallery.querySelector(".domino-current");
  const viewport = gallery.querySelector(".domino-viewport");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileLayout = window.matchMedia("(max-width: 640px)");
  const overlap = 0.45;
  let frameId = 0;
  let lastFrame = 0;
  let lastInteraction = -Infinity;
  let shownProgress = -1;
  let progress = 0;
  let autoProgress = 0;
  let autoDirection = 1;
  let autoHold = 0;

  const clamp = (value) => Math.min(1, Math.max(0, value));

  const fitCards = () => {
    const gap = parseFloat(getComputedStyle(gallery.querySelector(".domino-track")).gap) || 12;
    if (mobileLayout.matches) {
      const width = Math.min(Math.round(gallery.clientWidth * 0.76), 300);
      const height = Math.min(Math.max(245, Math.round(width * 0.86)), 300);
      wrappers.forEach((card) => {
        card.style.setProperty("--domino-width", `${width}px`);
        card.style.setProperty("--domino-height", `${height}px`);
      });
      return;
    }

    const available = Math.max(280, Math.min(gallery.clientWidth - 48, 1330));
    const width = Math.max(80, Math.min(184, Math.floor((available - gap * (cards.length - 1)) / cards.length)));
    const height = Math.max(210, Math.min(Math.round(width * 2.35), Math.round(window.innerHeight * 0.48)));

    wrappers.forEach((card) => {
      card.style.setProperty("--domino-width", `${width}px`);
      card.style.setProperty("--domino-height", `${height}px`);
    });
  };

  const scrollProgress = () => {
    if (mobileLayout.matches && viewport) {
      const travel = viewport.scrollWidth - viewport.clientWidth;
      return travel <= 0 ? 0 : clamp(viewport.scrollLeft / travel);
    }

    const travel = gallery.offsetHeight - window.innerHeight;
    return travel <= 0 ? 0 : clamp(-gallery.getBoundingClientRect().top / travel);
  };

  const topple = (value) => {
    if (value < 0.72) {
      const phase = value / 0.72;
      return phase * phase;
    }
    const phase = (value - 0.72) / 0.28;
    return 1 + 0.06 * Math.sin(phase * Math.PI) * (1 - phase);
  };

  const paint = (value) => {
    const rounded = Math.round(value * 1000) / 1000;
    if (rounded === shownProgress) return;
    shownProgress = rounded;
    gallery.style.setProperty("--progress", String(rounded));
    gallery.dataset.progress = rounded.toFixed(3);
    if (currentCount) {
      const currentIndex = mobileLayout.matches && viewport
        ? Math.round(viewport.scrollLeft / (wrappers[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(gallery.querySelector(".domino-track")).gap) || 12)))
        : Math.floor(rounded * cards.length);
      currentCount.textContent = String(Math.min(cards.length, currentIndex + 1)).padStart(2, "0");
    }

    cards.forEach((card, index) => {
      const windowSize = cards.length <= 1 ? 1 : 1 / (1 + overlap * (cards.length - 1));
      const start = index * windowSize * overlap;
      const localProgress = cards.length <= 1 ? rounded : clamp((rounded - start) / windowSize);
      const fall = reduceMotion.matches || mobileLayout.matches ? 0 : topple(localProgress);
      const angle = reduceMotion.matches ? 0 : 94 * fall;
      card.style.setProperty("--fall", String(Math.round(fall * 1000) / 1000));
      card.style.transform = `rotateX(${angle}deg)`;
    });
  };

  const step = (now) => {
    frameId = 0;
    const delta = lastFrame ? Math.min(now - lastFrame, 80) : 16;
    lastFrame = now;
    const bounds = gallery.getBoundingClientRect();
    const inView = bounds.bottom > 0 && bounds.top < window.innerHeight;
    const canAutoplay = !mobileLayout.matches && inView && bounds.top <= 0 && bounds.bottom >= window.innerHeight &&
      now - lastInteraction > 3500 && !reduceMotion.matches;

    if (canAutoplay) {
      if (autoHold > 0) {
        autoHold -= delta;
      } else {
        autoProgress = clamp(autoProgress + (delta / 2600) * autoDirection);
        if (autoProgress === 1 || autoProgress === 0) {
          autoDirection *= -1;
          autoHold = 1400;
        }
      }
      progress = autoProgress;
      requestFrame();
    } else {
      progress = scrollProgress();
      autoProgress = progress;
      autoDirection = progress >= 0.999 ? -1 : 1;
      lastFrame = 0;
    }

    paint(progress);
  };

  const requestFrame = () => {
    if (!frameId) frameId = window.requestAnimationFrame(step);
  };

  const onScroll = () => {
    lastInteraction = performance.now();
    requestFrame();
  };

  fitCards();
  gallery.classList.add("is-enhanced");
  paint(0);
  viewport?.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  const onResize = () => {
    fitCards();
    requestFrame();
  };
  window.addEventListener("resize", onResize);
  mobileLayout.addEventListener("change", onResize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrame = 0;
    } else {
      requestFrame();
    }
  });
  reduceMotion.addEventListener("change", () => {
    shownProgress = -1;
    paint(progress);
  });
})();
