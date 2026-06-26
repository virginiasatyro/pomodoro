export class Storage {
  constructor(key) {
    this.key = key;
  }

  save(value) {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(value));
    } catch {
      // Storage can fail in private mode or when the quota is full.
    }
  }

  load() {
    let storedValue = null;

    try {
      storedValue = window.localStorage.getItem(this.key);
    } catch {
      return null;
    }

    if (!storedValue) {
      return null;
    }

    try {
      return JSON.parse(storedValue);
    } catch {
      this.clear();
      return null;
    }
  }

  clear() {
    try {
      window.localStorage.removeItem(this.key);
    } catch {
      // Keep the app usable even when storage is unavailable.
    }
  }
}
