/* ══════════════════════════════════════
   NexAir System — script.js (v3 extraordinary)
══════════════════════════════════════ */

/* ── Preloader ── */
window.addEventListener('load', () => {
  const pl = document.getElementById('preloader');
  if (pl) setTimeout(() => pl.classList.add('hidden'), 500);
});

/* ── Dark mode toggle ── */
const html      = document.documentElement;
const toggles   = [document.getElementById('themeToggle'), document.getElementById('themeToggleMobile')];
const themeIcon = document.getElementById('themeIcon');

function applyTheme(dark) {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');

  // animate toggle icons with spin
  document.querySelectorAll('.theme-toggle i').forEach(icon => {
    icon.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1), opacity .25s';
    icon.style.transform  = 'rotate(180deg) scale(0)';
    icon.style.opacity    = '0';
    setTimeout(() => {
      icon.className      = dark ? 'fas fa-sun' : 'fas fa-moon';
      icon.style.transform = 'rotate(0deg) scale(1)';
      icon.style.opacity   = '1';
    }, 220);
  });

  // mobile button text
  const mob = document.getElementById('themeToggleMobile');
  if (mob) {
    const textNode = [...mob.childNodes].find(n => n.nodeType === 3 || (n.tagName && n.tagName !== 'I'));
    if (textNode && textNode.nodeType === 3) textNode.textContent = dark ? ' Mode clair' : ' Mode sombre';
  }

  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// init from storage or system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

toggles.forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') !== 'dark');
  });
});

/* ── Scroll: header, back-to-top & floating CTA ── */
const header   = document.getElementById('header');
const btt      = document.getElementById('btt');
const floatCta = document.getElementById('floatCta');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 50);
  btt.classList.toggle('show', y > 500);
  if (floatCta) floatCta.classList.toggle('show', y > 400);
}, { passive: true });

btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Mobile burger menu ── */
const burger   = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
  const spans = burger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 74;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ── Intersection Observer: reveal on scroll ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      target.classList.add('in');
      revealObserver.unobserve(target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ── Counter animation ── */
function animateCount(el) {
  const target   = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const duration = 1800;
  const fps      = 60;
  const total    = Math.ceil(duration / (1000 / fps));
  let frame      = 0;
  const ease = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
  const timer = setInterval(() => {
    frame++;
    const progress = ease(Math.min(frame / total, 1));
    el.textContent = Math.round(progress * target);
    if (frame >= total) clearInterval(timer);
  }, 1000 / fps);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      animateCount(target);
      counterObs.unobserve(target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.hstat-n[data-target]').forEach(el => counterObs.observe(el));

/* ── Service tabs ── */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.tab;

    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const panel = document.getElementById(targetId);
    if (panel) {
      panel.classList.add('active');
      // Reveal items inside newly shown panel
      panel.querySelectorAll('.svc-list li').forEach((li, i) => {
        li.style.opacity    = '0';
        li.style.transform  = 'translateX(-12px)';
        li.style.transition = `opacity .35s ease ${i * 0.07}s, transform .35s ease ${i * 0.07}s`;
        requestAnimationFrame(() => {
          li.style.opacity   = '1';
          li.style.transform = 'none';
        });
      });
    }
  });
});

/* ── Active nav highlight on scroll ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('#nav a:not(.nav-cta)');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const active = document.querySelector(`#nav a[href="#${target.id}"]`);
      if (active) active.style.color = 'var(--gold-300)';
    }
  });
}, { threshold: 0.4, rootMargin: '-74px 0px 0px 0px' });

sections.forEach(s => sectionObs.observe(s));

/* ── Contact form validation & submit ── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#f-name');
    const email   = form.querySelector('#f-email');
    const message = form.querySelector('#f-msg');
    let   valid   = true;

    [name, email, message].forEach(f => f.classList.remove('err'));

    if (!name.value.trim())                          { name.classList.add('err');    valid = false; }
    if (!email.value.trim() || !email.value.includes('@')) { email.classList.add('err');   valid = false; }
    if (!message.value.trim())                       { message.classList.add('err'); valid = false; }

    if (!valid) {
      const firstErr = form.querySelector('.err');
      if (firstErr) firstErr.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-check"></i> <span>Message envoyé !</span>';
    btn.style.background = '#059669';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML    = originalHTML;
      btn.style.background = '';
      btn.disabled     = false;
      form.reset();
    }, 4000);
  });
}
