const CONFIG = {
  spacing: 16,
  mobileSpacing: 24,
  dotSize: 1,
  mouseRadius: 125,
  repelForce: 20,
  spring: 0.01,
  damping: 0.59,
  dotColor: '#969696',
};

function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return [Math.floor(v / 65536) % 256, Math.floor(v / 256) % 256, v % 256];
}

export default function createCanvasGrid(canvas, {
  isMobile,
  getViewport,
  getCards,
  getCardCenter,
  getState,
}) {
  const ctx = canvas.getContext('2d');
  const mouse = { x: -9999, y: -9999 };
  let dots = [];

  function getSpacing() {
    return isMobile() ? CONFIG.mobileSpacing : CONFIG.spacing;
  }

  function buildGrid() {
    const { width, height } = getViewport();
    const sp = getSpacing();
    dots = [];
    const cols = Math.ceil(width / sp) + 2;
    const rows = Math.ceil(height / sp) + 2;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = c * sp;
        const y = r * sp;
        dots.push({
          ox: x, oy: y, x, y, vx: 0, vy: 0,
        });
      }
    }
  }

  function resize() {
    const { width, height } = getViewport();
    canvas.width = width;
    canvas.height = height;
    buildGrid();
  }

  function updateCardAnchors(layers) {
    if (!dots.length) return;
    const { width } = getViewport();
    const sp = getSpacing();
    const cols = Math.ceil(width / sp) + 2;
    layers.forEach((layer) => {
      layer.cards.forEach((card) => {
        const { x, y } = getCardCenter(card);
        const gc = Math.round(x / sp);
        const gr = Math.max(0, Math.round(y / sp));
        const idx = gr * cols + gc;
        card.dotIdx = Math.max(0, Math.min(dots.length - 1, idx));
        card.anchorX = dots[card.dotIdx].ox;
        card.anchorY = dots[card.dotIdx].oy;
      });
    });
  }

  function update() {
    const activeCards = getCards();
    dots.forEach((d) => {
      let effectiveMR = CONFIG.mouseRadius;
      let effectiveRF = CONFIG.repelForce;
      let boost = 0;

      activeCards.forEach((card) => {
        const { x, y } = getCardCenter(card);
        const cdx = mouse.x - x;
        const cdy = mouse.y - y;
        const cd = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cd < 280) boost = Math.max(boost, 1 - cd / 280);
      });

      if (boost > 0) {
        effectiveMR = CONFIG.mouseRadius * (1 + boost * 1.5);
        effectiveRF = CONFIG.repelForce * (1 + boost * 0.8);
      }

      const dx = d.x - mouse.x;
      const dy = d.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < effectiveMR && dist > 0) {
        const force = (1 - dist / effectiveMR) * effectiveRF;
        d.vx += (dx / dist) * force;
        d.vy += (dy / dist) * force;
      }

      d.vx += (d.ox - d.x) * CONFIG.spring;
      d.vy += (d.oy - d.y) * CONFIG.spring;
      d.vx *= CONFIG.damping;
      d.vy *= CONFIG.damping;
      d.x += d.vx;
      d.y += d.vy;
    });
  }

  function draw() {
    const { width, height } = getViewport();
    const { arcMode, arcToGridT, acrobatT } = getState();
    ctx.clearRect(0, 0, width, height);
    const [dr, dg, db] = hexToRgb(CONFIG.dotColor);
    const arcDotFade = arcMode ? arcToGridT : 1;
    const alpha = 0.45 * (arcMode ? 1 : (1 - acrobatT)) * arcDotFade;
    if (alpha <= 0) return;
    ctx.fillStyle = `rgba(${dr},${dg},${db},${alpha})`;

    dots.forEach((d) => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, CONFIG.dotSize, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const onMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  const onMouseLeave = () => {
    mouse.x = -9999;
    mouse.y = -9999;
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseleave', onMouseLeave);

  return {
    resize,
    updateCardAnchors,
    update,
    draw,
    destroy() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    },
  };
}
