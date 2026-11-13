"use strict";

document.documentElement.classList.remove("no-js");

// No dependencies. Area comparisons use one consistent 4,000-acre baseline.
const ACRE_TO_HECTARES = 0.40468564224;
const SITE_ACRES = 4000;
const siteHectares = SITE_ACRES * ACRE_TO_HECTARES;
const landmarks = {
  rizal: {
    hectares: 54,
    label: "Rizal Park tourism zone",
    sentence: "the area of Rizal Park’s 54-hectare tourism zone."
  },
  intramuros: {
    hectares: 64,
    label: "Intramuros, within the walls",
    sentence: "the area enclosed by the walls of Intramuros."
  },
  central: {
    hectares: 843 * ACRE_TO_HECTARES,
    label: "Central Park",
    sentence: "the area of New York’s Central Park."
  }
};

function selectLandmark(key) {
  const landmark = landmarks[key];
  if (!landmark) return;
  const fraction = landmark.hectares / siteHectares;
  // To scale square AREAS accurately, scale each SIDE by sqrt(area ratio).
  const sidePercent = Math.sqrt(fraction) * 100;
  const square = document.getElementById("landmark-square");
  square.style.width = `${sidePercent}%`;
  square.style.height = `${sidePercent}%`;
  document.getElementById("ratio").innerHTML = `${(1 / fraction).toFixed(1)}<span>×</span>`;
  document.getElementById("comparison-name").textContent = landmark.sentence;
  document.getElementById("legend-name").textContent = landmark.label;
  const referenceArea = key === "central" ? "843 acres" : `${landmark.hectares} hectares`;
  document.getElementById("area-description").textContent =
    `Red square: ${referenceArea}, or ${(fraction * 100).toFixed(2)}% of the proposed site.`;
  document.querySelectorAll("[data-landmark]").forEach(button => {
    const active = button.dataset.landmark === key;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

document.querySelectorAll("[data-landmark]").forEach(button => {
  button.addEventListener("click", () => selectLandmark(button.dataset.landmark));
});
selectLandmark("rizal");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.getElementById("navigation");
function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("open", open);
});
navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", event => {
  if (!event.target.closest(".header")) closeMenu();
});

// Scroll-scrubbed landscape. Native SVG/CSS only; no animation libraries.
const heroScroll = document.querySelector('.hero-scroll');
const heroStage = document.querySelector('.hero-stage');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let framePending = false;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeInOut = t => t * t * (3 - 2 * t);

function getSceneState(progress) {
  const p = clamp(progress);
  const travel = easeInOut(clamp(p / 0.83));
  const reveal = easeInOut(clamp((p - 0.55) / 0.3));
  return {
    '--p': String(p),
    '--back-left': `${-travel * 102}%`,
    '--back-right': `${travel * 102}%`,
    '--mid-x': `${travel * 112}%`,
    '--mid-y': `${travel * 8}%`,
    '--front-left': `${-travel * 116}%`,
    '--front-right': `${travel * 116}%`,
    '--front-y': `${travel * 7}%`,
    '--field-x': `${-travel * 120}%`,
    '--field-y': `${travel * 8}%`,
    '--digital-opacity': String(easeInOut(clamp(p / 0.55))),
    '--intro-opacity': String(1 - clamp(p / 0.27)),
    '--intro-y': `${-p * 75}px`,
    '--reveal-opacity': String(reveal),
    '--reveal-y': `${(1 - reveal) * 26}px`,
    '--reveal-visibility': reveal > 0 ? 'visible' : 'hidden',
    '--cue-opacity': String(1 - clamp(p / 0.3))
  };
}

function updateScene() {
  framePending = false;
  if (!heroScroll || !heroStage) return;
  const range = Math.max(1, heroScroll.offsetHeight - heroStage.offsetHeight);
  const progress = motionPreference.matches ? 0 : clamp(-heroScroll.getBoundingClientRect().top / range);
  const state = getSceneState(progress);
  for (const [name, value] of Object.entries(state)) heroStage.style.setProperty(name, value);
  // The staged link must not receive keyboard focus while visually hidden.
  const revealLink = document.querySelector('.reveal-title a');
  const cue = document.querySelector('.scroll-cue');
  if (revealLink) revealLink.tabIndex = state['--reveal-visibility'] === 'visible' && !motionPreference.matches ? 0 : -1;
  if (cue) cue.tabIndex = progress < 0.3 ? 0 : -1;
}
function requestSceneUpdate() {
  if (framePending) return;
  framePending = true;
  window.requestAnimationFrame(updateScene);
}
window.addEventListener('scroll', requestSceneUpdate, { passive: true });
window.addEventListener('resize', requestSceneUpdate, { passive: true });
window.addEventListener('pageshow', requestSceneUpdate);
motionPreference.addEventListener('change', requestSceneUpdate);
updateScene();

// Keep the bottom chapter guide in sync with the section being read.
if ('IntersectionObserver' in window) {
  const chapterLinks = [...document.querySelectorAll('[data-chapter]')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    if (!visible.length) return;
    const current = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0].target.id;
    chapterLinks.forEach(link => {
      const active = link.dataset.chapter === current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-12% 0px -45% 0px', threshold: 0 });
  chapterLinks.forEach(link => {
    const section = document.getElementById(link.dataset.chapter);
    if (section) observer.observe(section);
  });
}
