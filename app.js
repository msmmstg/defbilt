import { createState } from './state.js';
import { createHistory } from './history.js';
import { createCanvasEditor } from './canvas.js';
import { createToolManager } from './tools.js';
import { createPluginHost } from './plugins.js';
import { wireUI } from './ui.js';

const state = createState();
const history = createHistory(state);
const canvasEditor = createCanvasEditor({
  canvas: document.getElementById('editorCanvas'),
  emptyState: document.getElementById('emptyState'),
  state,
  history
});
const tools = createToolManager(state, canvasEditor);
const plugins = createPluginHost({ state, canvasEditor, tools, history });

window.photoEditor = {
  state,
  canvasEditor,
  tools,
  history,
  plugins,
};

wireUI({ state, canvasEditor, tools, history, plugins });

plugins.register({
  name: 'base-filters',
  init(api) {
    api.state.set('filters', { mode: 'none' });
    api.status('Base filter plugin ready.');
  }
});

plugins.register({
  name: 'autosave',
  init(api) {
    const saved = localStorage.getItem('photo-editor-preferences');
    if (saved) {
      try {
        api.state.merge(JSON.parse(saved));
      } catch {}
    }
    api.state.onChange((snapshot) => {
      localStorage.setItem('photo-editor-preferences', JSON.stringify(snapshot));
    });
  }
});

canvasEditor.render();
tools.setTool('move');
plugins.init();
