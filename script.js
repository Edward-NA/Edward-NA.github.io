const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
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

const projectList = document.getElementById('project-list');
const projectCards = [...projectList.querySelectorAll('.card')];
let activeProject = 0;
let wheelLocked = false;
let touchStartY = null;

function renderProjects() {
	const midpoint = Math.floor(projectCards.length / 2);

	projectCards.forEach((card, index) => {
		const offset = ((index - activeProject + midpoint) % projectCards.length + projectCards.length) % projectCards.length - midpoint;
		const distance = Math.abs(offset);
		const scale = distance === 0 ? 1 : distance === 1 ? 0.78 : 0.62;
		const translateY = offset * 285;

		card.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
		card.style.opacity = distance === 0 ? '1' : distance === 1 ? '0.52' : '0.18';
		card.style.filter = distance === 0 ? 'none' : distance === 1 ? 'blur(1px)' : 'blur(2px)';
		card.style.zIndex = String(10 - distance);
		card.style.pointerEvents = distance === 0 ? 'auto' : 'none';
		card.setAttribute('aria-hidden', String(distance !== 0));
		card.querySelectorAll('a').forEach((link) => {
			link.tabIndex = distance === 0 ? 0 : -1;
		});
	});
}

function moveProject(direction) {
	activeProject = (activeProject + direction + projectCards.length) % projectCards.length;
	renderProjects();
}

document.getElementById('project-up').addEventListener('click', () => moveProject(-1));
document.getElementById('project-down').addEventListener('click', () => moveProject(1));
projectList.addEventListener('keydown', (event) => {
	if (event.key === 'ArrowUp') {
		e.preventDefault();
		moveProject(-1);
	}
	if (event.key === 'ArrowDown') {
		e.preventDefault();
		moveProject(1);
	}
});
projectList.addEventListener('wheel', (event) => {
	if (wheelLocked || Math.abs(event.deltaY) < 20) return;
	event.preventDefault();
	wheelLocked = true;
	moveProject(event.deltaY > 0 ? 1 : -1);
	window.setTimeout(() => { wheelLocked = false; }, 450);
}, { passive: false });
projectList.addEventListener('pointerdown', (event) => {
	touchStartY = event.clientY;
});
window.addEventListener('pointerup', (event) => {
	if (touchStartY === null) return;
	const deltaY = event.clientY - touchStartY;
	touchStartY = null;
	if (Math.abs(deltaY) > 50) moveProject(deltaY < 0 ? 1 : -1);
});

renderProjects();

