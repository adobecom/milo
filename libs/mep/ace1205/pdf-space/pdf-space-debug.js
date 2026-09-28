import { createTag } from '../../../utils/utils.js';

/**
 * PDF-space debug overlay (?pdfspacedebug). Dynamic-imported only when the
 * query param is present so production never pays for it.
 *
 * @param {() => object} getState — called each update with the current
 *   animation snapshot. Expected fields: stage, breakpoint, viewportWidth,
 *   viewportHeight, scrollCurrent, animTotal, phase, settle, peelStartScroll,
 *   gridEnd, slottingStart, slottingDuration, columnSpread, rowGap,
 *   arcGridY, postRevealY, blockHeight.
 */
export default function createDebugOverlay(getState) {
  const el = createTag('div', { class: 'pdf-space-debug' });
  el.style.cssText = 'position:fixed;top:8px;left:8px;z-index:99999;'
    + 'background:rgba(0,0,0,0.78);color:#0f0;padding:8px 12px;'
    + 'font:12px/1.4 monospace;border-radius:4px;pointer-events:none;'
    + 'white-space:pre;font-variant-numeric:tabular-nums;';
  document.body.appendChild(el);

  // One-time effect: hide the site header so the debug HUD is unobstructed
  // and screen recordings are clean. Restored on destroy.
  const header = document.querySelector('header');
  const headerPrevDisplay = header?.style.display ?? '';
  if (header) header.style.display = 'none';

  let lastText = '';

  function update() {
    const s = getState();
    const scrollPct = s.animTotal ? (s.scrollCurrent / s.animTotal) * 100 : 0;
    const text = [
      `stage:    ${s.stage}`,
      `breakpt:  ${s.breakpoint}  (${s.viewportWidth}×${s.viewportHeight})`,
      `scroll:   ${scrollPct.toFixed(1)}%  (${s.scrollCurrent.toFixed(0)} / ${s.animTotal})  scrollY:${window.scrollY.toFixed(0)}`,
      '─────────────────────────────',
      `slideT:   ${s.phase.slideT.toFixed(3)}`,
      `arcPan:   ${s.phase.arcPan.toFixed(3)}`,
      `arcToGrd: ${s.phase.arcToGrid.toFixed(3)}`,
      `settle:   ${s.settle.toFixed(3)}`,
      `slotting: ${s.phase.slotting.toFixed(3)}`,
      '─────────────────────────────',
      `peelStart:${s.peelStartScroll.toFixed(0)}  gridEnd:${s.gridEnd}`,
      `slotting: ${s.slottingStart}  slottingDur:${s.slottingDuration}`,
      '─────────────────────────────',
      `colSprd:  ${s.columnSpread.toFixed(3)}`,
      `rowGap:   ${s.rowGap.toFixed(3)}`,
      `arcGridY: ${s.arcGridY.toFixed(1)}px`,
      `postRevY: ${s.postRevealY.toFixed(1)}px`,
      `blockH:   ${s.blockHeight}px`,
    ].join('\n');
    if (text === lastText) return;
    lastText = text;
    el.textContent = text;
  }

  function destroy() {
    el.remove();
    if (header) header.style.display = headerPrevDisplay;
  }

  return { update, destroy };
}
