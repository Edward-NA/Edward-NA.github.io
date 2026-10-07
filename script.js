const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

if (themeToggle && themeIcon) {
  const savedTheme = localStorage.getItem('theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const currentTheme = savedTheme || systemTheme;

  document.documentElement.dataset.theme = currentTheme;

  function updateThemeToggle() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    themeIcon.textContent = isDark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }

  updateThemeToggle();
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    updateThemeToggle();
  });
}

const PROJECTS = [
  {
    name: 'Skinning-AI',
    type: 'Group project',
    role: 'Model trainer, backend',
    desc: 'An AI-powered web application that integrates machine learning to detect and classify external skin diseases for diagnostic education.',
    tags: ['EfficientNet', 'Machine learning'],
    url: 'https://github.com/Edward-NA/SkinningAI'
  },
  {
    name: 'Traffic Detection MOG2',
    type: 'Group project',
    role: 'Model training, report writing, backend',
    desc: 'A computer vision system that leverages the MOG2 background subtraction algorithm to efficiently detect and track moving vehicles in video streams.',
    tags: ['Computer vision', 'MOG2'],
    url: 'https://github.com/Edward-NA/traffic-detection-mog2-CV-main'
  },
  {
    name: 'Bitcoin Sentiment Analysis',
    type: 'Group project',
    role: 'NLP',
    desc: 'A comparative study of Naive Bayes, Logistic Regression, and DistilBERT for Bitcoin tweet sentiment analysis with a Streamlit prediction app.',
    tags: ['NLP', 'DistilBERT'],
    url: 'https://github.com/Edward-NA/bitcoin-sentiment-app'
  },
  {
    name: "B' Helpful",
    type: 'Group project',
    role: 'QA Tester',
    desc: 'A volunteering platform prototype connecting event organizers with volunteers while helping students track their community service hours.',
    tags: ['PHP', 'MySQL', 'Testing'],
    url: 'https://github.com/Edward-NA/Bhelpful'
  },
  {
    name: 'VSTravel',
    type: 'Personal project',
    role: 'Full-stack developer',
    desc: 'A comprehensive travel information system built to streamline route searching, destination browsing, and overall trip planning.',
    tags: ['Web', 'Full-stack'],
    url: 'https://github.com/Edward-NA/VSTravel'
  }
];

const box = document.getElementById('cards');
const veil = document.getElementById('veil');
const n = PROJECTS.length;
let cur = 0;
const els = [];

PROJECTS.forEach((p, i) => {
  const a = document.createElement('article');
  a.className = 'pc';

  const roleMarkup = p.role
    ? '<div class="role"><b>' + p.type + '</b>' + p.role + '</div>'
    : '<div class="role"><b>' + p.type + '</b>Solo build</div>';

  a.innerHTML =
    '<div class="in">' + roleMarkup +
    '<h3>' + p.name + '</h3>' +
    '<p>' + p.desc + '</p>' +
    '<ul class="chips">' + p.tags.map((t) => '<li>' + t + '</li>').join('') + '</ul>' +
    '<a class="btn" href="' + p.url + '" target="_blank" rel="noopener">View repository</a></div>';

  a.addEventListener('click', (e) => {
    if (!a.classList.contains('c')) {
      e.preventDefault();
      cur = i;
      render();
    }
  });

  box.appendChild(a);
  els.push(a);
});

function render() {
  const half = Math.floor(n / 2);
  const w = els[0].offsetWidth;
  const step = w * (window.innerWidth < 700 ? 0.78 : 0.86);

  els.forEach((el, i) => {
    let off = ((i - cur + half) % n + n) % n - half;
    const abs = Math.abs(off);
    const scale = abs === 0 ? 1 : abs === 1 ? 0.8 : 0.62;

    el.style.transform = 'translateX(' + off * step + 'px) scale(' + scale + ')';
    el.style.opacity = abs === 0 ? 1 : abs === 1 ? 0.55 : abs === 2 ? 0.25 : 0;
    el.style.zIndex = String(10 - abs);
    el.style.pointerEvents = abs > 1 ? 'none' : 'auto';
    el.classList.toggle('c', off === 0);
    el.setAttribute('aria-hidden', off === 0 ? 'false' : 'true');
    el.querySelectorAll('a').forEach((link) => {
      link.tabIndex = off === 0 ? 0 : -1;
    });
  });

  veil.classList.remove('show');
}

function go(direction) {
  cur = (cur + direction + n) % n;
  render();
}

document.getElementById('next').onclick = () => go(1);
document.getElementById('prev').onclick = () => go(-1);
box.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') go(1);
  if (e.key === 'ArrowLeft') go(-1);
});
window.addEventListener('resize', render);

box.addEventListener('mouseover', (e) => {
  const c = e.target.closest('.pc');
  veil.classList.toggle('show', !!(c && c.classList.contains('c')));
});
box.addEventListener('mouseleave', () => {
  veil.classList.remove('show');
});

let sx = null;
let moved = false;
box.addEventListener('pointerdown', (e) => {
  sx = e.clientX;
  moved = false;
});
window.addEventListener('pointerup', (e) => {
  if (sx === null) return;
  const dx = e.clientX - sx;
  sx = null;
  if (Math.abs(dx) > 50) {
    moved = true;
    go(dx < 0 ? 1 : -1);
  }
});
box.addEventListener('click', (e) => {
  if (moved) {
    e.preventDefault();
    e.stopPropagation();
    moved = false;
  }
}, true);

render();
