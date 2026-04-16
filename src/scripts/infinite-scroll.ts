/**
 * Progressive card reveal with infinite scroll.
 *
 * All 100 cards are in the DOM (SEO, no-JS fallback). On load, cards beyond
 * the initial batch are hidden. As the user scrolls near the bottom, the next
 * batch is revealed. Scroll velocity is tracked so fast scrollers get cards
 * preloaded ahead of time.
 */

const INITIAL_BATCH = 15;
const LOAD_MORE = 15;
const LOOKAHEAD_MS = 800; // preload if user will reach sentinel within this time

let revealedCount = 0;
let isFiltered = false;

const cards = Array.from(document.querySelectorAll<HTMLElement>('.skill-card'));
const skillList = document.querySelector('.skill-list');

if (cards.length > INITIAL_BATCH && skillList) {
  // ---- Sentinel element ----
  const sentinel = document.createElement('div');
  sentinel.className = 'scroll-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  skillList.appendChild(sentinel);

  // ---- Initial hide ----
  function hideUnrevealed() {
    cards.forEach((card, i) => {
      if (i >= revealedCount) {
        card.style.display = 'none';
        card.dataset.deferred = '1';
      }
    });
  }

  function revealBatch() {
    if (isFiltered || revealedCount >= cards.length) return;
    const end = Math.min(revealedCount + LOAD_MORE, cards.length);
    const toReveal = cards.slice(revealedCount, end);
    revealedCount = end;

    // Stagger reveals: 3 cards per frame to spread layout cost
    let idx = 0;
    function revealNext() {
      const chunk = Math.min(3, toReveal.length - idx);
      for (let j = 0; j < chunk; j++, idx++) {
        const card = toReveal[idx];
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        delete card.dataset.deferred;
      }
      // Trigger reflow then animate in
      requestAnimationFrame(() => {
        for (let j = idx - chunk; j < idx; j++) {
          toReveal[j].style.opacity = '1';
          toReveal[j].style.transform = 'none';
        }
        if (idx < toReveal.length) {
          requestAnimationFrame(revealNext);
        } else {
          // Clean up transition property after animation completes
          setTimeout(() => {
            toReveal.forEach(c => c.style.transition = '');
          }, 350);
          window.dispatchEvent(new CustomEvent('mastery:filter'));
        }
      });
    }

    requestAnimationFrame(revealNext);

    if (revealedCount >= cards.length) {
      scrollObserver.unobserve(sentinel);
      cleanup();
    }
  }

  // ---- IntersectionObserver (static threshold fallback) ----
  const scrollObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !isFiltered) {
        revealBatch();
      }
    },
    { rootMargin: '0px 0px 1500px 0px' }
  );

  // ---- Velocity-based predictive loading ----
  let lastScrollY = window.scrollY;
  let lastTime = performance.now();
  let velocity = 0; // px/ms
  let rafId = 0;

  function trackVelocity() {
    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 0) {
      const dy = window.scrollY - lastScrollY;
      // Exponential moving average for smooth velocity
      const instantV = dy / dt;
      velocity = velocity * 0.7 + instantV * 0.3;
      lastScrollY = window.scrollY;
      lastTime = now;
    }

    // Predictive check: if scrolling downward, estimate time to sentinel
    if (velocity > 0.05 && !isFiltered && revealedCount < cards.length) {
      const sentinelTop = sentinel.getBoundingClientRect().top;
      const distToSentinel = sentinelTop - window.innerHeight;

      if (distToSentinel > 0) {
        const timeToReach = distToSentinel / (velocity * 1000); // seconds
        if (timeToReach < LOOKAHEAD_MS / 1000) {
          revealBatch();
        }
      }
    }

    rafId = requestAnimationFrame(trackVelocity);
  }

  rafId = requestAnimationFrame(trackVelocity);

  function cleanup() {
    cancelAnimationFrame(rafId);
  }

  // ---- Initialize ----
  revealedCount = INITIAL_BATCH;
  hideUnrevealed();
  scrollObserver.observe(sentinel);

  // ---- Integration with category filtering ----
  window.addEventListener('mastery:filter', () => {
    const activePill = document.querySelector('.nav-pill.active') as HTMLElement | null;
    const cat = activePill?.dataset.category || 'all';
    const wasFiltered = isFiltered;
    isFiltered = cat !== 'all';

    if (isFiltered) {
      cards.forEach(card => delete card.dataset.deferred);
    } else if (wasFiltered) {
      cards.forEach((card, i) => {
        if (i >= revealedCount) {
          card.style.display = 'none';
          card.dataset.deferred = '1';
        }
      });
      if (revealedCount < cards.length) {
        scrollObserver.observe(sentinel);
        // Restart velocity tracking if it was cleaned up
        if (!rafId) rafId = requestAnimationFrame(trackVelocity);
      }
    }
  });
}
