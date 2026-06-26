export class UI {
  constructor({ displayElement }) {
    this.displayElement = displayElement;
  }

  renderTime(time) {
    this.displayElement.textContent = time;
    this.displayElement.setAttribute("aria-label", `Tempo restante: ${time}`);
  }
}
