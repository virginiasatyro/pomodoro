import { Timer } from "./timer.js";
import { UI } from "./ui.js";
import { Storage } from "./storage.js";
import { Sound } from "./sound.js";

class PomodoroApp {
  constructor() {
    this.storage = new Storage("pomodoro-state");
    this.sound = new Sound();
    this.savedState = this.storage.load();
    this.ui = new UI({
      displayElement: document.querySelector("#timer-display"),
      progressElement: document.querySelector("#progress-bar"),
      statusElement: document.querySelector("#timer-status"),
      startButton: document.querySelector("#start-button"),
      pauseButton: document.querySelector("#pause-button"),
      resetButton: document.querySelector("#reset-button"),
    });
    this.timer = new Timer({
      minutes: 25,
      remainingSeconds: this.savedState?.remainingSeconds,
      onTick: () => this.render(),
      onFinish: () => {
        this.sound.play();
        this.ui.renderStatus("Sessao finalizada");
        this.storage.clear();
      },
    });
  }

  init() {
    this.ui.bindStart(() => this.start());
    this.ui.bindPause(() => this.pause());
    this.ui.bindReset(() => this.reset());
    this.render();
  }

  start() {
    this.timer.start();
    this.ui.renderStatus("Cronometro em andamento");
    this.render();
  }

  pause() {
    this.timer.pause();
    this.ui.renderStatus("Pausado");
    this.render();
  }

  reset() {
    this.timer.reset();
    this.storage.clear();
    this.ui.renderStatus("Pronto para iniciar");
  }

  render() {
    this.ui.renderTime(this.timer.format());
    this.ui.renderProgress(this.timer.getProgress());
    this.ui.renderControls({
      isRunning: this.timer.isRunning(),
      isFinished: this.timer.isFinished(),
    });

    this.storage.save({
      remainingSeconds: this.timer.getRemainingSeconds(),
      updatedAt: new Date().toISOString(),
    });
  }
}

const app = new PomodoroApp();
app.init();
