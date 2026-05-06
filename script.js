/* ─── CURSOR ──────────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

if (cursor && trail && isFinePointer && !prefersReducedMotion) {
  document.addEventListener('mousemove', event => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;

    window.setTimeout(() => {
      trail.style.left = `${event.clientX}px`;
      trail.style.top = `${event.clientY}px`;
    }, 80);
  });
} else {
  document.body.classList.add('no-custom-cursor');
}

/* ─── NAV SCROLL ──────────────────────────────────────────────── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─── REVEAL ON SCROLL ────────────────────────────────────────── */
const reveals = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const parentGrid = entry.target.closest('.projects-grid, .skills-grid');
      const delay = parentGrid
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
        : 0;

      window.setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  reveals.forEach(element => observer.observe(element));
} else {
  reveals.forEach(element => element.classList.add('visible'));
}

/* ─── TERMINAL TYPEWRITER ─────────────────────────────────────── */
function typeText(element, text, speed, callback) {
  if (!element) return;

  let i = 0;
  const interval = window.setInterval(() => {
    element.textContent += text.charAt(i);
    i += 1;

    if (i >= text.length) {
      window.clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

function show(element) {
  if (element) element.style.display = 'block';
}

function showFlex(element) {
  if (element) element.style.display = 'flex';
}

function runTerminal() {
  const cmd1 = document.getElementById('t-cmd1');
  const out1 = document.getElementById('t-out1');
  const line2 = document.getElementById('t-line2');
  const cmd2 = document.getElementById('t-cmd2');
  const out2 = document.getElementById('t-out2');
  const line3 = document.getElementById('t-line3');

  if (!cmd1 || !out1 || !line2 || !cmd2 || !out2 || !line3) return;

  if (prefersReducedMotion) {
    cmd1.textContent = 'whoami --verbose';
    cmd2.textContent = 'cat skills.txt';
    show(out1);
    showFlex(line2);
    show(out2);
    showFlex(line3);
    return;
  }

  window.setTimeout(() => {
    typeText(cmd1, 'whoami --verbose', 55, () => {
      window.setTimeout(() => {
        show(out1);
        window.setTimeout(() => {
          showFlex(line2);
          typeText(cmd2, 'cat skills.txt', 55, () => {
            window.setTimeout(() => {
              show(out2);
              window.setTimeout(() => showFlex(line3), 400);
            }, 300);
          });
        }, 800);
      }, 300);
    });
  }, 800);
}

window.addEventListener('load', () => {
  window.setTimeout(runTerminal, 600);
});

/* ─── SMOOTH ANCHOR SCROLL ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});
