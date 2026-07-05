export function createHistory(state) {
  const MAX = 20;

  function pushCanvas(canvas, label = 'edit') {
    const frame = canvas.toDataURL('image/png');
    const history = state.get('history').slice(0, MAX - 1);
    history.push({ label, frame });
    state.set('history', history);
    state.set('future', []);
  }

  function undo(applyFrame) {
    const history = state.get('history').slice();
    if (history.length < 2) return;
    const current = history.pop();
    const future = state.get('future').slice();
    future.push(current);
    state.set('future', future);
    state.set('history', history);
    const previous = history[history.length - 1];
    if (previous) applyFrame(previous.frame);
  }

  function redo(applyFrame) {
    const future = state.get('future').slice();
    if (!future.length) return;
    const frame = future.pop();
    const history = state.get('history').slice();
    history.push(frame);
    state.set('history', history);
    state.set('future', future);
    applyFrame(frame.frame);
  }

  return { pushCanvas, undo, redo };
}
