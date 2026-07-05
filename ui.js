export function wireUI({ state, canvasEditor, tools, history, plugins }) {
  const fileInput = document.getElementById('fileInput');
  const saveBtn = document.getElementById('saveBtn');
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  const resetBtn = document.getElementById('resetBtn');
  const fitBtn = document.getElementById('fitBtn');
  const pyAnalyzeBtn = document.getElementById('pyAnalyzeBtn');

  const zoom = document.getElementById('zoom');
  const rotate = document.getElementById('rotate');
  const brushSize = document.getElementById('brushSize');
  const opacity = document.getElementById('opacity');

  fileInput.addEventListener('change', () => canvasEditor.loadFile(fileInput.files?.[0]));
  saveBtn.addEventListener('click', () => canvasEditor.exportPNG());
  undoBtn.addEventListener('click', () => history.undo((frame) => canvasEditor.applyFrame(frame)));
  redoBtn.addEventListener('click', () => history.redo((frame) => canvasEditor.applyFrame(frame)));
  resetBtn.addEventListener('click', () => canvasEditor.resetEditor());
  fitBtn.addEventListener('click', () => canvasEditor.render());

  zoom.addEventListener('input', () => { state.set('zoom', Number(zoom.value)); canvasEditor.render(); });
  rotate.addEventListener('input', () => { state.set('rotate', Number(rotate.value)); canvasEditor.render(); });
  brushSize.addEventListener('input', () => state.set('brushSize', Number(brushSize.value)));
  opacity.addEventListener('input', () => state.set('opacity', Number(opacity.value)));

  document.querySelectorAll('[data-tool]').forEach((btn) => {
    btn.addEventListener('click', () => tools.setTool(btn.dataset.tool));
  });

  document.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => tools.setFilter(btn.dataset.filter));
  });

  pyAnalyzeBtn.addEventListener('click', async () => {
    const analyzer = window.photoEditorPy?.analyze;
    const status = document.getElementById('status');
    if (typeof analyzer !== 'function') {
      status.textContent = 'Python panel not ready yet.';
      return;
    }
    const result = await analyzer();
    if (result) {
      document.getElementById('pyOutput').textContent =
        `Python says: ${result.width} × ${result.height} px • avg brightness ${result.avgBrightness}`;
    }
  });

  window.addEventListener('resize', () => canvasEditor.render());

  state.onChange((snapshot) => {
    zoom.value = snapshot.zoom;
    rotate.value = snapshot.rotate;
    brushSize.value = snapshot.brushSize;
    opacity.value = snapshot.opacity;
    document.getElementById('status').textContent =
      snapshot.image ? `Editing ${snapshot.imageName || 'image'} • Tool: ${snapshot.tool}` : 'Idle. Load an image to start.';
  });
}
