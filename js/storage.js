export class Storage {
  constructor(key) {
    this.key = key;
  }

  save(value) {
    window.localStorage.setItem(this.key, JSON.stringify(value));
  }

  load() {
    const storedValue = window.localStorage.getItem(this.key);

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
    window.localStorage.removeItem(this.key);
  }
}
