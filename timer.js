export class Timer {
  constructor({ minutes = 25 } = {}) {
    this.initialSeconds = minutes * 60;
    this.remainingSeconds = this.initialSeconds;
  }

  getRemainingSeconds() {
    return this.remainingSeconds;
  }

  format() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
}
