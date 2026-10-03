"use strict";

const steps = Array.from(document.querySelectorAll(".step"));
const stepButtons = Array.from(document.querySelectorAll(".step-button"));
const nextButton = document.getElementById("next-button");
const indicator = document.querySelector('[data-template-id="turn-indicator"]');

let current = -1;

function getPanel(button) {
  const panelId = button.getAttribute("aria-controls");
  return panelId ? document.getElementById(panelId) : null;
}

function setExpanded(button, expanded) {
  const panel = getPanel(button);
  if (!panel) return;

  button.setAttribute("aria-expanded", String(expanded));
  panel.hidden = !expanded;
}

function closeAllPanels(exceptButton = null) {
  stepButtons.forEach((button) => {
    if (button !== exceptButton) {
      setExpanded(button, false);
    }
  });
}

function updateIndicator() {
  if (!indicator) return;

  if (current < 0) {
    indicator.textContent = "Listo para empezar";
    return;
  }

  indicator.textContent = `Paso ${current + 1} de ${steps.length}`;
}

function openStep(button) {
  closeAllPanels(button);
  setExpanded(button, true);
}

function setCurrentStepByElement(step) {
  if (!step) return;

  steps.forEach((item) => item.classList.remove("current-step"));
  step.classList.add("current-step");
  current = steps.indexOf(step);
  updateIndicator();
}

function activateStep(step, { scroll = false } = {}) {
  if (!step) return;

  setCurrentStepByElement(step);

  const button = step.querySelector(".step-button");
  if (button) {
    openStep(button);
  }

  if (scroll) {
    step.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

steps.forEach((step) => {
  step.addEventListener("click", (event) => {
    // Evita forzar reapertura al interactuar con el contenido interno del panel.
    if (event.target.closest(".step-panel")) return;
    activateStep(step);
  });
});

if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (steps.length === 0) return;

    const nextIndex = (current + 1) % steps.length;
    const nextStep = steps[nextIndex];
    activateStep(nextStep, { scroll: true });
  });
}

// Estado inicial consistente.
closeAllPanels();
updateIndicator();
