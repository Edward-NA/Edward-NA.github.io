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
let hoveredProject = null;
let wheelLocked = false;
let touchStartY = null;

function renderProjects() {
	const midpoint = Math.floor(projectCards.length / 2);

	projectCards.forEach((card, index) => {
		const offset = ((index - activeProject + midpoint) % projectCards.length + projectCards.length) % projectCards.length - midpoint;
		const distance = Math.abs(offset);
		const isFocused = hoveredProject === index || distance === 0;
		const scale = distance === 0 ? 1 : distance === 1 ? 0.82 : 0.7;
		const translateY = offset * 240;

		card.classList.toggle('is-focused', isFocused);
		card.classList.toggle('is-dimmed', !isFocused);
		card.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
		card.style.opacity = isFocused ? '1' : distance === 1 ? '0.45' : '0.14';
		card.style.filter = isFocused ? 'none' : 'blur(3.2px) brightness(0.68) saturate(0.65)';
		card.style.zIndex = String(12 - distance + (isFocused ? 4 : 0));
		card.style.pointerEvents = distance === 0 || (hoveredProject === index) ? 'auto' : 'none';
		card.setAttribute('aria-hidden', String(distance !== 0 && hoveredProject !== index));
		card.querySelectorAll('a').forEach((link) => {
			link.tabIndex = isFocused ? 0 : -1;
		});
	});
}

function moveProject(direction) {
	activeProject = (activeProject + direction + projectCards.length) % projectCards.length;
	hoveredProject = null;
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
projectCards.forEach((card, index) => {
	card.addEventListener('mouseenter', () => {
		hoveredProject = index;
		activeProject = index;
		renderProjects();
	});
	card.addEventListener('mouseleave', () => {
		hoveredProject = null;
		renderProjects();
	});
	card.addEventListener('focusin', () => {
		hoveredProject = index;
		activeProject = index;
		renderProjects();
	});
	card.addEventListener('focusout', () => {
		hoveredProject = null;
		renderProjects();
	});
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

