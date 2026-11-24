// Page fade-in on load
window.addEventListener('load', () => document.body.classList.add('loaded'));

// Scroll-reveal: auto-tag common elements so they fade/slide in on scroll
const revealSelectors = [
  '.section-head', '.hero .btn-row', '.about-photo',
  '.project-card', '.skill-card', '.certificate-card',
  '.contact-form', '.contact-info'
];
const revealEls = document.querySelectorAll(revealSelectors.join(','));

revealEls.forEach(el => el.classList.add('reveal'));

if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
}

// Stagger groups (grids) fade in together once the group enters view
const groupSelectors = ['.project-grid', '.certificates-grid', '.skills-extra'];
const groupEls = document.querySelectorAll(groupSelectors.join(','));

if (groupEls.length) {
  groupEls.forEach(el => el.classList.add('reveal-group'));

  const groupObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        groupObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  groupEls.forEach(el => groupObserver.observe(el));
}

// Mobile nav toggle
const navToggle = document.querySelector('.navtoggle');
const mainNav = document.querySelector('.mainnav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

// Animate skill bars into view
const bars = document.querySelectorAll('.bar-fill');
if (bars.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

// Certificates: filter by category
const filterBtns = document.querySelectorAll('.filter-btn');
const certCards = document.querySelectorAll('.certificate-card');
const certEmpty = document.querySelector('.certificate-empty');

if (filterBtns.length && certCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visibleCount = 0;

      certCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.hidden = !match;
        if (match) visibleCount++;
      });

      if (certEmpty) certEmpty.hidden = visibleCount !== 0;
    });
  });
}

// Scroll progress bar
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Card tilt: gentle 3D tilt that follows the cursor
if (!prefersReducedMotion) {
  const tiltCards = document.querySelectorAll('.project-card, .skill-card, .certificate-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// Hero role: typewriter effect
const roleEl = document.querySelector('.hero .role');
if (roleEl && !prefersReducedMotion) {
  const fullText = roleEl.textContent;
  roleEl.textContent = '';
  roleEl.classList.add('typing');
  let i = 0;
  const typeNext = () => {
    if (i < fullText.length) {
      roleEl.textContent += fullText.charAt(i);
      i++;
      setTimeout(typeNext, 55);
    } else {
      roleEl.classList.remove('typing');
    }
  };
  window.addEventListener('load', () => setTimeout(typeNext, 1100));
}

// Contact form: prevent real submission (static site demo)
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    form.reset();
    setTimeout(() => { btn.textContent = original; }, 2500);
  });
}
/* =====================================================
   ADDITIONS — paste at the very END of script.js
===================================================== */

// ---- Certificates: placeholders, filter counts, lightbox ----
(function () {
  const cards = document.querySelectorAll('.certificate-card');
  if (!cards.length) return;

  // Category labels come from the filter buttons themselves
  const labels = {};
  document.querySelectorAll('.filter-btn').forEach(b => {
    if (b.dataset.filter && b.dataset.filter !== 'all') labels[b.dataset.filter] = b.textContent.trim();
  });
  const icons = { course: '🎓', hackathon: '🏆', workshop: '🛠️', internship: '💼', badge: '🏅', other: '📜' };

  function makePlaceholder(cat) {
    const ph = document.createElement('div');
    ph.className = 'certificate-image is-placeholder';
    ph.innerHTML = '<span class="ph-icon">' + (icons[cat] || '📜') + '</span>' +
                   '<span class="ph-label">' + (labels[cat] || 'Certificate') + '</span>';
    return ph;
  }

  cards.forEach(card => {
    const cat = card.dataset.category;
    let box = card.querySelector('.certificate-image');

    // Card has no image box at all -> add one so every card has the same height
    if (!box) { card.prepend(makePlaceholder(cat)); return; }

    const img = box.querySelector('img');
    const swap = () => box.replaceWith(makePlaceholder(cat));
    if (!img) { swap(); return; }
    img.addEventListener('error', swap);
    if (img.complete && img.naturalWidth === 0) swap();
  });

  // Lightbox: click a certificate image to view it larger
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = '<button class="lightbox-close" aria-label="Close">×</button><img alt="">';
  document.body.appendChild(box);
  const big = box.querySelector('img');
  const close = () => box.classList.remove('open');

  document.addEventListener('click', e => {
    const img = e.target.closest('.certificate-image img');
    if (img) { big.src = img.src; big.alt = img.alt; box.classList.add('open'); return; }
    if (e.target === box || e.target.closest('.lightbox-close')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// ---- Back-to-top button (all pages) ----
(function () {
  const btn = document.createElement('button');
  btn.className = 'to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = '↑';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* =====================================================
   ADDITIONS 2 — paste at the very END of script.js
===================================================== */

// ---- Certificates: rebuild every card in one consistent structure ----
(function () {
  const cards = document.querySelectorAll('.certificates-grid .certificate-card');
  if (!cards.length) return;

  const labels = {};
  document.querySelectorAll('.filter-btn').forEach(b => {
    const f = b.dataset.filter;
    if (f && f !== 'all') labels[f] = b.childNodes[0].textContent.trim();
  });
  const icons = { course: '🎓', hackathon: '🏆', workshop: '🛠️', internship: '💼', badge: '🏅', other: '📜' };
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  cards.forEach(card => {
    if (card.dataset.rebuilt) return;
    const cat = card.dataset.category || 'other';
    const img = card.querySelector('img');
    const issuer = (card.querySelector('.certificate-issuer') || {}).textContent || '';
    const title = (card.querySelector('h3') || {}).textContent || '';
    const desc = (card.querySelector('.certificate-content p') || card.querySelector('p') || {}).textContent || '';
    const footer = card.querySelector('.certificate-footer');
    const date = footer && footer.querySelector('span') ? footer.querySelector('span').textContent : '';
    const link = (footer && footer.querySelector('a')) || card.querySelector('a');
    const href = link ? link.getAttribute('href') : '';
    const src = img ? img.getAttribute('src') : '';
    const alt = img ? img.getAttribute('alt') || title : title;
    const label = labels[cat] || 'Certificate';

    card.innerHTML =
      '<div class="certificate-image">' +
        (src ? '<img src="' + esc(src) + '" alt="' + esc(alt.trim()) + '" loading="lazy">' : '') +
        '<span class="certificate-category">' + esc(label) + '</span>' +
      '</div>' +
      '<div class="certificate-content">' +
        '<span class="certificate-issuer">' + esc(issuer.trim()) + '</span>' +
        '<h3>' + esc(title.trim()) + '</h3>' +
        '<p>' + esc(desc.trim()) + '</p>' +
        '<div class="certificate-footer"><span>' + esc(date.trim()) + '</span>' +
          (href ? '<a href="' + esc(href) + '" target="_blank" rel="noopener">View Certificate ↗</a>' : '') +
        '</div>' +
      '</div>';
    card.dataset.rebuilt = '1';

    // No image, or image failed to load -> uniform placeholder
    const box = card.querySelector('.certificate-image');
    const swap = () => {
      box.classList.add('is-placeholder');
      const i = box.querySelector('img'); if (i) i.remove();
      if (!box.querySelector('.ph-icon')) {
        box.insertAdjacentHTML('afterbegin',
          '<span class="ph-icon">' + (icons[cat] || '📜') + '</span>');
      }
    };
    const im = box.querySelector('img');
    if (!im) swap();
    else {
      im.addEventListener('error', swap);
      if (im.complete && im.naturalWidth === 0) swap();
    }
  });
})();

// ---- Skills: animate the meters when they scroll into view ----
(function () {
  const groups = document.querySelectorAll('.skill-group');
  if (!groups.length) return;
  const fill = g => g.querySelectorAll('.meter-fill').forEach((m, i) => {
    m.style.transitionDelay = (i * 120) + 'ms';
    m.style.width = m.dataset.level + '%';
  });
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    groups.forEach(fill); return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { fill(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.25 });
  groups.forEach(g => io.observe(g));
})();