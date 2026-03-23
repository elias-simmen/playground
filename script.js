// 1. LOADER
(function runLoader() {
  const loader = document.getElementById('loader');
  const barFill = document.getElementById('loaderBarFill');
  if (!loader || !barFill) return;
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    barFill.style.width = progress + '%';
  }, 100);
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero animations
    document.getElementById('heroLine1')?.classList.add('visible');
    setTimeout(() => document.getElementById('heroLine2')?.classList.add('visible'), 120);
    setTimeout(() => document.getElementById('heroRole')?.classList.add('visible'), 240);
    setTimeout(() => {
      document.getElementById('heroBottom')?.classList.add('visible');
      startTypewriter();
    }, 360);
  }, 2200);
})();

// 2. SCROLL PROGRESS
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (progressBar) progressBar.style.width = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100) + '%';
});

// 3. CURSOR
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0, lastTrail = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
  const now = Date.now();
  if (now - lastTrail > 40) {
    lastTrail = now;
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    t.style.left = mx + 'px'; t.style.top = my + 'px';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 500);
  }
});

(function animateFollower() {
  if (follower) {
    fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
  }
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => follower?.classList.add('hover'));
  el.addEventListener('mouseleave', () => follower?.classList.remove('hover'));
});
document.addEventListener('mousedown', () => follower?.classList.add('click'));
document.addEventListener('mouseup',   () => follower?.classList.remove('click'));

// 4. NAVBAR
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
});

// 5. HAMBURGER / MOBILE MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
  document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// 6. THEME TOGGLE
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

// 7. TYPEWRITER
const phrases = ['Full-Stack Developer', 'UI / UX Enthusiast', 'Open Source Contributor', 'Problem Solver', 'Creative Thinker'];
let pIdx = 0, cIdx = 0, deleting = false;
function startTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  function tick() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 45 : 80);
  }
  tick();
}

// 8. SCROLL REVEAL (IntersectionObserver)
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-up, .reveal-clip').forEach(el => revealObs.observe(el));

// 9. SKILL BARS
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const item = e.target;
    const level = +item.dataset.level;
    const fill = item.querySelector('.skill-fill');
    const pct = item.querySelector('.skill-percent');
    if (!fill || !pct) return;
    let cur = 0;
    const iv = setInterval(() => {
      cur++; pct.textContent = cur + '%';
      if (cur >= level) { pct.textContent = level + '%'; clearInterval(iv); }
    }, 12);
    fill.style.width = level + '%';
    skillObs.unobserve(item);
  });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-item').forEach(el => skillObs.observe(el));

// 10. COUNTER ANIMATION
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const numEl = el.querySelector('.stat-number');
    if (!numEl) return;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const iv = setInterval(() => {
      cur = Math.min(cur + step, target);
      numEl.textContent = cur + suffix;
      if (cur >= target) clearInterval(iv);
    }, 25);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-item').forEach(el => counterObs.observe(el));

// 11. PROJECT FILTER
const filterBtns = document.querySelectorAll('.filter-btn');
const projRows = document.querySelectorAll('.proj-row');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projRows.forEach(row => {
      const match = f === 'all' || row.dataset.category === f;
      row.classList.toggle('hidden', !match);
    });
  });
});

// 12. PROJECT HOVER PREVIEW
const preview = document.getElementById('projPreview');
const previewImg = document.getElementById('projPreviewImg');
let previewVisible = false;

document.querySelectorAll('.proj-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    if (!preview || !previewImg) return;
    const c1 = row.dataset.c1 || '#6366f1';
    const c2 = row.dataset.c2 || '#8b5cf6';
    previewImg.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
    preview.classList.add('visible');
    previewVisible = true;
  });
  row.addEventListener('mouseleave', () => {
    preview?.classList.remove('visible');
    previewVisible = false;
  });
});

document.addEventListener('mousemove', e => {
  if (!preview || !previewVisible) return;
  preview.style.left = e.clientX + 'px';
  preview.style.top  = e.clientY + 'px';
});

// 13. CONTACT FORM
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  const success = document.getElementById('formSuccess');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Sending...';
  setTimeout(() => {
    btn.style.display = 'none';
    success?.classList.add('show');
    e.target.reset();
  }, 1200);
});

// 14. SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
