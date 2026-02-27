/* =============================================
   SERVERWORKER — main.js
   ============================================= */

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quart
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(eased * target);

    if (target >= 1000000) {
      el.textContent = (current / 1000000).toFixed(1) + 'M+';
    } else if (target >= 10000) {
      el.textContent = current.toLocaleString('fr-FR') + '+';
    } else if (target === 99) {
      el.textContent = current + '%';
    } else {
      el.textContent = current;
    }

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ===== INTERSECTION OBSERVER =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

// Feature cards reveal
const featureCards = document.querySelectorAll('.feature-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      cardObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

featureCards.forEach(card => cardObserver.observe(card));

// Counter elements
const counters = document.querySelectorAll('.stat-num, .meta-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      if (target) animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ===== COMMAND PREVIEW =====
const commands = {
  ban: {
    name: '/ban',
    desc: 'Bannir un membre du serveur',
    emoji: '🔨',
    usage: '/ban @utilisateur [raison] [durée]',
    example: '/ban @Spammer123 Spam répété 7j',
    perms: 'BAN_MEMBERS',
    tags: ['Modération', 'Admin'],
    output: 'Embed de confirmation envoyé en channel #logs + DM au membre banni.'
  },
  ticket: {
    name: '/ticket',
    desc: 'Créer un ticket de support',
    emoji: '🎫',
    usage: '/ticket [sujet]',
    example: '/ticket Problème avec mon rôle acheteur',
    perms: 'Tout le monde',
    tags: ['Support', 'Staff'],
    output: 'Canal privé créé avec l\'équipe de support. Transcription auto à la fermeture.'
  },
  play: {
    name: '/play',
    desc: 'Jouer de la musique depuis YouTube / Spotify',
    emoji: '🎵',
    usage: '/play [url ou recherche]',
    example: '/play Daft Punk Get Lucky',
    perms: 'Connecté à un salon vocal',
    tags: ['Musique', 'Fun'],
    output: 'Rejoint le salon vocal et lance la lecture. File d\'attente affichée.'
  },
  rank: {
    name: '/rank',
    desc: 'Afficher sa carte de rang et son XP',
    emoji: '📊',
    usage: '/rank [@utilisateur]',
    example: '/rank @Alex',
    perms: 'Tout le monde',
    tags: ['XP', 'Profil'],
    output: 'Carte de rang générée avec avatar, niveau, XP, et classement.'
  },
  setup: {
    name: '/setup',
    desc: 'Configurer ServerWorker sur ce serveur',
    emoji: '⚙️',
    usage: '/setup [module]',
    example: '/setup modération',
    perms: 'ADMINISTRATOR',
    tags: ['Config', 'Admin'],
    output: 'Assistant interactif lancé via boutons Discord. Aucun dashboard nécessaire.'
  }
};

const cmdItems = document.querySelectorAll('.cmd-item');
const cmdPreview = document.getElementById('cmdPreview');

function renderPreview(key) {
  const cmd = commands[key];
  if (!cmd) return;

  cmdPreview.innerHTML = `
    <div class="cmd-preview-header">
      <span class="cmd-preview-emoji">${cmd.emoji}</span>
      <div>
        <div class="cmd-preview-name">${cmd.name}</div>
        <div class="cmd-preview-tagline">${cmd.desc}</div>
      </div>
    </div>

    <div class="cmd-preview-row">
      <div class="cmd-preview-label">Utilisation</div>
      <code class="cmd-preview-code">${cmd.usage}</code>
    </div>

    <div class="cmd-preview-row">
      <div class="cmd-preview-label">Exemple</div>
      <code class="cmd-preview-code accent">${cmd.example}</code>
    </div>

    <div class="cmd-preview-row">
      <div class="cmd-preview-label">Permission requise</div>
      <span class="cmd-preview-perm">${cmd.perms}</span>
    </div>

    <div class="cmd-preview-row">
      <div class="cmd-preview-label">Résultat</div>
      <p class="cmd-preview-output">${cmd.output}</p>
    </div>

    <div class="cmd-tags">
      ${cmd.tags.map(t => `<span class="cmd-tag">${t}</span>`).join('')}
    </div>
  `;

  // Animate in
  cmdPreview.style.opacity = '0';
  cmdPreview.style.transform = 'translateY(8px)';
  requestAnimationFrame(() => {
    cmdPreview.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    cmdPreview.style.opacity = '1';
    cmdPreview.style.transform = 'translateY(0)';
  });
}

cmdItems.forEach(item => {
  item.addEventListener('click', () => {
    cmdItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    renderPreview(item.dataset.cmd);
  });
});

// Init preview
renderPreview('ban');

// ===== TERMINAL REMOVED (mascot hero now) =====

// ===== MASCOT PARALLAX =====
const mascotImg = document.querySelector('.mascot-img');
const mascotWrap = document.querySelector('.hero-mascot-wrap');

if (mascotWrap && mascotImg) {
  document.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 16;
    const y = (e.clientY / innerHeight - 0.5) * 10;
    mascotImg.style.transform = `translateY(calc(var(--float-y, 0px) + ${-y}px)) rotateY(${x * 0.5}deg)`;
  });
}


// ===== INJECT COMMAND PREVIEW STYLES =====
const previewStyles = document.createElement('style');
previewStyles.textContent = `
  .cmd-preview-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  .cmd-preview-emoji { font-size: 2.4rem; line-height: 1; }
  .cmd-preview-name {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    color: var(--accent);
    font-weight: 700;
  }
  .cmd-preview-tagline { color: var(--text-muted); font-size: 0.9rem; margin-top: 4px; }
  .cmd-preview-row { margin-bottom: 16px; }
  .cmd-preview-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-dim);
    font-family: var(--font-mono);
    margin-bottom: 6px;
  }
  .cmd-preview-code {
    display: inline-block;
    padding: 6px 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--text);
  }
  .cmd-preview-code.accent { color: var(--accent); }
  .cmd-preview-perm {
    display: inline-block;
    padding: 4px 10px;
    background: rgba(0, 245, 255, 0.06);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--text-muted);
  }
  .cmd-preview-output { color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; }
  .cmd-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border); }
  .cmd-tag {
    padding: 4px 12px;
    background: rgba(0, 128, 255, 0.08);
    border: 1px solid rgba(0, 128, 255, 0.2);
    border-radius: 100px;
    font-size: 0.75rem;
    color: var(--accent2);
    font-family: var(--font-mono);
  }
`;
document.head.appendChild(previewStyles);
