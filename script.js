/* ═══════════════════════════════════════════════════
   MONIKA KUMARI — PORTFOLIO SCRIPT
   Features:
   - SPA-style page navigation
   - Scroll progress bar
   - Custom amber cursor dot
   - Skill cloud hover stagger
   - Contact form with validation
   - Mobile menu drawer
   - Scroll-aware navbar
   - Page entry animation (single, clean)
   - Reduced-motion respect
═══════════════════════════════════════════════════ */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────
   BOOT
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initScrollProgress();
  initCursor();
  initSkillCloud();
  initContactForm();
  initScrollNav();
  staggerBeliefs();
});

/* ─────────────────────────────────────────────
   1. PAGE NAVIGATION
───────────────────────────────────────────── */
function initNav() {
  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-page');
      goTo(target);
    });
  });
}

function goTo(pageId) {
  // Swap active page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (!target) return;
  target.classList.add('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update nav button states (all nav-btn elements)
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-page') === pageId);
  });

  // Close mobile drawer if open
  closeMobileMenu();
}

/* ─────────────────────────────────────────────
   2. MOBILE MENU
───────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('mobOverlay');
  const closeBtn  = document.getElementById('mobClose');

  hamburger?.addEventListener('click', openMobileMenu);
  overlay?.addEventListener('click', closeMobileMenu);
  closeBtn?.addEventListener('click', closeMobileMenu);

  // Keyboard: Escape closes menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

function openMobileMenu() {
  document.getElementById('mobMenu')?.classList.add('open');
  document.getElementById('mobOverlay')?.classList.add('show');
  document.getElementById('hamburger')?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  document.getElementById('mobMenu')?.classList.remove('open');
  document.getElementById('mobOverlay')?.classList.remove('show');
  document.getElementById('hamburger')?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────────
   3. SCROLL PROGRESS BAR
───────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─────────────────────────────────────────────
   4. CUSTOM AMBER CURSOR
───────────────────────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  if (!dot || REDUCED_MOTION) return;

  // Only on non-touch devices
  if (window.matchMedia('(hover: hover)').matches) {
    dot.style.opacity = '1';

    let mouseX = -100, mouseY = -100;
    let curX = -100, curY = -100;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth follow with lerp
    function lerp(a, b, t) { return a + (b - a) * t; }

    function animateCursor() {
      curX = lerp(curX, mouseX, 0.18);
      curY = lerp(curY, mouseY, 0.18);
      dot.style.left = curX + 'px';
      dot.style.top  = curY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale up on interactive elements
    const interactives = 'a, button, input, textarea, .skill, .belief, .proj-item';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(interactives)) {
        dot.style.transform = 'translate(-50%,-50%) scale(2.5)';
        dot.style.opacity = '0.6';
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(interactives)) {
        dot.style.transform = 'translate(-50%,-50%) scale(1)';
        dot.style.opacity = '1';
      }
    });

    // Hide dot when leaving window
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
  }
}

/* ─────────────────────────────────────────────
   5. SKILL CLOUD — random gentle float
───────────────────────────────────────────── */
function initSkillCloud() {
  if (REDUCED_MOTION) return;

  const skills = document.querySelectorAll('.sk');
  skills.forEach((sk, i) => {
    // Stagger a subtle floating animation per pill
    const delay    = (i * 0.18).toFixed(2);
    const duration = (3.5 + Math.random() * 2).toFixed(2);
    const dy       = (4 + Math.random() * 4).toFixed(1);

    sk.style.animation =
      `sk-float ${duration}s ease-in-out ${delay}s infinite alternate`;
    sk.style.setProperty('--dy', `-${dy}px`);
  });

  // Inject keyframe into page if not already there
  if (!document.getElementById('sk-float-kf')) {
    const style = document.createElement('style');
    style.id = 'sk-float-kf';
    style.textContent = `
      @keyframes sk-float {
        from { transform: translateY(0); }
        to   { transform: translateY(var(--dy, -4px)); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ─────────────────────────────────────────────
   6. BELIEFS — staggered reveal on first paint
───────────────────────────────────────────── */
function staggerBeliefs() {
  if (REDUCED_MOTION) return;

  const beliefs = document.querySelectorAll('.belief');
  beliefs.forEach((b, i) => {
    b.style.opacity = '0';
    b.style.transform = 'translateY(10px)';
    b.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
  });

  // Observe
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.belief').forEach(b => {
          b.style.opacity = '1';
          b.style.transform = 'translateY(0)';
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const section = document.querySelector('.beliefs-section');
  if (section) observer.observe(section);
}

/* ─────────────────────────────────────────────
   7. CONTACT FORM
───────────────────────────────────────────── */
function initContactForm() {
  const sendBtn  = document.getElementById('sendBtn');
  const formOk   = document.getElementById('formOk');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', handleFormSend);
}

function handleFormSend() {
  const name    = val('fname');
  const email   = val('femail');
  const subject = val('fsubject');
  const msg     = val('fmsg');
  const sendBtn = document.getElementById('sendBtn');
  const formOk  = document.getElementById('formOk');

  // Clear previous errors
  clearErrors();

  let valid = true;

  if (!name) {
    markError('fname', 'What should I call you?');
    valid = false;
  }
  if (!email || !isEmail(email)) {
    markError('femail', 'Need a valid email to write back.');
    valid = false;
  }
  if (!msg) {
    markError('fmsg', "Can't send an empty message!");
    valid = false;
  }

  if (!valid) return;

  // Simulate send
  sendBtn.textContent = 'Sending…';
  sendBtn.disabled    = true;
  sendBtn.style.opacity = '0.7';

  setTimeout(() => {
    sendBtn.textContent = 'Send it';
    sendBtn.disabled    = false;
    sendBtn.style.opacity = '';

    // Clear fields
    ['fname','femail','fsubject','fmsg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    // Show success
    if (formOk) {
      formOk.style.display = 'block';
      setTimeout(() => { formOk.style.display = 'none'; }, 5000);
    }
  }, 1300);
}

function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function markError(id, hint) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#F87171';
  el.setAttribute('aria-invalid', 'true');
  el.placeholder = hint;
  el.addEventListener('input', () => {
    el.style.borderColor = '';
    el.removeAttribute('aria-invalid');
  }, { once: true });

  // Shake
  shake(el);
}

function clearErrors() {
  ['fname','femail','fmsg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.borderColor = ''; el.removeAttribute('aria-invalid'); }
  });
}

function shake(el) {
  if (REDUCED_MOTION) return;
  const kf = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(0)' },
  ];
  el.animate(kf, { duration: 320, easing: 'ease-out' });
}

/* ─────────────────────────────────────────────
   8. SCROLL-AWARE NAVBAR
───────────────────────────────────────────── */
function initScrollNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.borderBottomColor = 'rgba(46,32,24,0.9)';
    } else {
      nav.style.borderBottomColor = '';
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   9. PROJECT ITEM — subtle left-slide on view
───────────────────────────────────────────── */
(function initProjReveal() {
  if (REDUCED_MOTION) return;

  const items = document.querySelectorAll('.proj-item');
  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-12px)';
    item.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateX(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
})();
