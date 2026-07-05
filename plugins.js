export function createPluginHost(ctx) {
  const list = [];

  function register(plugin) {
    list.push(plugin);
  }

  function status(message) {
    const node = document.getElementById('status');
    node.textContent = message;
  }

  function init() {
    for (const plugin of list) {
      try {
        plugin.init?.({ ...ctx, status });
        status(`Loaded plugin: ${plugin.name}`);
      } catch (err) {
        console.error(err);
        status(`Plugin failed: ${plugin.name}`);
      }
    }
  }

  return { register, init };
}
