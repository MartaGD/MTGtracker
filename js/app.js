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

function toggleStep(button) {
  const isExpanded = button.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    setExpanded(button, false);
  } else {
    openStep(button);
  }
}

function setCurrentStepByElement(step) {
  if (!step) return;

  steps.forEach((item) => item.classList.remove("current-step"));
  step.classList.add("current-step");
  current = steps.indexOf(step);
  updateIndicator();
}

stepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const step = button.closest(".step");
    if (!step) return;

    setCurrentStepByElement(step);
    toggleStep(button);
  });
});

if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (steps.length === 0) return;

    steps[current]?.classList.remove("current-step");
    current = (current + 1) % steps.length;

    const step = steps[current];
    step.classList.add("current-step");

    const button = step.querySelector(".step-button");
    if (button) {
      openStep(button);
    }

    updateIndicator();

    step.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}

// Estado inicial consistente.
closeAllPanels();
updateIndicator();
