export function createState() {
  const data = {
    tool: 'move',
    zoom: 100,
    rotate: 0,
    brushSize: 12,
    opacity: 100,
    image: null,
    imageName: '',
    dirty: false,
    filters: { mode: 'none' },
    selection: null,
    history: [],
    future: [],
  };

  const listeners = new Set();

  function notify() {
    const snapshot = structuredClone(data);
    listeners.forEach((fn) => fn(snapshot));
  }

  return {
    get snapshot() {
      return structuredClone(data);
    },
    set(key, value) {
      data[key] = value;
      notify();
    },
    get(key) {
      return data[key];
    },
    merge(partial) {
      Object.assign(data, partial);
      notify();
    },
    onChange(fn) {
      listeners.add(fn);
      fn(structuredClone(data));
      return () => listeners.delete(fn);
    },
    patch(fn) {
      fn(data);
      notify();
    }
  };
}
