from js import document, window
from pyscript import storage
import math

async def bootstrap():
    prefs = await storage("photo-editor-prefs")
    window.photoEditorPyPrefs = prefs
    status = document.getElementById("pyOutput")
    status.textContent = "PyScript is online."

async def analyze():
    editor = getattr(window, "photoEditor", None)
    if editor is None:
      return None

    canvas = document.getElementById("editorCanvas")
    ctx = canvas.getContext("2d", { "willReadFrequently": True })

    width = canvas.width
    height = canvas.height
    if width == 0 or height == 0:
        return None

    # Pull a small sample so the analysis stays fast.
    sample = ctx.getImageData(0, 0, min(240, width), min(240, height)).data
    total = 0
    count = 0
    for i in range(0, len(sample), 4):
        r = sample[i]
        g = sample[i + 1]
        b = sample[i + 2]
        total += round((r + g + b) / 3)
        count += 1

    avg = round(total / count) if count else 0

    prefs = await storage("photo-editor-prefs")
    prefs["last_avg_brightness"] = avg
    prefs["last_image_size"] = [width, height]
    await prefs.sync()

    document.getElementById("pyOutput").textContent = f"Python saved prefs. Avg brightness: {avg}"
    return {
        "width": width,
        "height": height,
        "avgBrightness": avg,
    }

window.photoEditorPy = {
    "analyze": analyze,
}

await bootstrap()
