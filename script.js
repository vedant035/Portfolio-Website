/* =========================================================
   Vedant Nayyar — Portfolio  |  script.js
   ========================================================= */

'use strict';

/* ── Helpers ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ════════════════════════════════════════════
   1. PARTICLE CANVAS BACKGROUND
   ════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = $('#bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, raf;
  const COUNT  = 90;
  const SPEED  = 0.35;
  const CONN   = 130; // connection distance
  const ACCENT = '0,200,255';
  const ACCENT2= '123,47,255';

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -6;
      this.vx = (Math.random() - 0.5) * SPEED;
      this.vy = (Math.random() - 0.5) * SPEED;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.6 + 0.2;
      this.col= Math.random() > 0.5 ? ACCENT : ACCENT2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.col},${this.a})`;
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONN) {
          const alpha = (1 - dist / CONN) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${particles[i].col},${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    raf = requestAnimationFrame(loop);
  }

  init();
  loop();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); }, 200);
  });
})();


/* ════════════════════════════════════════════
   2. CUSTOM CURSOR
   ════════════════════════════════════════════ */
(function initCursor() {
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /* grow on interactive elements */
  const targets = 'a,button,input,textarea,.skill-card,.project-card,.planet';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(targets)) {
      dot.style.transform  = 'translate(-50%,-50%) scale(2.5)';
      dot.style.background = 'var(--accent-3)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(targets)) {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      dot.style.background = 'var(--accent)';
    }
  });

  /* Hide when leaving window */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '0.5';
  });
})();


/* ════════════════════════════════════════════
   3. NAVBAR — scroll & mobile
   ════════════════════════════════════════════ */
(function initNav() {
  const nav  = $('#navbar');
  const ham  = $('#hamburger');
  const links = $$('.nav-links')[0];

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    links.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
  });

  /* close on link click */
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      links.classList.remove('open');
      document.body.classList.remove('nav-open');
    });
  });
})();


/* ════════════════════════════════════════════
   4. TYPEWRITER EFFECT
   ════════════════════════════════════════════ */
(function initTypewriter() {
  const el = $('#typewriter');
  if (!el) return;

  const phrases = [
    'printf("Hello, World!");',
    'df.describe()',
    'const focus = "fintech";',
    'matlab -batch "dcf_model"',
    'python analyze.py',
    'git commit -m "✨"',
  ];

  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 50 : 90);
  }
  tick();
})();


/* ════════════════════════════════════════════
   5. SCROLL REVEAL (IntersectionObserver)
   ════════════════════════════════════════════ */
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal').forEach(el => io.observe(el));
})();


/* ════════════════════════════════════════════
   6. SKILL BAR ANIMATION
   ════════════════════════════════════════════ */
(function initSkillBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill  = entry.target;
      const width = fill.dataset.width;
      setTimeout(() => { fill.style.width = width + '%'; }, 200);
      io.unobserve(fill);
    });
  }, { threshold: 0.4 });

  $$('.skill-fill').forEach(el => io.observe(el));
})();


/* ════════════════════════════════════════════
   7. ACTIVE NAV LINK on scroll
   ════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
})();


/* ════════════════════════════════════════════
   8. CONTACT FORM
   ════════════════════════════════════════════ */
(function initForm() {
  const form    = $('#contact-form');
  const success = $('#form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn  = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');

    /* simulate send */
    btn.disabled = true;
    span.textContent = 'Sending…';
    btn.style.opacity = '0.7';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      span.textContent = 'Send Message';
      btn.style.opacity = '1';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 4000);
    }, 1400);
  });
})();


/* ════════════════════════════════════════════
   9. PLANET TOOLTIP (data-tooltip)
   ════════════════════════════════════════════ */
(function initTooltips() {
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position:fixed; z-index:9998; pointer-events:none;
    background:rgba(5,8,16,0.95); border:1px solid rgba(0,200,255,0.25);
    color:#e2eaf5; font-family:'Space Mono',monospace;
    font-size:.7rem; padding:.35rem .7rem; border-radius:6px;
    opacity:0; transition:opacity 0.2s;
    white-space:nowrap; transform:translate(-50%,-140%);
  `;
  document.body.appendChild(tooltip);

  $$('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', e => {
      tooltip.textContent = el.dataset.tooltip;
      tooltip.style.opacity = '1';
    });
    el.addEventListener('mousemove', e => {
      tooltip.style.left = e.clientX + 'px';
      tooltip.style.top  = e.clientY + 'px';
    });
    el.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });
})();


/* ════════════════════════════════════════════
   10. TILT EFFECT on cards
   ════════════════════════════════════════════ */
(function initTilt() {
  $$('.project-card, .skill-card, .cert-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ════════════════════════════════════════════
   11. GLITCH EFFECT on hero name (subtle)
   ════════════════════════════════════════════ */
(function initGlitch() {
  const name = $('.hero-name');
  if (!name) return;

  setInterval(() => {
    name.style.textShadow = `
      ${(Math.random()-0.5)*4}px 0 rgba(0,200,255,0.6),
      ${(Math.random()-0.5)*4}px 0 rgba(123,47,255,0.6)
    `;
    setTimeout(() => { name.style.textShadow = ''; }, 80);
  }, 3500);
})();
