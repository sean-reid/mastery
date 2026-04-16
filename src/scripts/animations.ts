import { gsap, ScrollTrigger } from './smooth-scroll';

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

function initAnimations() {
  if (prefersReducedMotion) {
    // Set everything to final state immediately
    gsap.set('.hero-label, .hero-title, .hero-body p, .hero-scroll-cue', {
      opacity: 1,
      y: 0,
    });
    gsap.set('.skill-card', { opacity: 1, y: 0 });
    gsap.set('.radar-polygon', { scale: 1 });
    gsap.set('.score-ring-progress', { opacity: 1 });
    return;
  }

  // ---- Hero Animations ----
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('.hero-label', {
      opacity: 0,
      y: 20,
      duration: 0.6,
    })
    .from(
      '.hero-title',
      {
        opacity: 0,
        y: 40,
        duration: 0.8,
      },
      '-=0.3'
    )
    .from(
      '.hero-body p',
      {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
      },
      '-=0.4'
    )
    .from(
      '.hero-scroll-cue',
      {
        opacity: 0,
        duration: 0.5,
      },
      '-=0.2'
    );

  // ---- Ranking Header ----
  gsap.from('.ranking-header', {
    scrollTrigger: {
      trigger: '.ranking-header',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 40,
    duration: 0.7,
    ease: 'power3.out',
  });

  // ---- Skill Card Entrance ----
  const cards = document.querySelectorAll('.skill-card');

  cards.forEach((card) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(card, {
      opacity: 0,
      y: 50,
      duration: 0.6,
      ease: 'power3.out',
    });

    // Rank number fade in (no counter - avoids #0 flash)
    const rankEl = card.querySelector('.card-rank');
    if (rankEl) {
      tl.from(
        rankEl,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
          ease: 'back.out(1.5)',
        },
        '<'
      );
    }

    // Radar polygon scale-in
    const polygon = card.querySelector('.radar-polygon');
    if (polygon) {
      tl.from(
        polygon,
        {
          scale: 0,
          transformOrigin: 'center center',
          duration: 0.5,
          ease: 'back.out(1.4)',
        },
        '-=0.3'
      );
    }

    // Score ring draw
    const ringProgress = card.querySelector('.score-ring-progress');
    if (ringProgress) {
      const dashArray = ringProgress.getAttribute('stroke-dasharray');
      if (dashArray) {
        const circumference = parseFloat(dashArray);
        tl.from(
          ringProgress,
          {
            strokeDashoffset: circumference,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4'
        );
      }
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

// Recalculate ScrollTrigger positions after filtering changes page layout
window.addEventListener('mastery:filter', () => {
  ScrollTrigger.refresh();
});
