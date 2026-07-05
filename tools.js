export function applyFilter(mode) {
  switch (mode) {
    case 'grayscale': return 'grayscale(1)';
    case 'sepia': return 'sepia(1)';
    case 'invert': return 'invert(1)';
    case 'blur': return 'blur(2px)';
    case 'sharpen': return 'contrast(1.2) saturate(1.1)';
    default: return 'none';
  }
}

export function createToolManager(state, canvasEditor) {
  function setTool(tool) {
    state.set('tool', tool);
    document.querySelectorAll('[data-tool]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });
  }

  function setFilter(mode) {
    document.querySelectorAll('[data-filter]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === mode);
    });
    canvasEditor.setFilter(mode);
  }

  return { setTool, setFilter };
}
