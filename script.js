"use strict";

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
