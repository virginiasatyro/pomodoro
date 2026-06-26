export class UI {
  constructor({
    displayElement,
    progressElement,
    statusElement,
    startButton,
    pauseButton,
    resetButton,
  }) {
    this.displayElement = displayElement;
    this.progressElement = progressElement;
    this.statusElement = statusElement;
    this.startButton = startButton;
    this.pauseButton = pauseButton;
    this.resetButton = resetButton;
  }

  renderTime(time) {
    this.displayElement.textContent = time;
    this.displayElement.setAttribute("aria-label", `Tempo restante: ${time}`);
  }

  renderProgress(progress) {
    const percentage = Math.round(progress * 100);
    this.progressElement.style.width = `${percentage}%`;
  }

  renderStatus(message) {
    this.statusElement.textContent = message;
  }

  renderControls({ isRunning, isFinished }) {
    this.startButton.disabled = isRunning || isFinished;
    this.pauseButton.disabled = !isRunning;
    this.resetButton.disabled = isRunning && isFinished;
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
}
