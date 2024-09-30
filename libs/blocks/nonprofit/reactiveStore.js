export default class ReactiveStore {
  data = null;

  loaded = false;

  loading = false;

  #initialData = null;

  #subscribers = [];

  constructor(initialData = null) {
    if (initialData) this.#initialData = initialData;
    this.data = initialData;
  }

  subscribe(fn, withTrigger = true) {
    if (!fn) return;
    if (!this.#subscribers.includes(fn)) this.#subscribers.push(fn);
    if (!withTrigger) return;
    fn(this.data, this.loading);
  }

  unsubscribe(fn) {
    const indexOfFn = this.#subscribers.indexOf(fn);
    if (indexOfFn !== -1) this.#subscribers.splice(indexOfFn, 1);
  }

  unsubscribeAll() {
    this.#subscribers = [];
  }

  update(data) {
    if (typeof data === 'function') this.data = data(this.data);
    else this.data = data;
    this.loaded = true;
    this.loading = false;
    this.#subscribers.forEach((subscriber) => {
      subscriber(this.data, this.loading);
    });
  }

  startLoading(resetData = false) {
    this.loading = true;
    if (resetData) this.data = this.#initialData;
    this.#subscribers.forEach((subscriber) => {
      subscriber(this.data, this.loading);
    });
  }
}
