export class UI {
  constructor({
    displayElement,
    progressElement,
    statusElement,
    startButton,
    pauseButton,
    resetButton,
    modeButtons,
  }) {
    this.displayElement = displayElement;
    this.progressElement = progressElement;
    this.statusElement = statusElement;
    this.startButton = startButton;
    this.pauseButton = pauseButton;
    this.resetButton = resetButton;
    this.modeButtons = [...modeButtons];
  }

  renderTime(time) {
    this.displayElement.textContent = time;
    this.displayElement.setAttribute("aria-label", `Tempo restante: ${time}`);
  }

  renderProgress(progress) {
    const normalizedProgress = Math.min(Math.max(progress, 0), 1);
    const radius = this.progressElement.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    this.progressElement.style.strokeDasharray = `${circumference}`;
    this.progressElement.style.strokeDashoffset = `${
      circumference * (1 - normalizedProgress)
    }`;
  }

  renderStatus(message) {
    this.statusElement.textContent = message;
  }

  renderControls({ isRunning, isFinished, canReset }) {
    this.startButton.disabled = isRunning || isFinished;
    this.pauseButton.disabled = !isRunning;
    this.resetButton.disabled = !canReset;
    this.modeButtons.forEach((button) => {
      button.disabled = isRunning;
    });
  }

  renderMode(activeMode) {
    this.modeButtons.forEach((button) => {
      const isActive = button.dataset.mode === activeMode;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  bindStart(handler) {
    this.startButton.addEventListener("click", handler);
  }

  bindPause(handler) {
    this.pauseButton.addEventListener("click", handler);
  }

  bindReset(handler) {
    this.resetButton.addEventListener("click", handler);
  }

  bindModeChange(handler) {
    this.modeButtons.forEach((button) => {
      button.addEventListener("click", () => handler(button.dataset.mode));
    });
  }
}
