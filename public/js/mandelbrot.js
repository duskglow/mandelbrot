// mandelbrot.js
// All Mandelbrot rendering logic goes here. Use async/await for any async operations.

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('mandelbrot-canvas');
  const ctx = canvas.getContext('2d');
  let params = {
    zoom: 1,
    centerX: -0.5,
    centerY: 0,
    maxIter: 100
  };
  let pendingParams = { ...params };
  let abortRender = false;
  let renderId = 0; // Unique ID for each render
  let lastCompletedRenderId = 0;
  let debounceTimeout = null;
  let throttleActive = false;
  let throttleQueued = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth - 250; // Account for control panel width
    canvas.height = window.innerHeight;
    drawMandelbrot();
  }

  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mandelbrot-params', (e) => {
    Object.assign(pendingParams, e.detail);
    drawMandelbrot();
  });

  // Mouse wheel/trackpad zoom support
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    abortRender = true;
    const { offsetX, offsetY, deltaY, ctrlKey } = e;
    const width = canvas.width;
    const height = canvas.height;
    const zoomFactor = ctrlKey ? 1.05 : 1.15;
    let zoom = pendingParams.zoom;
    let newZoom = deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
    newZoom = Math.max(0.5, newZoom);
    const scale = 3 / (Math.min(width, height) * zoom);
    const mouseX = offsetX - width / 2;
    const mouseY = offsetY - height / 2;
    const worldX = pendingParams.centerX + mouseX * scale;
    const worldY = pendingParams.centerY + mouseY * scale;
    const newScale = 3 / (Math.min(width, height) * newZoom);
    pendingParams.centerX = worldX - mouseX * newScale;
    pendingParams.centerY = worldY - mouseY * newScale;
    pendingParams.zoom = newZoom;
    // Throttle rendering for rapid wheel events
    if (!throttleActive) {
      throttleActive = true;
      drawMandelbrot().then(() => {
        setTimeout(() => {
          throttleActive = false;
          if (throttleQueued) {
            throttleQueued = false;
            drawMandelbrot();
          }
        }, 10); // 10ms throttle
      });
    } else {
      throttleQueued = true;
    }
  }, { passive: false });

  async function drawMandelbrot() {
    const thisRenderId = ++renderId;
    abortRender = false;
    const { zoom, centerX, centerY, maxIter, gradient = 'classic' } = pendingParams;
    const paramsSnapshot = { zoom, centerX, centerY, maxIter, gradient };
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const scaleX = 3 / (width * zoom);
    const scaleY = 3 / (height * zoom);
    const startTime = performance.now();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (abortRender || thisRenderId !== renderId) {
          return;
        }
        const cx = centerX + (x - width / 2) * scaleX;
        const cy = centerY + (y - height / 2) * scaleY;
        let zx = 0, zy = 0, iter = 0;
        while (zx * zx + zy * zy <= 4 && iter < maxIter) {
          const xtemp = zx * zx - zy * zy + cx;
          zy = 2 * zx * zy + cy;
          zx = xtemp;
          iter++;
        }
        const pixel = (y * width + x) * 4;
        let rgb;
        if (iter === maxIter) {
          rgb = [0, 0, 0];
        } else {
          rgb = getGradientColor(gradient, iter, maxIter);
        }
        data[pixel] = rgb[0];
        data[pixel + 1] = rgb[1];
        data[pixel + 2] = rgb[2];
        data[pixel + 3] = 255;
      }
    }
    // Only update UI if important params haven't changed and this is the latest render
    const unchanged =
      pendingParams.zoom === paramsSnapshot.zoom &&
      pendingParams.centerX === paramsSnapshot.centerX &&
      pendingParams.centerY === paramsSnapshot.centerY &&
      pendingParams.maxIter === paramsSnapshot.maxIter;
    if (!unchanged || thisRenderId !== renderId) {
      return;
    }
    Object.assign(params, paramsSnapshot);
    lastCompletedRenderId = thisRenderId;
    document.getElementById('zoom').value = zoom.toPrecision(12);
    document.getElementById('zoom-value').textContent = zoom.toFixed(2);
    document.getElementById('center-x').value = centerX.toFixed(5);
    document.getElementById('center-y').value = centerY.toFixed(5);
    ctx.putImageData(imageData, 0, 0);
    const elapsed = performance.now() - startTime;
    if (elapsed > 2000) {
      document.getElementById('zoom-value').textContent = zoom.toFixed(2) + ' (slow)';
    }
  }

  function getGradientColor(gradient, iter, maxIter) {
    const t = iter / maxIter;
    switch (gradient) {
      case 'classic':
        return hslToRgb(t, 1, 0.5);
      case 'fire':
        return [Math.round(255 * t), Math.round(80 * t), 0];
      case 'ice':
        return [0, Math.round(180 * t), Math.round(255 * t)];
      case 'rainbow':
        return hslToRgb(t, 1, 0.5);
      case 'forest':
        return [Math.round(34 * t), Math.round(139 * t), Math.round(34 + 100 * t)];
      case 'sunset':
        return [Math.round(255 * t), Math.round(94 * (1 - t)), Math.round(77 * (1 - t))];
      case 'ocean':
        return [Math.round(0), Math.round(105 * t), Math.round(148 + 107 * t)];
      case 'bw':
        const v = Math.round(255 * t);
        return [v, v, v];
      case 'psychedelic':
        return hslToRgb((t * 10) % 1, 1, 0.5);
      case 'pastel':
        return hslToRgb(t, 0.5, 0.8);
      default:
        return hslToRgb(t, 1, 0.5);
    }
  }

  function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Drag-to-pan logic
  let isDragging = false;
  let dragStart = { x: 0, y: 0, centerX: 0, centerY: 0 };

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    dragStart.centerX = pendingParams.centerX;
    dragStart.centerY = pendingParams.centerY;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const width = canvas.width;
    const height = canvas.height;
    const scale = 3 / (Math.min(width, height) * pendingParams.zoom);
    pendingParams.centerX = dragStart.centerX - dx * scale;
    pendingParams.centerY = dragStart.centerY - dy * scale;
    drawMandelbrot();
    document.getElementById('center-x').value = pendingParams.centerX.toFixed(5);
    document.getElementById('center-y').value = pendingParams.centerY.toFixed(5);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      canvas.style.cursor = 'default';
    }
  });

  resizeCanvas();
});
