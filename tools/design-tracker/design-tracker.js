const DATA_URL = '/tools/design-tracker/entries.json';

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
  a.href = entry.figmaUrl;
  a.target = '_blank';
  a.rel = 'noopener';

  const img = document.createElement('img');
  if (entry.figmaThumbnailUrl) img.src = entry.figmaThumbnailUrl;
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

  const track = document.createElement('div');
  track.className = 'roadmap-track';

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
      bar.addEventListener('click', () => {
        inner.querySelectorAll('.roadmap-bar-selected').forEach((b) => b.classList.remove('roadmap-bar-selected'));
        bar.classList.add('roadmap-bar-selected');
        renderSummary(summary, dayBucket, entry);
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
  wrap.append(track);
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

    const list = document.createElement('ul');
    list.className = 'roadmap-summary-list';
    elements.forEach((el) => {
      const li = document.createElement('li');

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

function renderDayScreenshot(dayBucket, entry) {
  const shot = (entry.dayScreenshots || {})[dayBucket.day];
  if (!shot) return null;

  const wrap = document.createElement('div');
  wrap.className = 'roadmap-screenshot';

  const img = document.createElement('img');
  img.src = shot.path;
  wrap.append(img);

  dayBucket.changes
    .flatMap((c) => c.changedElements || [])
    .forEach((el) => {
      const pct = boxToPercent(el.box, shot.nodeBox);
      if (!pct) return;
      const box = document.createElement('div');
      box.className = `roadmap-highlight roadmap-highlight-${el.changeType}`;
      box.style.left = `${pct.left}%`;
      box.style.top = `${pct.top}%`;
      box.style.width = `${pct.width}%`;
      box.style.height = `${pct.height}%`;
      box.title = `${el.changeType}: ${el.name || '(unnamed)'}`;
      wrap.append(box);
    });

  const caption = document.createElement('div');
  caption.className = 'roadmap-screenshot-caption';
  caption.textContent = 'End-of-day preview — may look identical on other days even when changes were detected (see SKILL.md); highlighted boxes come from the element diff, not from comparing images.';
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

  const screenshot = renderDayScreenshot(dayBucket, entry);
  if (screenshot) container.append(screenshot);

  const versions = document.createElement('div');
  versions.className = 'roadmap-summary-versions';
  dayBucket.changes
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((change) => versions.append(renderVersionSummary(change, entry)));
  container.append(versions);
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
  link.href = group.jiraUrl;
  link.target = '_blank';
  link.rel = 'noopener';
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

function render(entries, sinceValue) {
  const container = document.getElementById('groups');
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
  groups.forEach((group) => container.append(renderGroup(group, sinceValue)));
}

async function init() {
  let entries = [];
  try {
    const res = await fetch(DATA_URL);
    entries = await res.json();
  } catch {
    entries = [];
  }

  const sinceInput = document.getElementById('since');
  render(entries, sinceInput.value);
  sinceInput.addEventListener('change', () => render(entries, sinceInput.value));
}

init();
