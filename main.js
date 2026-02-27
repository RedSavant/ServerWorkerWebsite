/* =============================================
   SERVERWORKER — main.js
   ============================================= */

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== INTERSECTION OBSERVER — reveal cards =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.feature-card, .backup-card').forEach(el => revealObserver.observe(el));

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

// ===== RESTORE PROGRESS BAR ANIMATION =====
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');

const steps = [
  { label: 'Vérification du backup…', pct: 10 },
  { label: 'Création des catégories…', pct: 30 },
  { label: 'Création des rôles…', pct: 55 },
  { label: 'Création des salons…', pct: 78 },
  { label: 'Application des permissions…', pct: 92 },
  { label: '✅ Restauration terminée !', pct: 100 },
];

let stepIndex = 0;
let running = false;

function runProgress() {
  if (running) return;
  running = true;
  stepIndex = 0;

  function tick() {
    if (stepIndex >= steps.length) {
      // Pause 2s then restart
      setTimeout(() => {
        running = false;
        runProgress();
      }, 2000);
      return;
    }
    const step = steps[stepIndex];
    progressBar.style.width = step.pct + '%';
    progressLabel.textContent = step.label;
    stepIndex++;
    setTimeout(tick, stepIndex === steps.length ? 1200 : 700);
  }

  tick();
}

// Start when the restore card enters view
const loadCard = document.getElementById('card-load') || document.querySelector('.backup-card:nth-child(2)');
if (loadCard) {
  const progressObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(runProgress, 600);
      progressObserver.disconnect();
    }
  }, { threshold: 0.4 });
  progressObserver.observe(loadCard);
}

// ===== MASCOT PARALLAX =====
const mascotImg = document.querySelector('.mascot-img');
if (mascotImg) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    mascotImg.style.transform = `translateY(calc(var(--float-offset, 0px) + ${-y}px)) rotateY(${x * 0.4}deg)`;
  });
}
