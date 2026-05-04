const CONFIG = {
  spacing: 40, // default 16
  mobileSpacing: 45, // 24
  dotSize: 1.2, // 1
  mouseRadius: 60, // 125
  repelForce: 20,
  spring: 0.01,
  damping: 0.59,
  dotColor: '#969696',
};

function hexToRgb(hex) {
  const hexValue = parseInt(hex.replace('#', ''), 16);
  return [Math.floor(hexValue / 65536) % 256, Math.floor(hexValue / 256) % 256, hexValue % 256];
}

const [DOT_RED, DOT_GREEN, DOT_BLUE] = hexToRgb(CONFIG.dotColor);

export default function createCanvasGrid(canvas, {
  isMobile,
  getViewport,
  getCards,
  getCardCenter,
  getState,
}) {
  const context = canvas.getContext('2d');
  const mouse = { x: -9999, y: -9999 };
  let dots = [];
  let settled = true;

  function getSpacing() {
    return isMobile() ? CONFIG.mobileSpacing : CONFIG.spacing;
  }

  function buildGrid() {
    const { width, height } = getViewport();
    const spacing = getSpacing();
    dots = [];
    const columnCount = Math.ceil(width / spacing) + 2;
    const rowCount = Math.ceil(height / spacing) + 2;
    for (let row = 0; row < rowCount; row += 1) {
      for (let column = 0; column < columnCount; column += 1) {
        const x = column * spacing;
        const y = row * spacing;
        dots.push({
          originX: x, originY: y, x, y, velocityX: 0, velocityY: 0,
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

  function updateCardAnchors(cards) {
    if (!dots.length) return;
    const { width } = getViewport();
    const spacing = getSpacing();
    const columnCount = Math.ceil(width / spacing) + 2;
    cards.forEach((card) => {
      const { x, y } = getCardCenter(card);
      const gridColumn = Math.round(x / spacing);
      const gridRow = Math.max(0, Math.round(y / spacing));
      const dotIndex = gridRow * columnCount + gridColumn;
      const clampedDotIdx = Math.max(0, Math.min(dots.length - 1, dotIndex));
      card.anchorX = dots[clampedDotIdx].originX;
      card.anchorY = dots[clampedDotIdx].originY;
    });
  }

  function update() {
    if (isMobile()) return;
    const mouseParked = mouse.x === -9999;
    if (mouseParked && settled) return;

    const activeCards = getCards();

    let currentMouseRadius = CONFIG.mouseRadius;
    let currentRepelForce = CONFIG.repelForce;
    let boost = 0;
    activeCards.forEach((card) => {
      const { x, y } = getCardCenter(card);
      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 280) boost = Math.max(boost, 1 - dist / 280);
    });
    if (boost > 0) {
      currentMouseRadius = CONFIG.mouseRadius * (1 + boost * 1.5);
      currentRepelForce = CONFIG.repelForce * (1 + boost * 0.8);
    }

    // 8k+ dots need raw loops
    let maxDisturbance = 0;
    for (let i = 0; i < dots.length; i += 1) {
      const dot = dots[i];
      const deltaX = dot.x - mouse.x;
      const deltaY = dot.y - mouse.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < currentMouseRadius && distance > 0) {
        const force = (1 - distance / currentMouseRadius) * currentRepelForce;
        dot.velocityX += (deltaX / distance) * force;
        dot.velocityY += (deltaY / distance) * force;
      }
      dot.velocityX += (dot.originX - dot.x) * CONFIG.spring;
      dot.velocityY += (dot.originY - dot.y) * CONFIG.spring;
      dot.velocityX *= CONFIG.damping;
      dot.velocityY *= CONFIG.damping;
      dot.x += dot.velocityX;
      dot.y += dot.velocityY;
      const disturb = Math.abs(dot.velocityX) + Math.abs(dot.velocityY)
        + Math.abs(dot.x - dot.originX) + Math.abs(dot.y - dot.originY);
      if (disturb > maxDisturbance) maxDisturbance = disturb;
    }
    settled = mouseParked && maxDisturbance < 0.05;
    if (settled) {
      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        dot.x = dot.originX;
        dot.y = dot.originY;
        dot.velocityX = 0;
        dot.velocityY = 0;
      }
    }
  }

  function draw() {
    const { width, height } = getViewport();
    const { arcToGridProgress } = getState();
    context.clearRect(0, 0, width, height);
    const alpha = 0.45 * arcToGridProgress;
    if (alpha <= 0) return;
    context.fillStyle = `rgba(${DOT_RED},${DOT_GREEN},${DOT_BLUE},${alpha})`;

    for (let i = 0; i < dots.length; i += 1) {
      context.beginPath();
      context.arc(dots[i].x, dots[i].y, CONFIG.dotSize, 0, Math.PI * 2);
      context.fill();
    }
  }

  const handleMouseMove = (e) => {
    if (isMobile()) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    settled = false;
  };
  const handleMouseLeave = () => {
    mouse.x = -9999;
    mouse.y = -9999;
  };

  canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
  canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });

  return {
    resize,
    updateCardAnchors,
    update,
    draw,
    destroy() {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    },
  };
}
