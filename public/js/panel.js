// panel.js
// All control panel logic goes here. Use async/await for any async operations.

document.addEventListener('DOMContentLoaded', () => {
  const zoomInput = document.getElementById('zoom');
  const zoomValue = document.getElementById('zoom-value');
  const centerXInput = document.getElementById('center-x');
  const centerYInput = document.getElementById('center-y');
  const maxIterInput = document.getElementById('max-iter');
  const resetBtn = document.getElementById('reset-view');
  const gradientSelect = document.getElementById('gradient');

  // Remove any max attribute from zoom input to allow open-ended zoom
  zoomInput.removeAttribute('max');

  function updateZoomValue() {
    zoomValue.textContent = parseFloat(zoomInput.value).toFixed(2);
  }

  zoomInput.addEventListener('input', () => {
    updateZoomValue();
    window.dispatchEvent(new CustomEvent('mandelbrot-params', {
      detail: getParams()
    }));
  });

  [centerXInput, centerYInput, maxIterInput, gradientSelect].forEach(input => {
    input.addEventListener('change', () => {
      window.dispatchEvent(new CustomEvent('mandelbrot-params', {
        detail: getParams()
      }));
    });
  });

  resetBtn.addEventListener('click', () => {
    zoomInput.value = 1;
    centerXInput.value = -0.5;
    centerYInput.value = 0;
    maxIterInput.value = 100;
    gradientSelect.value = 'classic';
    updateZoomValue();
    window.dispatchEvent(new CustomEvent('mandelbrot-params', {
      detail: getParams()
    }));
  });

  const saveFavoriteBtn = document.createElement('button');
  saveFavoriteBtn.id = 'save-favorite';
  saveFavoriteBtn.textContent = 'Save Favorite';
  document.getElementById('control-panel').appendChild(saveFavoriteBtn);

  const loadFavoriteBtn = document.createElement('button');
  loadFavoriteBtn.id = 'load-favorite';
  loadFavoriteBtn.textContent = 'Load Favorite';
  document.getElementById('control-panel').appendChild(loadFavoriteBtn);

  saveFavoriteBtn.addEventListener('click', () => {
    const favorite = {
      zoom: parseFloat(zoomInput.value),
      centerX: parseFloat(centerXInput.value),
      centerY: parseFloat(centerYInput.value),
      maxIter: parseInt(maxIterInput.value, 10),
      gradient: gradientSelect.value
    };
    document.cookie = `mandelbrotFavorite=${encodeURIComponent(JSON.stringify(favorite))}; path=/; max-age=31536000`;
    alert('Favorite location saved!');
  });

  loadFavoriteBtn.addEventListener('click', () => {
    const match = document.cookie.match(/mandelbrotFavorite=([^;]+)/);
    if (match) {
      const favorite = JSON.parse(decodeURIComponent(match[1]));
      zoomInput.value = favorite.zoom;
      centerXInput.value = favorite.centerX;
      centerYInput.value = favorite.centerY;
      maxIterInput.value = favorite.maxIter;
      gradientSelect.value = favorite.gradient;
      updateZoomValue();
      window.dispatchEvent(new CustomEvent('mandelbrot-params', {
        detail: getParams()
      }));
    } else {
      alert('No favorite saved.');
    }
  });

  function getParams() {
    return {
      zoom: parseFloat(zoomInput.value),
      centerX: parseFloat(centerXInput.value),
      centerY: parseFloat(centerYInput.value),
      maxIter: parseInt(maxIterInput.value, 10),
      gradient: gradientSelect.value
    };
  }

  updateZoomValue();
});
