import { applyFilter } from './tools.js';

export function createCanvasEditor({ canvas, emptyState, state, history }) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const image = new Image();
  image.crossOrigin = 'anonymous';

  let drawing = false;
  let lastPoint = null;
  let baseFrame = null;

  function resizeForImage(w = 1400, h = 900) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.aspectRatio = `${w} / ${h}`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawBackground() {
    ctx.save();
    ctx.fillStyle = '#11151d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function render() {
    const snap = state.snapshot;
    const w = canvas.clientWidth || 1400;
    const h = canvas.clientHeight || 900;
    resizeForImage(w, h);

    ctx.clearRect(0, 0, w, h);
    drawBackground();

    if (!snap.image) {
      emptyState.style.display = 'grid';
      updateHistoryInfo();
      return;
    }

    emptyState.style.display = 'none';

    const img = snap.image;
    const zoom = snap.zoom / 100;
    const angle = (snap.rotate * Math.PI) / 180;
    const filter = snap.filters?.mode || 'none';

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(angle);
    ctx.scale(zoom, zoom);

    const ratio = Math.min(w / img.width, h / img.height);
    const drawW = img.width * ratio;
    const drawH = img.height * ratio;
    const dx = -drawW / 2;
    const dy = -drawH / 2;

    ctx.filter = applyFilter(filter);
    ctx.globalAlpha = snap.opacity / 100;
    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.restore();

    if (!baseFrame) {
      history.pushCanvas(canvas, 'initial');
      baseFrame = true;
    }

    updateHistoryInfo();
  }

  function loadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        state.set('image', img);
        state.set('imageName', file.name);
        state.set('dirty', true);
        state.set('history', []);
        state.set('future', []);
        baseFrame = false;
        render();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function exportPNG() {
    const link = document.createElement('a');
    link.download = (state.get('imageName') || 'photo-editor') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function applyFrame(frame) {
    const img = new Image();
    img.onload = () => {
      state.set('image', img);
      render();
    };
    img.src = frame;
  }

  function resetEditor() {
    state.set('zoom', 100);
    state.set('rotate', 0);
    state.set('brushSize', 12);
    state.set('opacity', 100);
    state.set('filters', { mode: 'none' });
    render();
  }

  function updateHistoryInfo() {
    const box = document.getElementById('historyInfo');
    const historyCount = state.get('history').length;
    const futureCount = state.get('future').length;
    box.textContent = `History: ${historyCount} frame(s) • Redo stack: ${futureCount} frame(s)`;
  }

  function bindPointer() {
    canvas.addEventListener('pointerdown', (e) => {
      if (state.get('tool') !== 'brush' && state.get('tool') !== 'eraser') return;
      drawing = true;
      lastPoint = getPoint(e);
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      const point = getPoint(e);
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = state.get('tool') === 'eraser' ? '#11151d' : '#ffffff';
      ctx.globalAlpha = state.get('tool') === 'eraser' ? 1 : state.get('opacity') / 100;
      ctx.lineWidth = state.get('brushSize');
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      ctx.restore();
      lastPoint = point;
      state.set('dirty', true);
    });

    window.addEventListener('pointerup', () => {
      if (!drawing) return;
      drawing = false;
      history.pushCanvas(canvas, state.get('tool'));
      render();
    });
  }

  function getPoint(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function setFilter(mode) {
    state.set('filters', { mode });
    render();
  }

  function analyzeImage() {
    const box = document.getElementById('status');
    const img = state.get('image');
    if (!img) {
      box.textContent = 'No image loaded yet.';
      return null;
    }
    box.textContent = `Image loaded: ${state.get('imageName') || 'Untitled'}`;
    return { width: img.width, height: img.height };
  }

  bindPointer();

  return {
    render,
    loadFile,
    exportPNG,
    applyFrame,
    resetEditor,
    setFilter,
    analyzeImage,
    canvas,
    ctx,
  };
}
