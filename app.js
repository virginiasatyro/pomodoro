import { Timer } from "./timer.js";
import { UI } from "./ui.js";

class PomodoroApp {
  constructor() {
    this.timer = new Timer({ minutes: 25 });
    this.ui = new UI({
      displayElement: document.querySelector("#timer-display"),
    });
  }

  init() {
    this.ui.renderTime(this.timer.format());
  }
}

const app = new PomodoroApp();
app.init();
