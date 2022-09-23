export default class Storage {
  readonly values: Record<string, any>;
  constructor() {
    this.values = {};
  }

  has(key: string, id: string | number) {
    return typeof this.get(key, id) !== "undefined";
  }

  set(key: string, id: string | number, ...args: any[]) {
    const store = this.get(key);
    const values = Array.from(args);
    if (values.length === 1) {
      store[id] = values[0];
    } else {
      store[id] = values;
    }
  }

  get(key: string, id: string | number | undefined = undefined) {
    if (typeof this.values[key] === "undefined") {
      this.values[key] = {};
    }

    if (!id) {
      return this.values[key];
    }

    return this.values[key][id];
  }

  import(storage: Storage) {
    Object.keys(storage.values).forEach((key) => {
      this.values[key] = storage.values[key];
    });
  }
}
