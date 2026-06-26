import { Timer } from "./timer.js";
import { UI } from "./ui.js";
import { Storage } from "./storage.js";
import { Sound } from "./sound.js";

const MODES = {
  pomodoro: {
    label: "Pomodoro",
    minutes: 25,
    readyMessage: "Ready to focus",
    runningMessage: "Pomodoro in progress",
  },
  shortBreak: {
    label: "Short Break",
    minutes: 5,
    readyMessage: "Ready for a short break",
    runningMessage: "Short break in progress",
  },
  longBreak: {
    label: "Long Break",
    minutes: 15,
    readyMessage: "Ready for a long break",
    runningMessage: "Long break in progress",
  },
};

const DEFAULT_MODE = "pomodoro";
const STORAGE_KEY = "pomodoro-state";

class PomodoroApp {
  constructor() {
    this.storage = new Storage(STORAGE_KEY);
    this.sound = new Sound();
    this.savedState = this.storage.load();
    this.activeMode = this.getInitialMode();
    this.ui = new UI({
      displayElement: document.querySelector("#timer-display"),
      progressElement: document.querySelector("#progress-bar"),
      statusElement: document.querySelector("#timer-status"),
      startButton: document.querySelector("#start-button"),
      pauseButton: document.querySelector("#pause-button"),
      resetButton: document.querySelector("#reset-button"),
      modeButtons: document.querySelectorAll("[data-mode]"),
    });
    this.timer = new Timer({
      minutes: MODES[this.activeMode].minutes,
      remainingSeconds: this.getInitialRemainingSeconds(),
      onTick: () => this.render(),
      onFinish: () => {
        this.sound.play();
        this.ui.renderStatus("Session finished");
        this.storage.clear();
      },
    });
  }

  init() {
    this.ui.bindStart(() => this.start());
    this.ui.bindPause(() => this.pause());
    this.ui.bindReset(() => this.reset());
    this.ui.bindModeChange((mode) => this.changeMode(mode));
    window.addEventListener("beforeunload", () => this.saveState());

    this.ui.renderStatus(this.getInitialStatus());
    this.render();

    if (this.shouldResumeTimer()) {
      this.start();
    }
  }

  start() {
    this.timer.start();
    this.ui.renderStatus(MODES[this.activeMode].runningMessage);
    this.render();
  }

  pause() {
    this.timer.pause();
    this.ui.renderStatus("Paused");
    this.render();
  }

  reset() {
    this.timer.reset();
    this.ui.renderStatus(MODES[this.activeMode].readyMessage);
    this.render();
  }

  changeMode(mode) {
    if (!MODES[mode] || this.timer.isRunning() || mode === this.activeMode) {
      return;
    }

    this.activeMode = mode;
    this.timer.setDuration(MODES[mode].minutes);
    this.ui.renderStatus(MODES[mode].readyMessage);
    this.render();
  }

  render() {
    this.ui.renderTime(this.timer.format());
    this.ui.renderProgress(this.timer.getProgress());
    this.ui.renderMode(this.activeMode);
    this.ui.renderControls({
      isRunning: this.timer.isRunning(),
      isFinished: this.timer.isFinished(),
      canReset: this.timer.getRemainingSeconds() < this.timer.getInitialSeconds(),
    });

    this.saveState();
  }

  saveState() {
    this.storage.save({
      mode: this.activeMode,
      remainingSeconds: this.timer.getRemainingSeconds(),
      isRunning: this.timer.isRunning(),
      updatedAt: new Date().toISOString(),
    });
  }

  getInitialMode() {
    const savedMode = this.savedState?.mode;

    if (MODES[savedMode]) {
      return savedMode;
    }

    return DEFAULT_MODE;
  }

  getInitialRemainingSeconds() {
    const remainingSeconds = this.savedState?.remainingSeconds;

    if (!Number.isInteger(remainingSeconds)) {
      return null;
    }

    if (!this.savedState?.isRunning) {
      return remainingSeconds;
    }

    return Math.max(remainingSeconds - this.getElapsedSeconds(), 0);
  }

  getElapsedSeconds() {
    const updatedAt = Date.parse(this.savedState?.updatedAt);

    if (Number.isNaN(updatedAt)) {
      return 0;
    }

    return Math.floor((Date.now() - updatedAt) / 1000);
  }

  getInitialStatus() {
    if (this.timer.isFinished()) {
      return "Session finished";
    }

    if (this.savedState?.isRunning) {
      return MODES[this.activeMode].runningMessage;
    }

    if (this.timer.getRemainingSeconds() < this.timer.getInitialSeconds()) {
      return "Paused";
    }

    return MODES[this.activeMode].readyMessage;
  }

  shouldResumeTimer() {
    return Boolean(this.savedState?.isRunning) && !this.timer.isFinished();
  }
}

const app = new PomodoroApp();
app.init();
