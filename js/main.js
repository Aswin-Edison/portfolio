/**
 * ============================================
 *  ASWIN EDISON – Portfolio JavaScript
 *  Author:  Aswin.E
 *  Version: 1.0
 *  Description: Handles all interactive
 *               features of the portfolio
 * ============================================
 */

/* ============ LOADING SCREEN ============ */
(function initLoader() {
  // ── Starfield ──────────────────────────────────────────
  const canvas = document.getElementById('loader-stars');
  const ctx    = canvas ? canvas.getContext('2d') : null;
  const stars  = [];
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function createStars(n) {
    stars.length = 0;
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        o: Math.random(),
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2
      });
    }
  }
  function drawStars(t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const opacity = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,210,255,${opacity})`;
      ctx.fill();
    });
  }
  let rafId;
  function animateStars(t) {
    drawStars(t / 1000);
    rafId = requestAnimationFrame(animateStars);
  }
  resizeCanvas();
  createStars(160);
  rafId = requestAnimationFrame(animateStars);
  window.addEventListener('resize', () => { resizeCanvas(); createStars(160); });

  // ── Status messages ────────────────────────────────────
  const messages = [
    'Initializing Systems...',
    'Loading Cloud Modules...',
    'Connecting to AWS Infrastructure...',
    'Spinning up Kubernetes clusters...',
    'Configuring CI/CD Pipelines...',
    'Almost Ready...'
  ];
  const textEl    = document.getElementById('loader-text');
  const percentEl = document.getElementById('loader-percent');
  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    msgIdx = Math.min(msgIdx + 1, messages.length - 1);
    if (textEl) textEl.textContent = messages[msgIdx];
  }, 320);

  // ── Percentage counter synced to 1.8s bar animation ───
  const totalMs   = 1800;
  const startTime = performance.now();
  // Non-linear easing matching CSS keyframes
  function easePercent(p) {
    if (p < 0.30) return p / 0.30 * 25;
    if (p < 0.60) return 25 + (p - 0.30) / 0.30 * 40;
    if (p < 0.85) return 65 + (p - 0.60) / 0.25 * 23;
    return 88 + (p - 0.85) / 0.15 * 12;
  }
  function updatePercent(now) {
    const elapsed = now - startTime;
    const raw     = Math.min(elapsed / totalMs, 1);
    const pct     = Math.round(easePercent(raw));
    if (percentEl) percentEl.textContent = pct + '%';
    if (raw < 1) requestAnimationFrame(updatePercent);
    else if (percentEl) percentEl.textContent = '100%';
  }
  requestAnimationFrame(updatePercent);

  // ── Hide loader after animation finishes ──────────────
  window.addEventListener('load', () => {
    setTimeout(() => {
      clearInterval(msgInterval);
      cancelAnimationFrame(rafId);
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
      document.body.style.overflow = '';
      initHeroAnimations();
    }, 2000);
  });
})();

// Prevent scroll during load
document.body.style.overflow = 'hidden';



/* ============ SCROLL PROGRESS INDICATOR ============ */
function updateScrollProgress() {
  const scrollTop    = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress     = (scrollTop / scrollHeight) * 100;
  const bar          = document.getElementById('scroll-progress');
  if (bar) bar.style.width = `${Math.min(progress, 100)}%`;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });


/* ============ STICKY NAVBAR ============ */
function handleNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbar, { passive: true });


/* ============ ACTIVE NAV LINKS ON SCROLL ============ */
function updateActiveNavLink() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', updateActiveNavLink, { passive: true });


/* ============ MOBILE HAMBURGER MENU ============ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks && hamburger) {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  }
});


/* ============ DARK / LIGHT MODE TOGGLE ============ */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = themeToggle ? themeToggle.querySelector('i') : null;

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  } else {
    document.body.classList.remove('light-mode');
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }
}

// Load saved theme preference
const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });
}


/* ============ TYPING ANIMATION ============ */
function initTypingAnimation() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const words    = ['Cloud Engineer', 'DevOps Engineer', 'AWS Enthusiast'];
  let wordIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      // Typing forward
      typingEl.textContent = currentWord.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        // Word complete — pause before deleting
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 90);
    } else {
      // Deleting
      typingEl.textContent = currentWord.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Deleted — move to next word
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }

  // Start typing after a short delay
  setTimeout(type, 1200);
}


/* ============ HERO ANIMATIONS ============ */
function initHeroAnimations() {
  initTypingAnimation();
  // Trigger initial visible elements
  document.querySelectorAll('.hero .fade-in, .hero .fade-in-right').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 200);
  });
}


/* ============ SCROLL-TRIGGERED FADE-IN ============ */
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('.fade-in, .fade-in-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars when visible
        const bars = entry.target.querySelectorAll('.skill-bar-fill');
        bars.forEach(bar => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        });
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  });

  animatedEls.forEach(el => observer.observe(el));
}


/* ============ ANIMATED COUNTERS ============ */
function animateCounter(el, target, duration = 1600) {
  let start     = 0;
  const step    = target / (duration / 16);
  const counter = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start >= target) {
      el.textContent = target;
      clearInterval(counter);
    }
  }, 16);
}

function initCounters() {
  const counterEls = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.getAttribute('data-count'), 10);
        animateCounter(entry.target, target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
}


/* ============ SKILL BAR ANIMATION ============ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = `${width}%`;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  bars.forEach(bar => observer.observe(bar));
}


/* ============ SKILLS TAB SWITCHER ============ */
function initSkillsTabs() {
  const tabs   = document.querySelectorAll('.skill-tab');
  const grids  = document.querySelectorAll('.skills-grid');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');

      // Update tab active states + ARIA
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Show/hide grids
      grids.forEach(grid => {
        if (grid.id === `${category}-skills`) {
          grid.removeAttribute('hidden');
          grid.classList.add('active');
          // Re-trigger skill bar animations for newly visible bars
          grid.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = bar.getAttribute('data-width') + '%';
            }, 50);
          });
          // Re-trigger fade animations
          grid.querySelectorAll('.fade-in').forEach((el, i) => {
            el.classList.remove('visible');
            setTimeout(() => el.classList.add('visible'), i * 60);
          });
        } else {
          grid.setAttribute('hidden', '');
          grid.classList.remove('active');
        }
      });
    });

    // Keyboard: Enter/Space to activate tab
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
      }
    });
  });
}


/* ============ RIPPLE EFFECT ============ */
function initRippleEffect() {
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect   = btn.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const size   = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.cssText = `
        width:  ${size}px;
        height: ${size}px;
        left:   ${x - size / 2}px;
        top:    ${y - size / 2}px;
      `;

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}


/* ============ CONTACT FORM ============ */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('#contact-name').value.trim();
    const email   = form.querySelector('#contact-email').value.trim();
    const subject = form.querySelector('#contact-subject').value.trim();
    const message = form.querySelector('#contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      showFormStatus('error', '⚠️ Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      showFormStatus('error', '⚠️ Please enter a valid email address.');
      return;
    }

    // Simulate submission (replace with actual backend/Formspree)
    submitBtn.disabled  = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Simulate async delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    showFormStatus(
      'success',
      '✅ Message sent successfully! I\'ll get back to you soon.'
    );
    form.reset();

    submitBtn.disabled  = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  });

  function showFormStatus(type, msg) {
    status.className   = `form-status ${type}`;
    status.textContent = msg;
    setTimeout(() => {
      status.className = 'form-status';
    }, 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}


/* ============ BACK-TO-TOP BUTTON ============ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============ SMOOTH SCROLL FOR ANCHOR LINKS ============ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = 80; // Navbar height offset
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ============ GITHUB CONTRIBUTION CALENDAR ============ */
function generateGitHubCalendar() {
  const container = document.getElementById('gh-calendar');
  if (!container) return;

  const weeks    = 26; // 26 weeks ~= 6 months
  const days     = 7;
  // Color levels: 0=none, 1=low, 2=med, 3=high, 4=peak
  const colors   = ['#1e293b', '#0e4429', '#006d32', '#26a641', '#39d353'];

  for (let w = 0; w < weeks; w++) {
    const week = document.createElement('div');
    week.classList.add('gh-week');

    for (let d = 0; d < days; d++) {
      const day   = document.createElement('div');
      day.classList.add('gh-day');
      // Random weighted contribution level
      const rand  = Math.random();
      let level = 0;
      if (rand > 0.35) {
        level = rand > 0.75 ? (rand > 0.9 ? 4 : 3) : (rand > 0.6 ? 2 : 1);
      }
      day.style.background    = colors[level];
      day.title               = `${level * 3} contributions`;
      day.setAttribute('aria-label', `${level * 3} contributions`);
      week.appendChild(day);
    }
    container.appendChild(week);
  }
}


/* ============ GITHUB REPOSITORIES DYNAMIC FETCH ============ */
async function initDynamicProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  // Language color map
  const langColors = {
    'Python':           '#3776AB',
    'Jupyter Notebook': '#DA5B0B',
    'JavaScript':       '#F7DF1E',
    'TypeScript':       '#3178C6',
    'HTML':             '#E34F26',
    'CSS':              '#1572B6',
    'Java':             '#B07219',
    'Go':               '#00ADD8',
    'Rust':             '#DEA584',
    'Shell':            '#4EAA25',
    'YAML':             '#CB171E',
    'C++':              '#F34B7D',
    'C':                '#555555',
    'default':          '#2563EB'
  };

  // Per-repo enriched descriptions (fallback if GitHub description is empty)
  const fallbackDescs = {
    'Excuse-Pattern-Recognition': 'Developed AI-powered task management system using NLP and Machine Learning for delay pattern analysis.',
    'industrial_defect_detection': 'Built computer vision system using Python, OpenCV, and Machine Learning techniques.',
    'AWS-Static-Website-Deployment': 'Hosted static website using Amazon S3 with IAM permissions and bucket policy configuration.'
  };

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatName(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function buildCard(repo, idx) {
    const lang       = repo.language || null;
    const color      = langColors[lang] || langColors['default'];
    const isSN       = repo.name.toLowerCase().includes('servicenow');
    const displayLang = isSN ? 'ServiceNow' : (lang || 'Code');
    const tagColor   = isSN ? '#82b1a0' : color;
    const desc       = (repo.description && repo.description.length > 10)
                         ? repo.description.replace(/^[""]|[""]$/g, '')
                         : (fallbackDescs[repo.name] || 'A professional repository for cloud and data engineering.');
    const updated    = formatDate(repo.updated_at);
    const stars      = repo.stargazers_count || 0;
    const forks      = repo.forks_count || 0;
    const isOpen     = repo.open_issues_count > 0;

    const card = document.createElement('article');
    // Use 'project-card gh-card' – NO fade-in class, animate via inline style instead
    card.className     = `project-card gh-card${idx === 0 ? ' featured-card' : ''}`;
    card.tabIndex      = 0;
    card.dataset.lang  = lang || 'other';
    card.setAttribute('aria-label', `Project: ${repo.name}`);
    // Stagger entrance via CSS animation-delay
    card.style.animationDelay = `${idx * 0.08}s`;

    card.innerHTML = `
      <div class="project-card-accent"></div>
      <div class="project-content">
        <div class="project-tags">
          <span class="tag" style="--tag-color:${tagColor};">${displayLang}</span>
          ${stars > 0 ? `<span class="tag" style="--tag-color:#F59E0B;"><i class="fas fa-star" aria-hidden="true"></i> ${stars}</span>` : ''}
          <span class="lang-dot" aria-hidden="true">
            <span class="lang-dot-circle" style="background:${tagColor};"></span>
            ${displayLang}
          </span>
        </div>
        <h3 class="project-title">${formatName(repo.name)}</h3>
        <p class="project-desc">${desc}</p>
        <div class="project-gh-stats" aria-label="Repository statistics">
          <span class="gh-stat-item" title="Stars"><i class="fas fa-star" aria-hidden="true"></i> ${stars}</span>
          <span class="gh-stat-item" title="Forks"><i class="fas fa-code-fork" aria-hidden="true"></i> ${forks}</span>
          ${isOpen ? `<span class="gh-stat-item" title="Open Issues"><i class="fas fa-circle-dot" aria-hidden="true"></i> ${repo.open_issues_count}</span>` : ''}
          <span class="gh-updated">Updated ${updated}</span>
        </div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-btn btn-github" aria-label="View ${repo.name} on GitHub">
            <i class="fab fa-github" aria-hidden="true"></i> GitHub
          </a>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-btn btn-live" aria-label="View Live Demo"><i class="fas fa-external-link-alt" aria-hidden="true"></i> Live Demo</a>` : ''}
        </div>
      </div>
    `;
    return card;
  }

  // ── Filter logic ────────────────────────────────────────────────────────────
  // Dynamically remove the categorization filters via DOM
  const projectFilters = document.querySelector('.project-filters');
  if (projectFilters) {
    projectFilters.remove();
  }

  function applyFilter(filter) {
    const cards = grid.querySelectorAll('.project-card');
    cards.forEach(card => {
      const lang = card.dataset.lang || '';
      let show = false;
      if (filter === 'all')              show = true;
      else if (filter === 'other')       show = !['Python','Jupyter Notebook','JavaScript','TypeScript','HTML','CSS'].includes(lang);
      else                               show = lang === filter;
      card.classList.toggle('hidden-card', !show);
    });
  }

  document.querySelectorAll('.project-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.project-filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.dataset.filter);
    });
  });

  // ── Fetch ───────────────────────────────────────────────────────────────────
  try {
    const response = await fetch('https://api.github.com/users/Aswin-Edison/repos?sort=updated&per_page=30');
    if (!response.ok) throw new Error('GitHub API failed');
    const repos = await response.json();

    // Exclude profile readme repo; sort pinned/featured first (by pushed_at)
    const filtered = repos
      .filter(r => r.name !== 'Aswin050411' && !r.fork)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    if (filtered.length > 0) {
      grid.innerHTML = '';    // Clear skeleton loaders
      filtered.forEach((repo, idx) => {
        const card = buildCard(repo, idx);
        grid.appendChild(card);
      });

      // Update GitHub stats counter in the GitHub section
      const repoCounter = document.querySelector('[data-count="15"]');
      if (repoCounter) repoCounter.setAttribute('data-count', filtered.length);

      initCardTilt();
    }
  } catch (err) {
    console.warn('GitHub API unavailable, using static fallback cards:', err);
    // Static fallback data
    const fallback = [
      { name:'Excuse-Pattern-Recognition', language:'Python', html_url:'https://github.com/Aswin-Edison/Excuse-Pattern-Recognition', description: fallbackDescs['Excuse-Pattern-Recognition'], stargazers_count:0, forks_count:0, open_issues_count:0, updated_at:'2026-06-16', homepage:null, fork:false },
      { name:'industrial_defect_detection', language:'Python', html_url:'https://github.com/Aswin-Edison/industrial_defect_detection', description: fallbackDescs['industrial_defect_detection'], stargazers_count:0, forks_count:0, open_issues_count:0, updated_at:'2025-05-19', homepage:null, fork:false },
      { name:'AWS-Static-Website-Deployment', language:'HTML', html_url:'https://github.com/Aswin-Edison/AWS-Static-Website-Deployment', description: fallbackDescs['AWS-Static-Website-Deployment'], stargazers_count:0, forks_count:0, open_issues_count:0, updated_at:'2026-07-01', homepage:null, fork:false }
    ];
    grid.innerHTML = '';
    fallback.forEach((repo, idx) => {
      const card = buildCard(repo, idx);
      grid.appendChild(card);
    });
    initCardTilt();
  }
}


/* ============ PARALLAX PARTICLES ============ */
function initParallax() {
  const particles = document.querySelectorAll('.particle');
  if (!particles.length) return;

  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xRatio = (clientX / innerWidth - 0.5) * 2;
    const yRatio = (clientY / innerHeight - 0.5) * 2;

    particles.forEach((p, i) => {
      const speed = (i % 4 + 1) * 4;
      p.style.transform = `translate(${xRatio * speed}px, ${yRatio * speed}px)`;
    });
  });
}


/* ============ PROJECT CARD TILT EFFECT ============ */
function initCardTilt() {
  const cards = document.querySelectorAll('.project-card, .skill-card, .cert-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const xRot   = ((y / rect.height) - 0.5) * 8;
      const yRot   = ((x / rect.width)  - 0.5) * -8;
      card.style.transform = `perspective(700px) rotateX(${xRot}deg) rotateY(${yRot}deg) translateY(-6px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}


/* ============ GLOWING CURSOR DOT (Desktop) ============ */
function initGlowCursor() {
  if (window.innerWidth < 900) return; // Skip on mobile
  const cursor = document.createElement('div');
  cursor.id    = 'cursor-glow';
  cursor.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    top: 50%; left: 50%;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
}


/* ============ INIT ALL ============ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCounters();
  initSkillBars();
  initSkillsTabs();
  initRippleEffect();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
  generateGitHubCalendar();
  initParallax();
  initCardTilt();
  initGlowCursor();
  initDynamicProjects();

  // Ensure hero section animates after page load in case loader is already hidden
  setTimeout(initHeroAnimations, 2000);
});
