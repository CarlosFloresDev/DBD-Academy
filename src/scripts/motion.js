import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let lenis;

function revealAll() {
  if (reducedMotion.matches) {
    gsap.set('[data-reveal]', { clearProps: 'all', opacity: 1, y: 0 });
    return;
  }

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: Number(el.dataset.revealDelay || 0) / 1000,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });
}

if (!reducedMotion.matches) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  revealAll();

  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const obj = { value: 0 };
    gsap.to(obj, {
      value: target,
      duration: 1.25,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => {
        el.textContent = obj.value.toLocaleString('es-ES', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      },
    });
  });

  document.querySelectorAll('.draw').forEach((el) => {
    const length = el.getTotalLength ? el.getTotalLength() : 300;
    gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(el, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });

  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const strength = Number(el.dataset.parallax || 0);
    gsap.to(el, {
      yPercent: strength * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  document.querySelectorAll('.stat-bar-fill').forEach((el) => {
    gsap.fromTo(el, { width: '0%' }, {
      width: el.dataset.width || '0%',
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });

  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
});

gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
  if (lenis) lenis.destroy();
  gsap.set('[data-reveal]', { opacity: 1, y: 0 });
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    el.textContent = target.toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  });
});

reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    if (lenis) lenis.destroy();
  }
});

window.DBD = {
  revealAll,
  refresh() {
    ScrollTrigger.refresh();
  },
};
