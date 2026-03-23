/* ===== LOADER ===== */
(function runLoader() {
  const loader  = document.getElementById('loader');
  const barFill = document.getElementById('loaderBarFill');
  if (!loader || !barFill) return;

  let progress = 0;

  // Smoothly animate the bar to 100% over ~1.8s
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
    }
    barFill.style.width = progress + '%';
  }, 100);

  // Hide loader after bar completes + short pause
  setTimeout(() => {
    loader.classList.add('hidden');
    document.querySelectorAll('#hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
    startTypewriter();
  }, 2200);
})();

/* ===== SCROLL PROGRESS ===== */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  if (progressBar) progressBar.style.width = (pct * 100) + '%';
});

/* ===== CUSTOM CURSOR + TRAIL ===== */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let lastTrailTime = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';

  // Cursor trail
  const now = Date.now();
  if (now - lastTrailTime > 40) {
    lastTrailTime = now;
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = mouseX + 'px';
    trail.style.top  = mouseY + 'px';
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 600);
  }
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});
document.addEventListener('mousedown', () => ring.classList.add('click'));
document.addEventListener('mouseup',   () => ring.classList.remove('click'));

/* ===== MAGNETIC BUTTONS ===== */
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // ScrollSpy
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
});

/* HAMBURGER */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ===== THEME TOGGLE ===== */
document.getElementById('themeToggle').addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

/* ===== TYPEWRITER ===== */
const phrases = [
  'Full-Stack Developer',
  'UI / UX Enthusiast',
  'Open Source Contributor',
  'Problem Solver',
  'Creative Thinker',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function startTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 50 : 80);
  }
  tick();
}

/* ===== HOLOGRAPHIC CARD MOUSE TRACKING ===== */
document.querySelectorAll('.holo-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    card.style.setProperty('--mouse-x', x);
    card.style.setProperty('--mouse-y', y);
    card.style.setProperty('--holo-opacity', '1');
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--holo-opacity', '0');
  });
});

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ===== SKILL BARS ===== */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const item = entry.target;
    const level = item.dataset.level;
    const fill   = item.querySelector('.skill-fill');
    const pct    = item.querySelector('.skill-percent');
    if (!fill || !pct) return;

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      pct.textContent = current + '%';
      if (current >= +level) {
        pct.textContent = level + '%';
        clearInterval(interval);
      }
    }, 12);
    fill.style.width = level + '%';
    skillObserver.unobserve(item);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));

/* ===== COUNTER ANIMATION ===== */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const numEl  = el.querySelector('.stat-number');
    if (!numEl) return;

    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      numEl.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 25);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => counterObserver.observe(el));

/* ===== 3D TILT CARDS ===== */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
    const y = ((e.clientY - rect.top ) / rect.height - 0.5) * 14;
    card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===== PROJECT FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.classList.remove('fade-in');
        void card.offsetWidth; // reflow
        card.classList.add('fade-in');
      }
    });
  });
});

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  const success = document.getElementById('formSuccess');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Sending...';

  setTimeout(() => {
    btn.style.display = 'none';
    success.classList.add('show');
    e.target.reset();
    // Reset labels
    e.target.querySelectorAll('input, textarea').forEach(f => f.blur());
  }, 1200);
});

/* ===== SMOOTH SCROLL for all anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
