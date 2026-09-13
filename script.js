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
const groupSelectors = ['.project-grid', '.certificates-grid', '.skills-extra', '.skills-badges'];
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

// Skill badges: automatically resolve each skill name to its technology icon.
// Add a new skill anywhere with data-skill="Name" and it will pick up an icon
// automatically — no manual icon lookup needed per skill.
const skillIconSlugs = {
  html: 'html5',
  css: 'css3',
  javascript: 'javascript',
  js: 'javascript',
  react: 'react',
  java: 'java',
  mysql: 'mysql',
  git: 'git',
  github: 'github',
  figma: 'figma',
  canva: 'canva',
  nodejs: 'nodedotjs',
  node: 'nodedotjs'
};

document.querySelectorAll('.skill-badge[data-skill]').forEach(badge => {
  const name = badge.dataset.skill;
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const slug = skillIconSlugs[key];

  const iconWrap = document.createElement('div');
  iconWrap.className = 'badge-icon';

  if (slug) {
    const img = document.createElement('img');
    img.src = `https://cdn.simpleicons.org/${slug}/ffffff`;
    img.alt = name;
    img.width = 30;
    img.height = 30;
    img.loading = 'lazy';
    img.onerror = () => { iconWrap.textContent = name.charAt(0).toUpperCase(); };
    iconWrap.appendChild(img);
  } else {
    // Unknown skill name: fall back to its first letter rather than a broken icon
    iconWrap.textContent = name.charAt(0).toUpperCase();
  }

  const label = document.createElement('h4');
  label.textContent = name;

  badge.appendChild(iconWrap);
  badge.appendChild(label);
});

// Skill icons: auto-detect each skill's name and inject a matching symbol.
// Add a new skill row anywhere and, if its name matches a key below
// (or partially matches, e.g. "Git" inside "Git & GitHub"), its icon
// appears automatically — no markup changes needed.
const SKILL_ICONS = {
  html: '<svg viewBox="0 0 24 24" fill="none" stroke="#e34f26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 4 2 12 8 20"/><polyline points="16 4 22 12 16 20"/></svg>',
  css: '<svg viewBox="0 0 24 24" fill="none" stroke="#2965f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 8 5 11.5 5 15a7 7 0 0014 0c0-3.5-3-7-7-13z"/></svg>',
  javascript: '<svg viewBox="0 0 24 24" fill="none" stroke="#d7b600" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4c-2 0-3 1-3 3v3c0 1-.5 2-2 2 1.5 0 2 1 2 2v3c0 2 1 3 3 3"/><path d="M16 4c2 0 3 1 3 3v3c0 1 .5 2 2 2-1.5 0-2 1-2 2v3c0 2-1 3-3 3"/></svg>',
  java: '<svg viewBox="0 0 24 24" fill="none" stroke="#c74634" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5V9z"/><path d="M17 10h1.5a2.5 2.5 0 010 5H17"/><path d="M8 3c-.5 1 .5 1.5 0 2.5M12 3c-.5 1 .5 1.5 0 2.5"/></svg>',
  mysql: '<svg viewBox="0 0 24 24" fill="none" stroke="#00758f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
  git: '<svg viewBox="0 0 24 24" fill="none" stroke="#f05033" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M18 9a9 9 0 01-9 9"/><circle cx="18" cy="6" r="3"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="#f05033" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M18 9a9 9 0 01-9 9"/><circle cx="18" cy="6" r="3"/></svg>',
  figma: '<svg viewBox="0 0 24 24" fill="none" stroke="#a259ff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><circle cx="17" cy="17" r="4"/></svg>',
  canva: '<svg viewBox="0 0 24 24" fill="none" stroke="#a259ff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><circle cx="17" cy="17" r="4"/></svg>',
  default: '<svg viewBox="0 0 24 24" fill="none" stroke="#5b6478" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 4 2 12 8 20"/><polyline points="16 4 22 12 16 20"/></svg>'
};

function findSkillIcon(name) {
  const key = name.toLowerCase().trim();
  if (SKILL_ICONS[key]) return SKILL_ICONS[key];
  const match = Object.keys(SKILL_ICONS).find(k => k !== 'default' && key.includes(k));
  return match ? SKILL_ICONS[match] : SKILL_ICONS.default;
}

document.querySelectorAll('.skill-top span:first-child').forEach(nameEl => {
  const iconSpan = document.createElement('span');
  iconSpan.className = 'skill-icon';
  iconSpan.innerHTML = findSkillIcon(nameEl.textContent);
  nameEl.prepend(iconSpan);
});

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
  const tiltCards = document.querySelectorAll('.project-card, .skill-card, .certificate-card, .badge-card');
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