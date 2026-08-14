// Data lives in DA (private, auth-gated), never in this repo — see
// .claude/skills/design-tracker/SKILL.md's "Data lives in DA" section for
// why. Confirmed (three separate hosting contexts, all real browser tests):
// a page's own fetch()/img.src against content.da.live gets a real 401 —
// there is no transparent auth for that from arbitrary JS, only for da.live's
// own app and for Helix's server-side content fetch during page render. So
// entries.json (dates/magnitudes/element names — no images) is embedded
// directly in the block's own authored content at generation time — see
// SKILL.md's "Publishing the dashboard page" — read here, never fetched.
function readEmbeddedEntries(block) {
  const cell = block.querySelector(':scope > div:nth-child(1) > div');
  const text = cell?.textContent?.trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Images can't be embedded as base64 alongside the JSON above (screenshots
// alone, 500KB+ each as PNGs, blow past a ~1-2MB document-size limit on
// Helix's content-bus with more than a couple of days tracked — confirmed
// directly, a small entries.json-only page uploads fine, the same page with
// day-screenshots embedded gets a 409). Instead they're authored as real
// <img> tags in a hidden second row — confirmed Helix downloads and
// re-hosts any image actually referenced this way onto its own same-origin
// media_<hash> URL at render time, so by the time this code runs, each
// image's own `src` is already same-origin (no content.da.live fetch, no
// auth problem, no size problem — the reference stays lightweight in the
// source document). `alt` carries the key embed_page.py assigned it.
function readImageGallery(block) {
  const lookup = {};
  block.querySelectorAll(':scope > div:nth-child(2) img').forEach((img) => {
    if (img.alt) lookup[img.alt] = img.currentSrc || img.src;
  });
  return lookup;
}

function thumbKey(entry) {
  return `dt-thumb-${entry.figmaFileKey}-${(entry.figmaNodeId || 'file').replace(/:/g, '-')}`;
}

function dayKey(entry, day) {
  return `dt-day-${entry.figmaFileKey}-${(entry.figmaNodeId || 'file').replace(/:/g, '-')}-${day}`;
}

// Rewrites each entry's image references in place to the gallery's resolved
// (already re-hosted) src, so every render function downstream can keep
// treating figmaThumbnailUrl/dayScreenshots[day].path as a plain usable URL
// — falls back to the original DA URL when the key isn't in the gallery
// (e.g. local/dev testing without a real Helix render pass having run).
function resolveImages(entries, gallery) {
  entries.forEach((entry) => {
    const tKey = thumbKey(entry);
    if (entry.figmaThumbnailUrl && gallery[tKey]) entry.figmaThumbnailUrl = gallery[tKey];
    Object.entries(entry.dayScreenshots || {}).forEach(([day, shot]) => {
      const dKey = dayKey(entry, day);
      if (shot.path && gallery[dKey]) shot.path = gallery[dKey];
    });
  });
  return entries;
}

function entryDate(entry) {
  return entry.figmaLastModified || entry.addedDate || null;
}

function groupByTicket(entries) {
  const groups = new Map();
  entries.forEach((entry) => {
    const key = entry.jiraKey || 'untracked';
    if (!groups.has(key)) {
      groups.set(key, {
        jiraKey: entry.jiraKey,
        jiraUrl: entry.jiraUrl,
        jiraTitle: entry.jiraTitle,
        jiraStatus: entry.jiraStatus,
        designs: [],
      });
    }
    groups.get(key).designs.push(entry);
  });
  return [...groups.values()];
}

function latestDate(group) {
  return group.designs
    .map(entryDate)
    .filter(Boolean)
    .sort()
    .at(-1) || '';
}

function renderDesignCard(entry) {
  const a = document.createElement('a');
  a.className = 'design-card';
  if (entry.figmaUrl) {
    a.href = entry.figmaUrl;
    a.target = '_blank';
    a.rel = 'noopener';
  }

  const img = document.createElement('img');
  if (entry.figmaThumbnailUrl) img.src = entry.figmaThumbnailUrl;
  img.alt = entry.figmaFileName ? `${entry.figmaFileName} thumbnail` : 'Figma design thumbnail';
  a.append(img);

  const body = document.createElement('div');
  body.className = 'design-card-body';

  const name = document.createElement('div');
  name.className = 'design-card-name';
  name.textContent = entry.figmaFileName || 'Figma design';
  body.append(name);

  const date = document.createElement('div');
  date.className = 'design-card-date';
  const d = entryDate(entry);
  date.textContent = d ? new Date(d).toLocaleDateString() : 'no date';
  body.append(date);

  a.append(body);
  return a;
}

function groupByDay(changes) {
  const byDay = new Map();
  changes.forEach((c) => {
    if (!c.date) return; // skip malformed entries rather than throwing and blanking the page
    const day = c.date.slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(c);
  });

  const dayKeys = [...byDay.keys()].sort();
  if (!dayKeys.length) return [];

  // Continuous calendar range (including days with no versions) so the
  // x-axis reflects real elapsed time, not just the days that happened
  // to have activity.
  const days = [];
  const cursor = new Date(`${dayKeys[0]}T00:00:00Z`);
  const end = new Date(`${dayKeys[dayKeys.length - 1]}T00:00:00Z`);
  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10);
    const dayChanges = byDay.get(key) || [];
    days.push({
      day: key,
      changes: dayChanges,
      maxMagnitude: dayChanges.length ? Math.max(...dayChanges.map((c) => c.magnitude)) : 0,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

function renderRoadmap(entry, sinceValue) {
  const changes = (entry.versionChanges || []).filter((c) => c.magnitude !== null);
  if (!changes.length) return null;

  const days = groupByDay(changes);
  // Y-axis is scaled to the largest single-day change actually observed in
  // this design's history, not a fixed 0-100% — real changes are mostly
  // single-digit percentages, so a fixed scale would flatten everything.
  const maxMagnitude = Math.max(...days.map((d) => d.maxMagnitude), 0.01);
  const sinceTime = sinceValue ? new Date(sinceValue).getTime() : null;

  const wrap = document.createElement('div');
  wrap.className = 'roadmap';

  const title = document.createElement('div');
  title.className = 'roadmap-title';
  if (sinceTime !== null) {
    const count = changes.filter((c) => c.magnitude > 0 && new Date(c.date).getTime() >= sinceTime).length;
    title.textContent = `Change history — ${count} change${count === 1 ? '' : 's'} since ${new Date(sinceTime).toLocaleDateString()}`;
  } else {
    title.textContent = 'Change history';
  }
  wrap.append(title);

  const trackWrap = document.createElement('div');
  trackWrap.className = 'roadmap-track-wrap';

  const skipId = `roadmap-after-${Math.random().toString(36).slice(2)}`;
  const skipLink = document.createElement('a');
  skipLink.href = `#${skipId}`;
  skipLink.className = 'visually-hidden skip-timeline';
  skipLink.textContent = `Skip ${entry.figmaFileName || 'design'} timeline (${days.length} days)`;
  skipLink.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById(skipId).focus();
  });

  const track = document.createElement('div');
  track.className = 'roadmap-track';
  track.tabIndex = 0; // scrollable region needs to be keyboard-focusable to scroll without a mouse
  track.setAttribute('role', 'group');
  track.setAttribute('aria-label', 'Change history timeline, scrollable');

  const inner = document.createElement('div');
  inner.className = 'roadmap-track-inner';
  // One evenly-spaced slot per calendar day (not per version): a true date
  // axis, but without the overlap problem real time-proportional spacing
  // caused when several versions land in the same work session.
  const DAY_SLOT_WIDTH = 20; // px per day
  inner.style.width = `${Math.max(days.length * DAY_SLOT_WIDTH, 300)}px`;

  const bars = document.createElement('div');
  bars.className = 'roadmap-bars';

  const labels = document.createElement('div');
  labels.className = 'roadmap-day-labels';

  const summary = document.createElement('div');
  summary.className = 'roadmap-summary';
  summary.hidden = true;
  summary.tabIndex = -1; // not tab-stoppable, but focusable programmatically when revealed
  summary.setAttribute('aria-live', 'polite');

  const labelEvery = Math.max(1, Math.ceil(days.length / 10));

  days.forEach((dayBucket, index) => {
    const left = days.length > 1 ? (index / (days.length - 1)) * 100 : 50;
    const changeCount = dayBucket.changes.length;

    const bar = document.createElement('button');
    bar.type = 'button';
    bar.className = 'roadmap-bar';
    bar.style.left = `${left}%`;

    if (changeCount) {
      const heightPct = (dayBucket.maxMagnitude / maxMagnitude) * 100;
      bar.style.height = `${Math.max(heightPct, 4)}%`;
      if (dayBucket.maxMagnitude === 0) bar.classList.add('roadmap-bar-zero');
      bar.title = `${new Date(dayBucket.day).toLocaleDateString()} · ${changeCount} version${changeCount === 1 ? '' : 's'} · max ${dayBucket.maxMagnitude}% changed`;
      bar.setAttribute('aria-pressed', 'false');
      bar.setAttribute('aria-label', bar.title);
      bar.addEventListener('click', () => {
        inner.querySelectorAll('.roadmap-bar-selected').forEach((b) => {
          b.classList.remove('roadmap-bar-selected');
          b.setAttribute('aria-pressed', 'false');
        });
        bar.classList.add('roadmap-bar-selected');
        bar.setAttribute('aria-pressed', 'true');
        renderSummary(summary, dayBucket, entry);
        summary.focus();
      });
    } else {
      bar.style.height = '2%';
      bar.classList.add('roadmap-bar-empty');
      bar.disabled = true;
      bar.title = `${new Date(dayBucket.day).toLocaleDateString()} · no versions`;
    }

    if (sinceTime !== null && new Date(`${dayBucket.day}T00:00:00Z`).getTime() < sinceTime) {
      bar.classList.add('roadmap-bar-outside-range');
    }

    bars.append(bar);

    if (index % labelEvery === 0 || index === days.length - 1) {
      const label = document.createElement('div');
      label.className = 'roadmap-day-label';
      // Centered labels get clipped at the very start/end of the track
      // (half the text would render outside the 0-100% range), so the
      // first and last labels align inward instead of centering.
      if (index === 0) label.classList.add('roadmap-day-label-first');
      else if (index === days.length - 1) label.classList.add('roadmap-day-label-last');
      label.style.left = `${left}%`;
      label.textContent = new Date(`${dayBucket.day}T00:00:00Z`).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
      labels.append(label);
    }
  });

  inner.append(bars, labels);
  track.append(inner);
  trackWrap.append(track);

  const skipTarget = document.createElement('div');
  skipTarget.id = skipId;
  skipTarget.tabIndex = -1; // focus target only, not a tab stop

  const updateScrollAffordance = () => {
    const moreToScroll = track.scrollWidth - track.scrollLeft - track.clientWidth > 4;
    trackWrap.classList.toggle('roadmap-track-scrollable', moreToScroll);
  };
  track.addEventListener('scroll', updateScrollAffordance);
  window.addEventListener('resize', updateScrollAffordance);
  // Layout isn't final until the track is in the document — defer past the
  // current paint so scrollWidth/clientWidth reflect the rendered size.
  requestAnimationFrame(updateScrollAffordance);

  wrap.append(skipLink, trackWrap, skipTarget);
  wrap.append(summary);

  return wrap;
}

function figmaNodeUrl(entry, id) {
  if (!id) return entry.figmaUrl;
  // Deeply-nested instance-override IDs (e.g. "I392:15025;11468:11815;...")
  // aren't focusable via node-id links — Figma silently redirects to the
  // plain file URL instead. The first segment is the actual top-level
  // instance placed in the canvas, which does resolve correctly.
  const topLevelId = id.replace(/^I/, '').split(';')[0];
  const urlId = topLevelId.replace(/:/g, '-');
  return `https://www.figma.com/design/${entry.figmaFileKey}/x?node-id=${urlId}`;
}

// Keyed to the exact detail strings/prefixes describe_modification() in
// diff_versions.py produces — keep in sync with that function.
const DETAIL_CATEGORIES = [
  { match: (d) => d.startsWith('text'), label: 'text' },
  { match: (d) => d === 'fill/color changed', label: 'color' },
  { match: (d) => d === 'stroke changed', label: 'stroke' },
  { match: (d) => d === 'effect (shadow/blur) changed', label: 'shadow/blur' },
  { match: (d) => d === 'corner radius changed', label: 'corner radius' },
  { match: (d) => d.startsWith('rotation:'), label: 'rotation' },
  { match: (d) => d === 'auto-layout spacing/padding changed', label: 'spacing' },
  { match: (d) => d.startsWith('position moved:'), label: 'position' },
  { match: (d) => d.startsWith('size changed:'), label: 'size' },
  { match: (d) => d.startsWith('opacity:'), label: 'opacity' },
  { match: (d) => d.startsWith('visibility:'), label: 'visibility' },
];

// A raw list of "fill/color changed" / "size changed: 1920.0×15854.7 →
// 1920.0×15820.9" reads as an engineering diff, not a design summary — this
// gives non-technical viewers one plain-language line ("mostly color and
// position changes, 2 added") before the detailed list underneath it.
function summarizePlainLanguage(elements) {
  const typeCounts = {};
  const categoryCounts = new Map();
  elements.forEach((el) => {
    typeCounts[el.changeType] = (typeCounts[el.changeType] || 0) + 1;
    if (el.changeType === 'modified') {
      (el.details || []).forEach((d) => {
        const category = DETAIL_CATEGORIES.find((c) => c.match(d));
        if (category) categoryCounts.set(category.label, (categoryCounts.get(category.label) || 0) + 1);
      });
    }
  });

  const parts = [];
  const topCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([label]) => label);
  if (topCategories.length) parts.push(`mostly ${topCategories.join(' and ')} changes`);
  if (typeCounts.added) parts.push(`${typeCounts.added} added`);
  if (typeCounts.removed) parts.push(`${typeCounts.removed} removed`);
  if (typeCounts.recreated) parts.push(`${typeCounts.recreated} recreated`);

  if (!parts.length) return null;
  const text = parts.join(', ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function renderVersionSummary(change, entry) {
  const block = document.createElement('div');
  block.className = 'roadmap-summary-version';

  const versionHeader = document.createElement('div');
  versionHeader.className = 'roadmap-summary-version-header';
  versionHeader.textContent = `${new Date(change.date).toLocaleTimeString()} · ${change.author || 'unknown'} · ${change.magnitude}% changed`;
  block.append(versionHeader);

  const elements = change.changedElements || [];
  if (elements.length) {
    const count = document.createElement('div');
    count.className = 'roadmap-summary-count';
    const total = change.changedElementCount || elements.length;
    count.textContent = `${total} element${total === 1 ? '' : 's'} changed`;
    block.append(count);

    const plain = summarizePlainLanguage(elements);
    if (plain) {
      const plainLine = document.createElement('div');
      plainLine.className = 'roadmap-summary-plain';
      plainLine.textContent = plain;
      block.append(plainLine);
    }

    const list = document.createElement('ul');
    list.className = 'roadmap-summary-list';
    elements.forEach((el) => {
      const li = document.createElement('li');
      if (el.box) {
        // Only elements with a box actually have a matching highlight to
        // find — an added/removed node past the tree-walk depth or one
        // Figma didn't report a box for wouldn't have one, so skip wiring
        // this one up rather than jumping to nothing.
        li.dataset.elId = el.id; // looked up in the other direction by jumpToListItem() when a box is clicked
        li.classList.add('roadmap-summary-list-item-clickable');
        // Click, not hover — hovering while scanning down the list used to
        // fire this on every row passed over, which felt too twitchy/sudden.
        li.addEventListener('click', () => jumpToHighlight(li, el.id));
      }

      const line = document.createElement('div');
      line.className = 'roadmap-summary-item-name';
      const badge = document.createElement('span');
      badge.className = `roadmap-summary-badge roadmap-summary-badge-${el.changeType}`;
      badge.textContent = el.changeType;
      line.append(badge);

      const nameLink = document.createElement('a');
      nameLink.className = 'roadmap-summary-item-link';
      nameLink.href = figmaNodeUrl(entry, el.id);
      nameLink.target = '_blank';
      nameLink.rel = 'noopener';
      nameLink.textContent = el.name || '(unnamed)';
      nameLink.title = 'Open this element in Figma (current file state, not time-locked to this version)';
      line.append(nameLink);
      li.append(line);

      if (el.details && el.details.length) {
        const detailList = document.createElement('ul');
        detailList.className = 'roadmap-summary-details';
        el.details.forEach((d) => {
          const dLi = document.createElement('li');
          dLi.textContent = d;
          detailList.append(dLi);
        });
        li.append(detailList);
      }

      list.append(li);
    });
    block.append(list);
  } else if (change.magnitude > 0) {
    const note = document.createElement('div');
    note.className = 'roadmap-summary-note';
    note.textContent = 'Changed, but no specific element names identified.';
    block.append(note);
  } else {
    const note = document.createElement('div');
    note.className = 'roadmap-summary-note';
    note.textContent = 'No change from the previous version.';
    block.append(note);
  }

  return block;
}

function boxToPercent(box, nodeBox) {
  if (!box || !nodeBox || !nodeBox.width || !nodeBox.height) return null;
  return {
    left: ((box.x - nodeBox.x) / nodeBox.width) * 100,
    top: ((box.y - nodeBox.y) / nodeBox.height) * 100,
    width: (box.width / nodeBox.width) * 100,
    height: (box.height / nodeBox.height) * 100,
  };
}

const HIGHLIGHT_LEGEND = [
  { type: 'modified', label: 'Modified' },
  { type: 'added', label: 'Added' },
  { type: 'removed', label: 'Removed (last known position)' },
  { type: 'recreated', label: 'Recreated (new id, likely same content)' },
];

function renderHighlightLegend() {
  const legend = document.createElement('div');
  legend.className = 'roadmap-legend';
  HIGHLIGHT_LEGEND.forEach(({ type, label }) => {
    const item = document.createElement('span');
    item.className = 'roadmap-legend-item';
    const swatch = document.createElement('span');
    swatch.className = `roadmap-legend-swatch roadmap-legend-swatch-${type}`;
    item.append(swatch, document.createTextNode(label));
    legend.append(item);
  });
  return legend;
}

const SCREENSHOT_CAPTION_TEXT = 'This preview image can look the same as another day’s even when real changes happened — the colored boxes show what actually changed, based on the design data, not on comparing the pictures.';

// Shared between the small inline thumbnail and the enlarged modal view —
// highlight boxes are positioned as % of `container`, so `container` must
// be sized to match the image's own rendered box exactly in both places
// (no cropping/letterboxing), or these percentages point at the wrong spot.
//
// `summary` is the .roadmap-summary panel whose version-summary list has
// the matching row for each box — passed in explicitly rather than found
// via box.closest('.roadmap-summary') at click time, since a box rendered
// into the modal isn't nested under any summary (the modal is a singleton
// appended straight to <body>).
function renderHighlights(container, dayBucket, nodeBox, summary) {
  dayBucket.changes
    .flatMap((c) => c.changedElements || [])
    .forEach((el) => {
      const pct = boxToPercent(el.box, nodeBox);
      if (!pct) return;
      const box = document.createElement('div');
      box.className = `roadmap-highlight roadmap-highlight-${el.changeType}`;
      box.style.left = `${pct.left}%`;
      box.style.top = `${pct.top}%`;
      box.style.width = `${pct.width}%`;
      box.style.height = `${pct.height}%`;
      box.dataset.elId = el.id; // matched against a clicked row in the version-summary list, see jumpToHighlight()
      // No title tooltip: hover already surfaces this via the version-
      // summary list, so a redundant native tooltip on top of that (and on
      // top of the click behavior below) would just be noise.
      //
      // Not keyboard-focusable/AT-exposed on purpose — a design can have
      // hundreds of overlapping boxes (500+ isn't unusual), and every one
      // of those becoming a tab stop would be a much worse version of the
      // "too many tab stops" problem already flagged for the day-bars.
      // Keyboard/AT users have the exact same information (and can jump to
      // the same Figma element) via the fully-accessible list below.
      box.setAttribute('aria-hidden', 'true');
      box.addEventListener('click', (event) => {
        // Without this, the click bubbles up to the inner/modalInner
        // element beneath and also triggers ITS click handler (enlarge or
        // zoom-toggle) at the same time as jumping to the list row.
        event.stopPropagation();
        jumpToListItem(el.id, summary);
      });
      container.append(box);
    });
}

// Scopes to search for a matching highlight box when a version-summary row
// is clicked: the inline screenshot inside the same day's summary panel,
// plus the enlarged modal if it's currently open (it's a single global
// singleton appended to <body>, not nested under any one summary, so it
// isn't found by walking up from `li`).
function highlightScopesFor(li) {
  const scopes = [];
  const summary = li.closest('.roadmap-summary');
  if (summary) scopes.push(summary);
  const modal = document.querySelector('.image-modal');
  if (modal && !modal.hidden) scopes.push(modal);
  return scopes;
}

let activeHighlightBoxes = [];

// Clicking a row jumps to and highlights its matching box on the image
// (both the inline screenshot and, if open, the enlarged modal) — the
// reverse of jumpToListItem() below. This used to fire on hover instead,
// but that meant just scanning down the list re-triggered it on every row
// passed over, which felt too sudden/twitchy; a click is a deliberate act.
// Stays highlighted until a different row is clicked (which swaps it),
// not on any timer.
function jumpToHighlight(li, elId) {
  activeHighlightBoxes.forEach((box) => box.classList.remove('roadmap-highlight-active'));
  activeHighlightBoxes = [];

  highlightScopesFor(li).forEach((scope) => {
    scope.querySelectorAll('.roadmap-highlight').forEach((box) => {
      if (box.dataset.elId !== elId) return;
      // Only the matching box changes — every other box keeps its own
      // color and stays exactly as visible as it already was.
      box.classList.add('roadmap-highlight-active');
      activeHighlightBoxes.push(box);
      // Both the inline screenshot (max-height + overflow-y:auto) and the
      // enlarged modal (overflow:auto) can have the matching box scrolled
      // out of view for a tall design — "nearest" scrolls just enough to
      // bring it on-screen (or not at all if it's already visible).
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    });
  });
}

let jumpedListItem = null;

// The reverse of jumpToHighlight() above: clicking a box on the image jumps
// to and highlights its row in the (always-visible, never in the modal)
// version-summary list, scrolling it into view the same way clicking a row
// scrolls its box into view. Stays highlighted until a different box is
// clicked (which swaps it), not on any timer.
function jumpToListItem(elId, summary) {
  if (!summary) return;
  // Plain JS comparison rather than an attribute selector — Figma element
  // ids routinely contain ":" and ";" (e.g. instance-override ids like
  // "I392:15025;11468:11815;...") which don't need CSS-selector escaping
  // inside a quoted attribute value, but there's no upside to relying on
  // that being true versus just comparing the values directly.
  const li = [...summary.querySelectorAll('.roadmap-summary-list li')]
    .find((item) => item.dataset.elId === elId);
  if (!li) return;

  if (jumpedListItem) jumpedListItem.classList.remove('roadmap-summary-list-item-jumped');

  li.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  li.classList.add('roadmap-summary-list-item-jumped');
  jumpedListItem = li;
}

let imageModal = null;

// Single modal reused across every screenshot, rather than one per
// day-screenshot — simpler close/Escape/focus-return handling, and avoids
// dozens of hidden modal copies sitting in the DOM.
function getImageModal() {
  if (imageModal) return imageModal;

  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.hidden = true;

  const backdrop = document.createElement('div');
  backdrop.className = 'image-modal-backdrop';

  const dialog = document.createElement('div');
  dialog.className = 'image-modal-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Enlarged design preview');

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'image-modal-close';
  closeButton.setAttribute('aria-label', 'Close enlarged preview');
  closeButton.textContent = '×';

  const body = document.createElement('div');
  body.className = 'image-modal-body';

  dialog.append(closeButton, body);
  modal.append(backdrop, dialog);
  document.body.append(modal);

  let trigger = null;
  const close = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    body.textContent = '';
    document.body.classList.remove('image-modal-open');
    if (trigger) trigger.focus();
  };

  backdrop.addEventListener('click', close);
  closeButton.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  imageModal = {
    open(populate, triggerEl) {
      trigger = triggerEl;
      body.textContent = '';
      populate(body);
      modal.hidden = false;
      document.body.classList.add('image-modal-open');
      closeButton.focus();
    },
  };
  return imageModal;
}

function renderDayScreenshot(dayBucket, entry, summary) {
  const shot = (entry.dayScreenshots || {})[dayBucket.day];
  if (!shot) return null;

  const altText = `End-of-day design preview for ${dayBucket.day}`;

  const wrap = document.createElement('div');
  wrap.className = 'roadmap-screenshot';

  // Highlight boxes are positioned as percentages of THIS inner container,
  // which holds only the image — not of `wrap`, which also contains the
  // legend/caption below it (fixed pixel height regardless of image size,
  // which would throw off what "percentage of the wrapper" means relative
  // to the image alone). Verified this was a real, state-dependent
  // misalignment, not a testing artifact — keep img+highlights isolated in
  // their own sized container.
  const inner = document.createElement('div');
  inner.className = 'roadmap-screenshot-inner';
  inner.title = 'Click to enlarge';
  inner.tabIndex = 0;
  inner.setAttribute('role', 'button');
  inner.setAttribute('aria-label', 'Open enlarged design preview');

  const openModal = (event) => {
    getImageModal().open((body) => {
      const modalInner = document.createElement('div');
      modalInner.className = 'image-modal-inner image-modal-inner-fit';
      // The dialog's own max-width/max-height (set so the modal fits the
      // viewport on open) plus these are already-small source screenshots
      // (rendered server-side at ~700px on the longest edge) — a click
      // inside the modal zooms well past native resolution (some blur is an
      // acceptable trade for actually being able to see it bigger), scrolling
      // the dialog via its existing overflow:auto rather than being stuck at
      // whatever size happened to fit on open.
      const ZOOM_MULTIPLIER = 12;
      modalInner.tabIndex = 0;
      modalInner.setAttribute('role', 'button');
      modalInner.setAttribute('aria-label', 'Zoom in');
      modalInner.title = 'Click to zoom in';
      const toggleZoom = () => {
        const zoomingIn = modalInner.classList.contains('image-modal-inner-fit');
        modalInner.classList.toggle('image-modal-inner-fit');
        if (zoomingIn && modalImg.naturalWidth) {
          modalImg.style.width = `${modalImg.naturalWidth * ZOOM_MULTIPLIER}px`;
        } else {
          modalImg.style.width = '';
        }
        modalInner.title = zoomingIn ? 'Click to fit to window' : 'Click to zoom in';
        modalInner.setAttribute('aria-label', zoomingIn ? 'Fit to window' : 'Zoom in');
      };
      modalInner.addEventListener('click', toggleZoom);
      modalInner.addEventListener('keydown', (zoomEvent) => {
        if (zoomEvent.key === 'Enter' || zoomEvent.key === ' ') {
          zoomEvent.preventDefault();
          toggleZoom();
        }
      });

      const modalImg = document.createElement('img');
      modalImg.src = shot.path;
      modalImg.alt = altText;
      modalInner.append(modalImg);
      renderHighlights(modalInner, dayBucket, shot.nodeBox, summary);
      body.append(renderHighlightLegend(), modalInner);

      const caption = document.createElement('div');
      caption.className = 'roadmap-screenshot-caption';
      caption.textContent = SCREENSHOT_CAPTION_TEXT;
      body.append(caption);
    }, event.currentTarget);
  };
  inner.addEventListener('click', openModal);
  inner.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // prevent page scroll on Space
      openModal(event);
    }
  });

  const img = document.createElement('img');
  img.src = shot.path;
  img.alt = altText;
  inner.append(img);
  renderHighlights(inner, dayBucket, shot.nodeBox, summary);

  wrap.append(renderHighlightLegend());
  wrap.append(inner);

  const caption = document.createElement('div');
  caption.className = 'roadmap-screenshot-caption';
  caption.textContent = SCREENSHOT_CAPTION_TEXT;
  wrap.append(caption);

  return wrap;
}

function renderSummary(container, dayBucket, entry) {
  container.hidden = false;
  container.textContent = '';

  const header = document.createElement('div');
  header.className = 'roadmap-summary-header';
  const count = dayBucket.changes.length;
  header.textContent = `${new Date(`${dayBucket.day}T00:00:00Z`).toLocaleDateString()} · ${count} version${count === 1 ? '' : 's'}`;
  container.append(header);

  const body = document.createElement('div');
  body.className = 'roadmap-summary-body';

  const screenshot = renderDayScreenshot(dayBucket, entry, container);
  if (screenshot) body.append(screenshot);

  const versions = document.createElement('div');
  versions.className = 'roadmap-summary-versions';
  dayBucket.changes
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((change) => versions.append(renderVersionSummary(change, entry)));
  body.append(versions);

  container.append(body);
}

function renderDesignRow(entry, sinceValue) {
  const row = document.createElement('div');
  row.className = 'design-row';
  row.append(renderDesignCard(entry));

  const roadmap = renderRoadmap(entry, sinceValue);
  if (roadmap) row.append(roadmap);

  return row;
}

function renderGroup(group, sinceValue) {
  const section = document.createElement('section');
  section.className = 'ticket-group';

  const h2 = document.createElement('h2');
  const link = document.createElement('a');
  if (group.jiraUrl) {
    link.href = group.jiraUrl;
    link.target = '_blank';
    link.rel = 'noopener';
  }
  link.textContent = group.jiraKey || 'Untracked';
  h2.append(link);
  section.append(h2);

  const meta = document.createElement('div');
  meta.className = 'ticket-meta';
  meta.textContent = group.jiraTitle || '';
  if (group.jiraStatus) {
    const pill = document.createElement('span');
    pill.className = 'status-pill';
    pill.textContent = group.jiraStatus;
    meta.append(pill);
  }
  section.append(meta);

  const designs = document.createElement('div');
  designs.className = 'designs';
  group.designs
    .slice()
    .sort((a, b) => (entryDate(b) || '').localeCompare(entryDate(a) || ''))
    .forEach((entry) => designs.append(renderDesignRow(entry, sinceValue)));
  section.append(designs);

  return section;
}

function render(container, entries, sinceValue) {
  container.textContent = '';

  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No tracked design changes yet.';
    container.append(empty);
    return;
  }

  const groups = groupByTicket(entries)
    .sort((a, b) => latestDate(b).localeCompare(latestDate(a)));
  groups.forEach((group) => {
    // One malformed entry shouldn't blank the entire page — skip just that group.
    try {
      container.append(renderGroup(group, sinceValue));
    } catch (err) {
      console.error('Failed to render group', group.jiraKey, err);
    }
  });
}

// Builds the same header (title/subtitle/filter) that the standalone tool's
// index.html hardcoded as static markup — a block only gets an authored
// content div, so this structure has to be built at decorate() time instead.
function buildHeader(block) {
  const header = document.createElement('header');

  const titles = document.createElement('div');
  titles.className = 'header-titles';
  const h1 = document.createElement('h1');
  h1.textContent = 'Design Tracker';
  const subtitle = document.createElement('p');
  subtitle.className = 'header-subtitle';
  subtitle.textContent = "Figma design changes, grouped by the Jira ticket they belong to. Each chart below is scaled to that design's own biggest day of change — bar height isn't comparable between different designs.";
  titles.append(h1, subtitle);

  const sinceId = `design-tracker-since-${Math.random().toString(36).slice(2)}`;
  const sinceLabel = document.createElement('label');
  sinceLabel.setAttribute('for', sinceId);
  sinceLabel.textContent = 'Changes since';
  const sinceInput = document.createElement('input');
  sinceInput.type = 'date';
  sinceInput.id = sinceId;

  const filterStatus = document.createElement('div');
  filterStatus.className = 'visually-hidden';
  filterStatus.setAttribute('aria-live', 'polite');

  header.append(titles, sinceLabel, sinceInput, filterStatus);
  block.append(header);

  return { sinceInput, filterStatus };
}

export default async function decorate(block) {
  // Must read the authored data cell + image gallery before clearing
  // block.textContent below.
  const embedded = readEmbeddedEntries(block);
  const gallery = readImageGallery(block);
  if (embedded) resolveImages(embedded, gallery);

  block.textContent = '';
  const { sinceInput, filterStatus } = buildHeader(block);

  const container = document.createElement('main');
  container.textContent = 'Loading…';
  container.className = 'design-tracker-groups empty-state';
  block.append(container);

  let entries = [];
  let loadError = false;
  if (embedded) {
    entries = embedded;
  } else if (window.DESIGN_TRACKER_DATA_URL) {
    // Local/dev override only — production content always has embedded data,
    // since a live fetch against content.da.live is a confirmed 401 (see
    // readEmbeddedEntries's comment above).
    try {
      const res = await fetch(`${window.DESIGN_TRACKER_DATA_URL}?v=${Date.now()}`);
      entries = await res.json();
    } catch {
      loadError = true;
    }
  } else {
    loadError = true;
  }

  container.className = 'design-tracker-groups';
  if (loadError) {
    container.textContent = '';
    const error = document.createElement('div');
    error.className = 'empty-state';
    error.textContent = 'Could not load design tracker data — check that entries.json is reachable.';
    container.append(error);
    return;
  }

  const announceFilter = () => {
    // render() rebuilds the container silently — nothing else here tells a
    // screen-reader user that filtering happened. The filter dims
    // out-of-range bars rather than removing any design/row (see
    // roadmap-bar-outside-range in renderRoadmap), so the announcement
    // describes that, rather than claiming rows were hidden.
    if (!sinceInput.value) {
      filterStatus.textContent = 'Showing all designs, no date filter applied.';
      return;
    }
    const sinceTime = new Date(sinceInput.value).getTime();
    const count = entries.reduce((total, entry) => total + (entry.versionChanges || [])
      .filter((c) => c.magnitude > 0 && new Date(c.date).getTime() >= sinceTime).length, 0);
    filterStatus.textContent = `Highlighting ${count} change${count === 1 ? '' : 's'} since ${new Date(sinceTime).toLocaleDateString()} across all designs; older history is dimmed, not hidden.`;
  };

  render(container, entries, sinceInput.value);
  announceFilter();
  sinceInput.addEventListener('change', () => {
    render(container, entries, sinceInput.value);
    announceFilter();
  });
}
