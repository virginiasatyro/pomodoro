export class Timer {
  constructor({
    minutes = 25,
    remainingSeconds = null,
    onTick = () => {},
    onFinish = () => {},
  } = {}) {
    this.initialSeconds = Math.max(1, minutes) * 60;
    this.remainingSeconds = Number.isInteger(remainingSeconds)
      ? Math.min(Math.max(remainingSeconds, 0), this.initialSeconds)
      : this.initialSeconds;
    this.intervalId = null;
    this.onTick = onTick;
    this.onFinish = onFinish;
  }

  start() {
    if (this.intervalId || this.isFinished()) {
      return;
    }

    this.intervalId = window.setInterval(() => this.tick(), 1000);
  }

  pause() {
    if (!this.intervalId) {
      return;
    }

    window.clearInterval(this.intervalId);
    this.intervalId = null;
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.initialSeconds;
    this.onTick(this);
  }

  tick() {
    if (this.isFinished()) {
      this.pause();
      return;
    }

    this.remainingSeconds -= 1;

    if (this.isFinished()) {
      this.pause();
      this.onTick(this);
      this.onFinish(this);
      return;
    }

    this.onTick(this);
  }

  isRunning() {
    return Boolean(this.intervalId);
  }

  isFinished() {
    return this.remainingSeconds <= 0;
  }

  getRemainingSeconds() {
    return this.remainingSeconds;
  }

  getProgress() {
    return 1 - this.remainingSeconds / this.initialSeconds;
  }

  format() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
}
